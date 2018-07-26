<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div ref="chat" class="chat-wrapper">

    <header class="chat-header">
      一起嗨聊--!
      <!-- <mu-appbar title="Connect With You"></mu-appbar> -->
    </header>

    <div class="chat-body">
      <!-- <mu-container class="demo-container is-stripe"> -->
      <mu-row >
        <mu-col span="12" sm="3" md="3" lg="3" xl="3" class="chat-body-list">
          <div class="grid-cell chat-userlist">
            <div class="chat-sub-header">(｡･∀･)ﾉﾞ嗨！{{userInfo.username}}</div>
            <mu-list >
              
              <mu-list-item class="chat-list-item" @click="openFullscreenDialog(item)" avatar button :ripple="false" v-for="item in userlist" :key="item.user">
                <mu-list-item-action >
                  <mu-avatar>
                    <img src="../assets/images/user.png">
                  </mu-avatar>
                  <!-- <div>sdf</div> -->
                 </mu-list-item-action>
                <mu-list-item-title>{{item.username}}</mu-list-item-title>
              </mu-list-item> 
            </mu-list>
          </div>
        </mu-col>

        <!-- pc -->
        <mu-col span="9" sm="9" md="9" lg="9" xl="9"  v-show="false">
          <div class=" chat-showbox">
            <div class="chat-showInfo">

            </div>
            <div class="chat-inputText">
              <!-- <textarea></textarea> -->
              <!-- <mu-text-field v-model="message" multi-line :rows="4" full-width></mu-text-field><br/> -->
            </div>
          </div>
        </mu-col>

        <!-- 移动端 -->
         <mu-dialog ref="dialog" width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
          <mu-appbar color="primary" :title='talkManInfo.username' class="chat-dialog-appbar">
            <mu-button slot="left" icon @click="closeFullscreenDialog">
              <mu-icon value="arrow_back" left></mu-icon>
            </mu-button>
          </mu-appbar>

          <div class="chat-dialog-body">
            
            <!-- 消息框 -->
            <section class="chat-dialog-msgbox">
              
             <div class="msg-container" v-for="item in messageList" >
                <div class="msg-title">
                  <span class="msg-user">{{item.sender}}</span>
                  <span class="msg-time">{{item.time}}</span>
                </div>

                <div  class="msg-text">
                    <span>{{item.message}}</span>
                </div>

                <div  v-if="!!item.picture" class="msg-img">
                    <img :src="item.picture" alt="">
                  </div>
                </div>
             
            </section>
            <!-- 输入框 -->
             <mu-row gutter class="chat-dialog-inputbox">
              <mu-col span="8"><mu-text-field class="chat-dialog-input"  v-model="messageText" placeholder="请输入文字"></mu-text-field></mu-col>
              <!-- <mu-col span="2"><mu-button class="chat-dialog-sendbtn"   small  color="primary" @click="sendMsg">发送</mu-button></mu-col> -->
               <mu-col span="2"><div class="chat-dialog-sendbtn"  @click="sendMsg">发送</div></mu-col>
               <mu-col span="2"><div class="chat-dialog-sendbtn" >
                 <input type="file" multiple accept="image/*" @change="uploadImg" >
                </div></mu-col>
              
            </mu-row>
            <!-- <section class="chat-dialog-inputbox">
              
               
            </section> -->
          </div>
        </mu-dialog>
      </mu-row>
      <!-- </mu-container> -->

    </div>

    <footer class="chat-footer">
      <!-- <mu-container> -->
      <mu-bottom-nav color="#168ad6" class="chat-footer-nav">
        <mu-bottom-nav-item title="Recents" icon="restore"></mu-bottom-nav-item>
        <mu-bottom-nav-item title="Favorites" icon="favorite"></mu-bottom-nav-item>
        <mu-bottom-nav-item title="Nearby" icon="location_on"></mu-bottom-nav-item>
      </mu-bottom-nav>
      <!-- </mu-container> -->
    </footer>
  </div>

  <!-- </mu-flex> -->
</template>
<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      // 当前用户信息
      userInfo: {},
      // 在线用户列表
      userlist: [],
      openFullscreen: false,
      messageText: "",
      // 当前聊天的用户信息
      talkManInfo: {},
      // 保存消息的列表
      messageList: [],
      // 新消息列表
      newMessageList: [],
      // 历史消息列表
      historyMessageList: [],
      picture: ""
    };
  },
  methods: {
    // 上传图片
    uploadImg(event) {
      // 新建读取文件的对象
      let reader = new FileReader();
      // 获得图片
      let file = event.target.files[0];
      let that = this;
      console.log("file");
      console.log(file);
      console.log(file.size);
      console.log(file.type);
      // 使用reader读取file
      reader.readAsDataURL(file);
      // 读取完成后，在result中获取base64编码

      reader.onload = function() {
        that.picture = this.result;
        that.sendMsg();
      };
    },
    // 打开对话框
    openFullscreenDialog(item) {
      this.openFullscreen = true;
      // 获取对话用户信息
      this.talkManInfo = item;
      this.getHistoryMessage(item);
    },
    // 获取历史消息
    getHistoryMessage(item) {
      // 检查当前用户是否有本地存储
      let that = this;
      let username = that.userInfo.username;
      let peer = that.talkManInfo.username;
      // 发送请求
      this.$http
        .get("/api/gethistory?username=" + username + "&peer=" + peer)
        .then(data => {
          console.log(data);
          let historymessage = data.data.data;
          // 存放在历史消息列表
          that.messageList.push.apply(that.messageList, historymessage);
          // that.messageList.concat(historymessage);
          console.log(historymessage);
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeFullscreenDialog() {
      this.openFullscreen = false;
      // 清除聊天人信息
      this.talkManInfo = {};
      // 清除聊天信息
      this.messageList.length = 0;
    },

    websocketFun() {
      // 连接ws
      let socket = io.connect("ws://localhost:8000/");
      //   接受广播的消息例子 登录用户显示
      let that = this;
      // 发送消息增加一个用户
      socket.emit("new user", that.userInfo);

      // 接受广播
      socket.on("broadcast message all", function(data) {
        that.userlist = data;
        console.log("socket....");
        console.log(that.userlist);
      });

      // 接收私人消息
      socket.on("receive private meassge", function(data) {
        console.log(data);
        data.type = 2;
        that.messageList.push(data);
      });
    },
    // 发送我的消息
    sendMsg() {
      // 连接ws
      let socket = io.connect("ws://localhost:8000/");
      let that = this;
      let time = new Date();

      let data = {
        from: that.userInfo.username,
        to: that.talkManInfo.username,
        socketid: that.talkManInfo.socketid,
        message: that.messageText,
        picture: that.picture || null,
        time: time.toLocaleString(),
        type: 1
      };

      // 发送消息到服务器
      socket.emit("send private message", data);

      let mydate = {
        sender: that.userInfo.username,
        message: that.messageText,
        picture:that.picture || null,
        time: time.toLocaleString()
      };
      // 添加到消息列表中
      that.messageList.push(mydate);

      // 清空输入框和图片
      this.messageText = "";
      this.picture = null;
    }
  },
  mounted() {
    // 获得布局视口高度，设置外围高度
    this.$refs.chat.style.height = document.documentElement.clientHeight + "px";
    // this.$refs.dialog.style.height = document.documentElement.clientHeight + "px";

    // 请求用户数据
    this.$http
      .get("/api/chat")
      .then(data => {
        this.userInfo = data.data.data;
        this.websocketFun();
      })
      .catch(err => {
        console.log(err);
      });

    // 使用localstorge存储
    // var storage = window.localStorage;
    // var data1 = {
    //     peer: "22",
    //     msg: [
    //       {
    //         msg: "xx",
    //         time: "ddd"
    //       }
    //     ]
    //   };
    //   var data2 = {
    //     peer: "23",
    //     msg: [
    //       {
    //         msg: "xx",
    //         time: "ddd"
    //       }
    //     ]
    //   };
    // var arr = [];
    // arr.push(data1);
    // arr.push(data2);
    // arr = JSON.stringify(arr);
    // storage.setItem('xxx',arr);

    // var d = storage.getItem('xxx');
    // console.log(JSON.parse(d)[0]);
  }
};
</script>

<style>
.msg-img {
  width: 50%;
  height: 50%;
  padding: 5px;
  /* border:1px solid #000; */
  /* border-radius: 10px; */
}
.msg-img img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.msg-container {
  /* border:1px solid rgb(196, 196, 196); */
  box-shadow: 1px 1px 5px #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  background-color: #d0f3e0;
}
.chat-sub-header {
  margin: 5px;
  height: 20px;
}
.chat-list-item {
  border: 1px solid #fff;
  border-radius: 10px;
  background: rgb(116, 172, 218);
}
.chat-dialog-input {
  padding-left: 10px;
  width: 100%;
}
.chat-dialog-sendbtn {
  margin-left: 10px;
  margin-top: 10px;
  background-color: #2196f3;
  border-radius: 5px;
  color: #fff;
  width: 100%;
  text-align: center;
  /* border: 1px solid red; */
  /* text-align: center; */
  /* background:red; */
}
.mu-dialog-body {
  height: 100%;
}
.chat-dialog-appbar {
  height: 10%;
}
.chat-dialog-body {
  /* width:100%; */
  position: relative;
  /* background:red; */
  height: 100%;
}
.chat-dialog-inputbox {
  padding: 10px;
  height: 10%;
  /* background:blue; */
}

.chat-dialog-msgbox {
  height: 80%;
  background: rgb(255, 255, 255);
  overflow: auto;
}

.chat-wrapper {
  position: relative;
  /* margin: 0 auto; */
  width: 100%;
  /* height:600px; */
}

.chat-header {
  height: 8%;
  width: 100%;
  position: absolute;
  top: 0px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 200%;
  background: #2196f3;
  color: #fff;
}
.chat-body {
  position: absolute;
  top: 8%;
  width: 100%;
  height: 84%;
  background: #e2e1d9;
  /* border:1px solid red; */
}
.chat-body-list {
  position: absolute;
  background: rgb(247, 246, 246);
  height: 100%;
}
.chat-footer {
  /* border: 1px solid #000; */
  background-color: #168ad6;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 8%;
}
.chat-footer-nav {
  height: 100%;
}

.chat-userlist {
  /* border-right:1px solid #000; */
  /* min-height: 400px; */
}

.chat-showbox {
  /* border-left: 1px solid #000; */
  position: relative;
  /* min-height: 400px; */
}

.chat-showInfo {
  /* height: 250px; */
}

.chat-inputText {
  /* position: absolute;
    bottom: 0px;
    width: 100%; */
  /* border-top: 1px solid #000; */
}
@media screen and (max-width: 750px) {
  .chat-wrapper {
    width: 100%;
  }
}
</style>

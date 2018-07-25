<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div ref="chat" class="chat-wrapper">

    <header class="chat-header">
      欢迎您{{userInfo.username}}
      <!-- <mu-appbar title="Connect With You"></mu-appbar> -->
    </header>

    <div class="chat-body">
      <!-- <mu-container class="demo-container is-stripe"> -->
      <mu-row >
        <mu-col span="12" sm="3" md="3" lg="3" xl="3" class="chat-body-list">
          <div class="grid-cell chat-userlist">
            <mu-list >
              <mu-sub-header>在线朋友</mu-sub-header>

              <mu-list-item @click="openFullscreenDialog(item)" avatar button :ripple="false" v-for="item in userlist" :key="item.user">
                <mu-list-item-action >
                  <mu-avatar></mu-avatar>
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
          <mu-appbar color="primary" title="对话框" class="chat-dialog-appbar">
            <mu-button slot="left" icon @click="closeFullscreenDialog">
              <mu-icon value="close"></mu-icon>
            </mu-button>
          </mu-appbar>

          <div class="chat-dialog-body" style="padding: 24px;">
            
            <!-- 消息框 -->
            <section class="chat-dialog-msgbox">
             <mu-alert color="success" v-for="item in messageList" :key="item.message">
                {{item.message}}
            </mu-alert>
            </section>
            <!-- 输入框 -->
            <section class="chat-dialog-inputbox">
              <mu-text-field class="chat-dialog-input" solo v-model="messageText" placeholder="请输入文字"></mu-text-field>
               <mu-button class="chat-dialog-sendbtn" small  color="primary" @click="sendMsg">发送</mu-button>
            </section>
          </div>
        </mu-dialog>
      </mu-row>
      <!-- </mu-container> -->

    </div>

    <footer class="chat-footer">
      <!-- <mu-container> -->
      <mu-bottom-nav color="#ea66a6" class="chat-footer-nav">
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
      messageText:'',
      // 当前聊天的用户信息
      talkManInfo:{},
      // 保存消息的列表
      messageList:[]
    };
  },
  methods: {
    // 打开对话框
    openFullscreenDialog(item) {
      this.openFullscreen = true;
      // 获取对话用户信息
      this.talkManInfo = item;
    },
    closeFullscreenDialog() {
      this.openFullscreen = false;
      this.talkManInfo = {};
    },

    websocketFun() {
      // 连接ws
      var socket = io.connect("ws://localhost:8000/");
      //   接受广播的消息例子 登录用户显示
      var that = this;
      // 发送消息增加一个用户
      socket.emit("new user",that.userInfo);

      // 接受广播
      socket.on("broadcast message all", function(data) {
        that.userlist = data;
        console.log("socket....");
        console.log(that.userlist);
      });

      // 接收私人消息
      socket.on("receive private meassge",function(data){
        console.log(data);
        data.type = 2;
        that.messageList.push(data);
      })
    },

    // 发送我的消息
    sendMsg(){
      // 连接ws
      var socket = io.connect("ws://localhost:8000/");
      var that = this;
      var data = {
        username:that.talkManInfo.username,
        socketid : that.talkManInfo.socketid,
        message:that.messageText,
        time:'10:00',
        type:1
      };
      // 添加到消息列表中
      that.messageList.push(data);


      // 发送消息到服务器
      socket.emit("send private message",data);
    },
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
  }
};
</script>

<style>
.chat-dialog-input{
  width:65%;
}
.chat-dialog-sendbtn{
  /* background:red; */
}
.mu-dialog-body{
  height: 100%;
}
.chat-dialog-appbar{
  height:10%;
}
.chat-dialog-body{
  /* width:100%; */
  position: relative;
  /* background:red; */
  height:100%;
}
.chat-dialog-inputbox{
  height:10%;
  /* background:blue; */
}

.chat-dialog-msgbox{
  height:80%;
  background:rgb(103, 174, 216);
}

.chat-wrapper {
  position: relative;
  /* margin: 0 auto; */
  width: 100%;
  /* height:600px; */
}

.chat-header {
  height: 8%;
  width: 90%;
  /* border: 1px solid #000; */
  position: absolute;
  top: 0px;
}
.chat-body {
  position: absolute;
  top: 8%;
  width: 100%;
  height: 84%;
  background: #f6f5ec;
  /* border:1px solid red; */
}
.chat-body-list {
  position: absolute;
  background: rgb(199, 225, 226);
  height: 100%;
}
.chat-footer {
  /* border: 1px solid #000; */
  background-color: #f3715c;
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

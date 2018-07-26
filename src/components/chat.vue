<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div ref="chat" class="chat-wrapper">

    <header class="chat-header">
      <p class="chat-header-title">一起嗨聊--!</p>
      <div class="chat-sub-header">(｡･∀･)ﾉﾞ嗨！{{userInfo.username}}</div>
    </header>

    <div class="chat-body">
      <mu-row>
        <mu-col span="12" sm="12" md="12" lg="12" xl="12" class="chat-body-list">
          <div class="grid-cell chat-userlist">

            <mu-list>

              <mu-list-item class="chat-list-item" @click="openFullscreenDialog(item)" avatar button :ripple="false" v-for="item in userlist"
                :key="item.user">
                <mu-list-item-action>
                  <mu-avatar>
                    <img src="../assets/images/user.png">
                  </mu-avatar>
                </mu-list-item-action>
                <!-- 用户名 -->
                <mu-list-item-title>{{item.username}}</mu-list-item-title>
                <!-- 提示 -->
                <mu-badge :content="msgCount[item.username]+''" circle color="secondary" v-if="msgCount[item.username]!=undefined&&msgCount[item.username]>0 ">
                  <mu-button icon>
                    <mu-icon value="notifications"></mu-icon>
                  </mu-button>
                </mu-badge>
              </mu-list-item>
            </mu-list>
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
            <section class="chat-dialog-msgbox" ref="msgbox">
              <div class="msg-container" v-for="item in messageList">
                <div class="msg-divider" v-if="item.isNewMsg">以下是最新消息</div>
                <section class="msg-msgbox">
                  <div class="msg-title">
                    <span class="msg-user">{{item.sender}}</span>
                    <span class="msg-time">{{item.time}}</span>

                  </div>

                  <div class="msg-text">
                    <span>{{item.message}}</span>
                  </div>
                  <!-- 图片 -->
                  <div v-if="!!item.picture" class="msg-img" @click="openPictureFn(item)">
                    <img :src="item.picture" alt="">
                  </div>
                  

                </section>

                <!-- 放大图片 -->
                  <mu-dialog class="msg-pic-dialog" :open.sync="openPicture" @click="closePictureFn">
                    <img :src="item.picture" alt="">
                  </mu-dialog>
              </div>

            </section>
            <!-- 输入框 -->
            <div class="chat-dialog-inputbox">
              <mu-text-field class="chat-dialog-input" v-model="messageText" placeholder="请输入文字"></mu-text-field>
              <!-- <div span="2"><mu-button class="chat-dialog-sendbtn"   small  color="primary" @click="sendMsg">发送</mu-button></div> -->
              <!-- 发送按钮 -->
              <div class="chat-dialog-sendbtn" @click="sendMsg">发送</div>
              <div class="chat-dialog-sendimgbtn">发送图片
                <input class="chat-dialog-sendimg" type="file" multiple accept="image/*" @change="uploadImg">
              </div>
            </div>
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
  import Toast from "muse-ui-toast";

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
        picture: null,
        // 消息计数数组
        msgCount: {},
        // 放大图片框
        openPicture:false,
        openPictureData:''
      };
    },
    methods: {
      // 消息框中放大图片
      openPictureFn(item){
        this.openPicture  = true;
        this.openPictureData = item.picture;
      },
      closePictureFn(){
        this.openPicture = false;
        this.openPictureData = '';
      },
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

        reader.onload = function () {
          that.picture = this.result;
          that.sendMsg();
        };
      },
      // 打开对话框
      openFullscreenDialog(item) {
        this.openFullscreen = true;
        // 获取对话用户信息
        this.talkManInfo = item;
        // 请求历史记录
        this.getHistoryMessage(item);

      },
      // 获取历史消息
      getHistoryMessage(item) {
        // 清除聊天信息
        this.messageList.length = 0;
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
            // console.log(historymessage);
            // 滚动到最下面
            that.msgScroll();
            // 设置最新消息分界
            that.setIsNewflag(that.messageList, peer);
          })
          .catch(err => {
            console.log(err);
          });
      },
      closeFullscreenDialog() {
        this.openFullscreen = false;
        // 消除消息提示
        this.msgCount[this.talkManInfo.username] = 0;
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
        socket.on("broadcast message all", function (data) {
          that.userlist = data;
          console.log("socket....");
          console.log(that.userlist);
        });

        // 接收私人消息
        socket.on("receive private meassge", function (data) {
          console.log('接收数据');
          let sender = data.sender;
          // 消息计数
          that.msgCounter(sender);
          console.log(that.msgCount[sender]);
          that.messageList.push(data);

          // 滚动到最后
          that.msgScroll();
        });
      },
      // 设置某条消息后为最新消息
      setIsNewflag(msglist, sender) {
        let count = this.msgCount[sender];
        if (count != undefined && count > 0) {
          console.log('新消息');
          console.log(msglist);
          let flat = msglist.length - count;
          console.log(msglist[flat]);
          msglist[flat].isNewMsg = true;
        }
      },
      msgCounter(sender) {
        // console.log(this.msgCount);
        // this.msgCount[sender] = 1;
        // 如果不存在这个属性，创建并赋值1
        if (this.msgCount[sender] == undefined) {
          this.msgCount[sender] = 1;
        } else {
          this.msgCount[sender]++;
        }
        // console.log('计数');
        console.log(this.msgCount);
      },
      // 发送我的消息
      sendMsg() {
        if (this.messageText.trim().length == 0 && this.picture == null) {
          Toast.config({
            position: "top"
          });
          Toast.warning("消息不能为空!");
          return;
        }

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
          picture: that.picture || null,
          time: time.toLocaleString()
        };
        // 如果对话方不是自己添加消息
        if (data.from != data.to) {
          // 添加到消息列表中
          that.messageList.push(mydate);
        }
        this.msgScroll();
        // 清空输入框和图片
        this.messageText = "";
        this.picture = null;
      },
      // 消息滚动
      msgScroll() {
        let msgbox = this.$refs.msgbox;
        if (msgbox != undefined) {
          setTimeout(() => {
            msgbox.scrollTop = Number.MAX_SAFE_INTEGER;
          }, 500);
        }
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

  .msg-divider {
    width: 100%;
    height: 20px;
    position: relative;
    text-align: center;
    color: rgb(117, 117, 117);
    font-weight: 100;
    font-size: 12px;
  }

  .msg-divider::after {
    display: block;
    position: absolute;
    top: 9px;
    content: '';
    width: 35%;
    height: 1px;
    background: rgb(212, 212, 211);
  }

  .msg-divider::before {
    display: block;
    position: absolute;
    top: 9px;
    right: 0;
    content: '';
    width: 35%;
    height: 1px;
    background: rgb(212, 212, 211);
  }

  .msg-msgbox {
    margin-top: 10px;
    background-color: #eeeeee;
    padding: 10px;
    width: 80%;
    border-radius: 5px;
    box-shadow: 1px 1px 5px rgb(167, 166, 166);
    word-wrap: break-word;
  }

  .msg-container {
    /* border:1px solid rgb(196, 196, 196); */
    /* box-shadow: 1px 1px 5px #ccc; */
    /* border-radius: 10px; */
    padding: 10px;
    margin: 10px;
    /* background-color: #d0f3e0; */
  }

  .chat-sub-header {
    margin: 5px;
    height: 20px;
    font-size: 16px;
  }

  .chat-list-item {
    margin: 5px;
    border: 1px solid #fff;
    border-radius: 10px;
    background: rgb(228, 231, 233);
  }

  .chat-dialog-input {
    padding-left: 10px;
    width: 50%;
  }

  .chat-dialog-sendbtn {
    position: relative;
    display: inline-block;
    background-color: #2196f3;
    border-radius: 5px;
    color: #fff;
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }

  .chat-dialog-sendimgbtn {
    position: relative;
    display: inline-block;
    background-color: #2196f3;
    border-radius: 5px;
    color: #fff;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
  }

  .chat-dialog-sendimg {
    /* display: inline-block; */
    width: 30px;
    /* height:30px; */
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
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
    width: 100%;
    position: relative;
    line-height: 20px;
    text-align: center;
    /* background:blue; */
  }

  .chat-dialog-msgbox {
    height: 80%;
    /* background: rgb(255, 255, 255); */
    overflow: auto;
  }
  .msg-pic-dialog{
    width:100%;
  }
  .msg-pic-dialog img{
    width:100%;
  }
  .chat-wrapper {
    position: relative;
    /* margin: 0 auto; */
    width: 100%;
    /* height:600px; */
  }

  .chat-header {
    height: 16%;
    width: 100%;
    position: absolute;
    top: 0px;
    text-align: center;
    background: #2196f3;
    color: #fff;
  }

  .chat-header-title {
    font-size: 20px;
  }

  .chat-body {
    position: absolute;
    top: 16%;
    width: 100%;
    height: 76%;
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

  @media screen and (min-width: 750px) {
    .chat-wrapper {
      width: 50%;
      margin:0 auto;
      box-shadow: 1px 1px 5px #ccc;
    }
  }

</style>

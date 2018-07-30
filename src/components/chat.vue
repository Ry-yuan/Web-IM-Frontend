<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div ref="chat" class="chat-wrapper">

    <mu-appbar style="width: 100%;" color="primary" class="chat-header">
      <mu-button icon slot="left">
        <mu-icon value="person"></mu-icon>
      </mu-button>
      <div>
        嗨聊({{userInfo.username}})
      </div>
      <mu-button flat slot="right" @click="logoutOpen = true">注销</mu-button>
    </mu-appbar>

    <mu-dialog title="注销" width="360" :open.sync="logoutOpen">
      你确定要退出吗？
      <mu-button slot="actions" flat color="primary" @click="logout">确定</mu-button>
      <mu-button slot="actions" flat color="primary" @click="logoutOpen = false">取消</mu-button>
    </mu-dialog>

    <div class="chat-body">
      <mu-row>
        <mu-col span="12" sm="12" md="12" lg="12" xl="12" class="chat-body-list">
          <!-- 在线用户列表 -->
          <div class="grid-cell chat-userlist" v-if="listType == 'online'">
            <mu-list>
              <mu-list-item class="chat-list-item" @click="openFullscreenDialog(item)" avatar button :ripple="false" v-for="item in onlineUserList"
                :key="item.user">
                <mu-list-item-action>
                  <mu-avatar>
                    <img v-if="item.sex == 0" src='../assets/images/p0.jpg'>
                    <img v-if="item.sex == 1" src='../assets/images/p1.jpg'>
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-content>
                  <mu-list-item-title>{{item.username}}</mu-list-item-title>
                  <mu-list-item-sub-title class="chat-online-text">在线</mu-list-item-sub-title>
                </mu-list-item-content>

                <!-- 提示 -->
                <mu-list-item-action>
                  <mu-badge :content="msgCount[item.username]+''" circle color="secondary" v-if="msgCount[item.username]!=undefined&&msgCount[item.username]>0 ">
                    <mu-button icon>
                      <mu-icon value="notifications"></mu-icon>
                    </mu-button>
                  </mu-badge>
                </mu-list-item-action>
              </mu-list-item>
            </mu-list>
          </div>

          <!-- 历史用户列表 -->
          <div class="grid-cell chat-userlist" v-if="listType == 'history'" v-loading="historyUserLoad" data-mu-loading-text="skr!疯狂加载中...">
            <mu-list textline="two-line">
              <mu-list-item class="chat-list-item" @click="openFullscreenDialog(item)" avatar button :ripple="false" v-for="item in historyUserList"
                :key="item.user">
                <mu-list-item-action>
                  <mu-avatar>
                    <img src="../assets/images/p0.jpg">
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-content>
                  <!-- 用户名 -->
                  <mu-list-item-title>{{item.username}}</mu-list-item-title>
                  <mu-list-item-sub-title class="chat-online-text" v-if="item.status == 1">在线</mu-list-item-sub-title>
                  <mu-list-item-sub-title v-if="item.status != 1">离线</mu-list-item-sub-title>

                </mu-list-item-content>

                <!-- 提示 -->
                <mu-list-item-action>
                  <mu-badge :content="msgCount[item.username]+''" circle color="secondary" v-if="msgCount[item.username]!=undefined&&msgCount[item.username]>0 ">
                    <mu-button icon>
                      <mu-icon value="notifications"></mu-icon>
                    </mu-button>
                  </mu-badge>
                </mu-list-item-action>

              </mu-list-item>
            </mu-list>
          </div>
        </mu-col>



        <!-- 对话框-->
        <mu-dialog ref="dialog" width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
          <!-- 对话框头部 -->
          <mu-appbar color="primary" :title="'正在和'+talkManInfo.username+'聊天'" class="chat-dialog-appbar">
            <mu-button slot="left" icon @click="closeFullscreenDialog">
              <mu-icon value="arrow_back" left></mu-icon>
            </mu-button>
          </mu-appbar>

          <!-- 对话框身体 -->
          <div class="chat-dialog-body" v-loading="msgDialogLoad" data-mu-loading-text="skr!疯狂加载中...">
            <!-- 消息大框 -->
            <section class="chat-dialog-msgbox" ref="msgbox">
              <div class="msg-container" v-for="(item,index) in messageList">

                 
                <!-- 选项框 -->
                <ul v-show="item.showSelect" class="msg-select" :class="{'msg-select-right':(item.sender == userInfo.username),'msg-select-left':(item.sender != userInfo.username)}">
                  <li @click="quoteMessage(item)">文本引用</li>
                  <li v-if="item.showrecall&&((item.sender != talkManInfo.username))" @click="recallMessage(item,index)">撤回</li>
                  <li v-if="item.showrecall&&((item.sender != talkManInfo.username))" @click="modifyMessage(item,index)">修改</li>
                </ul>

                <!-- 最新消息提示 -->
                <div class="msg-divider" v-if="item.isNewMsg">以下是最新消息</div>

                <!-- 消息框 -->
                <section v-if="item.isrecall== undefined || !item.isrecall" class="msg-msgbox" @click="item.showSelect = false" @dblclick="gtouchstart(item)"
                  @touchstart="gtouchstart(item)" @touchmove="gtouchmove()" @touchend="gtouchend(index)">

                  <div class="msg-time">
                    <span>{{item.timeText}}</span>
                  </div>

                  <div class="msg-avatar" :class="{'msg-avatar-right':(item.sender==userInfo.username)}">
                    <img src="../assets/images/p0.jpg">
                  </div>

                  <div :class="{'msg-text-right':(item.sender==userInfo.username),'msg-text-left':(item.sender != userInfo.username)}">
                    <span>{{item.message}}</span>
                    <div v-if="!!item.picture" class="msg-img" @click="openPictureFn(item)">
                      <img :src="item.picture" alt="">
                    </div>
                    <p v-if="item.ismodify" class="msg-notice-modify">消息被修改</p>
                  </div>
                </section>


                <!-- 撤回消息框 -->
                <div class="msg-recall-msg" v-if="item.isrecall">{{item.sender+item.message}}</div>

                <!-- 修改消息 -->
                <mu-dialog title="修改消息" width="360" :open.sync="modifyDialogShow">
                  <mu-text-field v-model="modifyMessageText" placeholder="Please input......"></mu-text-field>
                  <mu-button slot="actions" flat color="primary" @click="modifySave(item,index)">保存</mu-button>
                  <mu-button slot="actions" flat color="primary" @click="modifyCancle">取消</mu-button>
                </mu-dialog>

                <!-- 放大图片 -->
                <mu-dialog class="msg-pic-dialog" :open.sync="openPicture" @click="closePictureFn">
                  <img :src="openPictureData" alt="">
                </mu-dialog>
              </div>

    

            </section>
            <!-- 对话输入框 -->
            <div class="chat-dialog-inputbox">
              <mu-text-field class="chat-dialog-input" v-model="messageText" placeholder="请输入文字"></mu-text-field>
              <!-- 发送按钮 -->
              <div class="chat-dialog-sendbtn" @click="sendMsg">发送</div>

              <div class="chat-dialog-sendimgbtn">发送图片
                <input class="chat-dialog-sendimg" type="file" multiple accept="image/*" @change="uploadImg">
              </div>

            </div>

          </div>
        </mu-dialog>
      </mu-row>
    </div>

    <!-- 底部 -->
    <footer class="chat-footer">
      <mu-bottom-nav color="#168ad6" class="chat-footer-nav" :value.sync="listType" @change="showUserList(listType)">
        <mu-bottom-nav-item title="在线用户" value="online" icon="group">

        </mu-bottom-nav-item>

        <mu-bottom-nav-item title="历史列表" value="history" icon="restore">
        </mu-bottom-nav-item>
      </mu-bottom-nav>
    </footer>
  </div>

  <!-- </mu-flex> -->
</template>
<script>
  import io from "socket.io-client";
  import moment from "moment";

  import Toast from "muse-ui-toast";
  // import setTime from "../ulit/setTime.js";
  export default {
    data() {
      return {
        // 当前用户信息
        userInfo: {},
        // 在线用户列表
        onlineUserList: [],
        // 历史用户列表
        historyUserList: [],
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
        openPicture: false,
        openPictureData: "",
        timeOutEvent: 0,
        // 修改消息
        modifyMessageText: "",
        modifyTime:'',
        modifyDialogShow: false,
        listType: "online",
        Ws_Path: "ws://172.17.26.143:8000/",
        msgDialogLoad: false,
        historyUserLoad: false,
        logoutOpen: false,
      };
    },
    methods: {
      // 注销
      logout() {
        let that = this;
        // 注销请求
        this.$http.post('/api/logout').then(data => {
          console.log('注销成功');
          // 返回登录界面
          // that.$router.push('/login');   
          location.href = '/login';
        }).catch(err => {
          console.log(err);
        });
      },
      showUserList(value) {
        let that = this;
        let username = this.userInfo.username;
        if (value == "history") {
          that.historyUserLoad = true;
          // 请求
          this.$http
            .get("/api/get_history_userlist?username=" + username)
            .then(data => {
              console.log("历史用户列表");
              // console.log(data);
              // 添加到历史列表中
              that.historyUserList = data.data.data;

              // 找出在线的成员
              that.onlineUserList.forEach((value, index) => {
                that.historyUserList.map(item => {
                  if (value.username == item.username) {
                    item.status = 1;
                    return;
                  }
                })
              });
              console.log(that.historyUserList);
              that.historyUserLoad = false;
            })
            .catch(err => {
              that.historyUserLoad = false;
              console.log(err);
            });
        }
        if (value == "online") {
          console.log("online list");
        }
      },
      // 修改保存
      modifySave(item, index) {
        console.log("修改消息...");
        console.log(item);
        console.log(index);
        // 改变自己的消息
        let that = this;
        this.messageList.map(value=>{
          if(value.time == that.modifyTime){
            value.message = that.modifyMessageText;
            value.ismodify = true;
            return;
          }
        })
        // 隐藏修改框
        this.modifyDialogShow = false;
        // 修改数据的参数
        let modifydata = {
          from: item.sender,
          to: this.talkManInfo.username,
          socketid: this.talkManInfo.socketid,
          message: this.modifyMessageText,
          time: this.modifyTime,
          // 修改的标志
          ismodify: true
        };
        // 发送消息 socket
        let socket = io.connect(this.Ws_Path);
        // 发送修改数据
        socket.emit("modify message", modifydata);
      },
      modifyCancle() {
        // 清空修改消息
        this.modifyMessageText = "";
        this.modifyTime = "";
        // 关闭窗口
        this.modifyDialogShow = false;
      },
      // 修改消息
      modifyMessage(item, index) {
        item.showSelect = false;
        // 显示修改窗口
        this.modifyDialogShow = true;
        // 读取当前消息
        this.modifyMessageText = item.message;
        this.modifyTime = item.time;
      },

      // 撤回消息
      recallMessage(item, index) {
        item.showSelect = false;
        console.log("撤销");
        console.log(item);
        let recallMsg = {
          from: this.userInfo.username,
          to: this.talkManInfo.username,
          socketid: this.talkManInfo.socketid,
          message: item.message,
          picture: item.picture || null,
          time: item.time,
          type: 2
        };
        let new_time = new Date();
        let localMsg = {
          sender: this.userInfo.username,
          time: new_time.getTime(),
          message: "撤回一条消息",
          isrecall: true
        };
        // 连接ws
        let socket = io.connect(this.Ws_Path);

        // 告诉对方删除的消息是什么
        socket.emit("recall message", recallMsg);
        // 删除本地该条消息
        this.messageList.splice(index, 1);
        // 如果是本地自己
        if (this.userInfo.username == item.sender) {
          // 添加一条消息
          this.messageList.push(localMsg);
          console.log(this.messageList);
        }
      },
      // 引用文本
      quoteMessage(item) {
        item.showSelect = false;
        this.messageText = item.message;
      },
      // 消息框长按显示
      gtouchstart(item) {
        // item.showSelect = false;
        this.timeOutEvent = setTimeout(function () {
          console.log("长按触发" + item.message);
          var now = new Date();
          var now_new = now.getTime();
          if (now_new - item.time <= 1000 * 60 * 1) {
            item.showrecall = true;
          } else {
            item.showrecall = false;
          }
          // 显示选项框
          this.timeOutEvent = 0;
          item.showSelect = true;
        }, 300); //这里设置定时器，定义长按触发长按事件
        return false;
      },
      // 规定时间离开就清除计时器
      gtouchmove() {
        clearTimeout(this.timeOutEvent);
        this.timeOutEvent = 0;
        return false;
      },
      //手释放，如果时间内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gtouchend() {
        clearTimeout(this.timeOutEvent); //清除定时器
        return false;
      },
      // 消息框中放大图片
      openPictureFn(item) {
        this.openPicture = true;
        this.openPictureData = item.picture;
      },
      closePictureFn() {
        this.openPicture = false;
        this.openPictureData = "";
      },
      // 上传图片
      uploadImg(event) {
        // 新建读取文件的对象
        let reader = new FileReader();
        // 获得图片
        let file = event.target.files[0];
        let that = this;
        // console.log("file");
        // console.log(file);
        console.log(file.size);
        if(file.size > 1024000){
          Toast.error("图片不能大于1M!");
          return;
        }
        // console.log(file.type);
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
        // 加载
        this.msgDialogLoad = true;
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
            let historymessage = data.data.data;
            // 处理messageList
            that.handleMessage(historymessage);
            // 存放在历史消息列表
            that.messageList.push.apply(that.messageList, historymessage);
            console.log(that.messageList);
            // 滚动到最下面
            that.msgScroll();
            // 设置最新消息分界
            that.setIsNewflag(that.messageList, peer);
            // 关闭加载
            that.msgDialogLoad = false;
          })
          .catch(err => {
            that.msgDialogLoad = false;
            console.log(err);
          });
      },
      // 处理数据
      handleMessage(messageList) {
        messageList.map(item => {
          item.showSelect = false;
          item.showrecall = false;
          item.ismodify = false;
          item.timeText = moment(
            moment(+item.time).format("YYYY-MM-DD HH:mm:ss")
          ).fromNow();
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
        let socket = io.connect(this.Ws_Path);
        //   接受广播的消息例子 登录用户显示
        let that = this;
        // 发送消息增加一个用户
        socket.emit("new user", that.userInfo);

        // 接受广播
        socket.on("broadcast message all", function (data) {
          that.onlineUserList = data;
          console.log("当前在线用户：");
          console.log(that.onlineUserList);
        });

        // 接收私人消息
        socket.on("receive private meassge", function (data) {
          console.log("接收数据");
          let sender = data.sender;
          // 消息计数
          that.msgCounter(sender);
          data.showSelect = false;
          data.showrecall = false;
          data.ismodify = false;
          data.timeText = moment(
            moment(+data.time).format("YYYY-MM-DD HH:mm:ss")
          ).fromNow();
          // 如果发送者是当前聊天的人，就加入消息队列中
          if (
            sender == that.talkManInfo.username ||
            that.talkManInfo.username == undefined
          ) {
            that.messageList.push(data);
          }
          // 滚动到最后
          that.msgScroll();
        });

        // 接收撤回数据
        socket.on("recall message", function (data) {
          console.log("接受消息recall");
          console.log(data);
          let new_time = new Date();
          let localMsg = {
            sender: data.from,
            time: new_time.getTime(),
            message: "撤回一条消息",
            isrecall: true
          };
          // 如果聊天是自己与自己 不操作下面
          if (data.from == data.to) {
            return;
          }
          // 删除数据遍历查找该条数据
          that.messageList.forEach((msgitem, index) => {
            console.log("遍历");
            console.log(msgitem);
            if (msgitem.time == data.time) {
              // 找到对应项删除
              that.messageList.splice(index, 1);
            }
          });
          // 拿到数据添加到消息队列
          that.messageList.push(localMsg);
        });

        // 接收修改数据
        socket.on("modify message", function (data) {
          console.log("接受消息modify");
          console.log(data);

          // 如果聊天是自己与自己 不操作下面
          if (data.from == data.to) {
            return;
          }
          // 删除数据遍历查找该条数据
          that.messageList.forEach((msgitem, index) => {
            console.log("遍历");
            console.log(msgitem);
            if (msgitem.time == data.time) {
              // 找到对应修改消息
              that.messageList[index].message = data.message;
              that.messageList[index].ismodify = true;
            }
          });
        });
      },

      // 设置某条消息后为最新消息
      setIsNewflag(msglist, sender) {
        let count = this.msgCount[sender];
        if (count != undefined && count > 0) {
          console.log("新消息");
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
          Toast.error("消息不能为空!");
          return;
        }

        // 连接ws
        let socket = io.connect(this.Ws_Path);
        let that = this;
        let time = new Date();

        let data = {
          from: that.userInfo.username,
          to: that.talkManInfo.username,
          socketid: that.talkManInfo.socketid,
          message: that.messageText,
          picture: that.picture || null,
          time: time.getTime(),
          type: 1
        };

        // 发送消息到服务器
        socket.emit("send private message", data);

        let mydata = {
          sender: that.userInfo.username,
          message: that.messageText,
          picture: that.picture || null,
          time: time.getTime(),
          timeText: moment(moment(+time).format("YYYY-MM-DD HH:mm:ss")).fromNow(),
          showSelect: false,
          showrecall: false
        };
        // 如果不是发给自己 添加消息
        if (data.from != data.to) {
          // 添加到消息列表中
          that.messageList.push(mydata);
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
            msgbox.scrollTop = msgbox.scrollHeight;
          }, 500);
        }
      }
    },

    mounted() {
      let that = this;
      // 获得布局视口高度，设置外围高度
      this.$refs.chat.style.height = document.documentElement.clientHeight + "px";
      // 请求用户数据
      this.$http
        .get("/api/chat")
        .then(data => {
          // code为1代表没有登录
          if (data.data.code == 1) {
            // 返回登录页面
            that.$router.push('/login');
            return;
          }
          this.userInfo = data.data.data;
          this.websocketFun();
        })
        .catch(err => {
          console.log(err);
        });
      // 文本不被选中
      document.body.onselectstart = document.body.ondrag = function () {
        return false;
      };
    }
  };

</script>

<style>
  .msg-notice-modify {
    margin:0px;
    font-size: 12px;
    color: rgb(243, 201, 16);
  }

  /* 修改消息显示 */

  .msg-container .msg-modify {
    color: #ccc;
  }

  /* 撤回消息框 */

  .msg-recall-msg {
    position: absolute;
    margin-top: 10px;
    background-color: #8d8b8a;
    /* padding: 10px; */
    margin-left: -25%;
    /* margin-top:-25%; */
    left: 50%;
    top: 50%;
    text-align: center;
    width: 50%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    border-radius: 5px;
    box-shadow: 1px 1px 5px rgb(167, 166, 166);
    word-wrap: break-word;
    color: #fff;
  }

  /* 长按消息弹出框样式 */

  .msg-select {
    position: absolute;
    padding: 0px;
    top: -15px;
    border: 1px solid #fff;
    border-radius: 5px;
    background: #3d3a3a;
    height: 30px;
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    text-align: center;
    z-index: 1000;
  }

  .msg-select-left {
    left: 50px;
  }

  .msg-select-right {
    right: 50px;
  }

  .msg-select-left:after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 20%;
    display: block;
    border-width: 8px;
    border-style: solid;
    border-color: #3d3a3a transparent transparent transparent;
  }

  .msg-select-right:after {
    content: "";
    position: absolute;
    bottom: -12px;
    right: 10%;
    display: block;
    border-width: 8px;
    border-style: solid;
    border-color: #3d3a3a transparent transparent transparent;
  }

  .msg-select li {
    padding: 0px 10px;
    display: inline-block;
    list-style: none;
    text-align: center;
  }

  .msg-select li:not(:last-child) {
    border-right: 1px solid #fff;
  }

  .msg-pic-dialog {
    width: 100%;
  }

  .msg-pic-dialog img {
    width: 100%;
  }

  .msg-img {
    width: 50%;
    height: 50%;
    padding: 5px;
  }

  .msg-img img {
    width: 150px;
    border-radius: 10px;
  }

  .msg-divider {
    width: 100%;
    height: 20px;
    position: relative;
    text-align: center;
    color: #8d8b8a;
    font-weight: 100;
    font-size: 12px;
  }

  .msg-divider::after {
    display: block;
    position: absolute;
    top: 9px;
    content: "";
    width: 35%;
    height: 1px;
    background: rgb(212, 212, 211);
  }

  .msg-divider::before {
    display: block;
    position: absolute;
    top: 9px;
    right: 0;
    content: "";
    width: 35%;
    height: 1px;
    background: #8d8b8a;
  }

  .msg-time {
    /* width: 20%;</span> */
    margin: 0 auto;
    margin-bottom: 10px;
    /* background: #8d8b8a; */
    border-radius: 5px;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }

  .msg-time span {
    padding: 3px;
    border-radius: 3px;
    background: #8d8b8a;
  }

  .msg-msgbox {
    position: relative;
    margin-top: 5px;
    padding: 5px;
    width: 100%;
    word-wrap: break-word;
    overflow: hidden;
  }

  .msg-avatar {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    vertical-align: middle;
    /* border: 1px solid #000; */
    overflow: hidden;
  }

  .msg-avatar img {
    width: 100%;
    height: 100%;
  }

  /* .msg-avatar-left {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    vertical-align: middle;
    border: 1px solid #000;
  } */

  .msg-avatar-right {
    float: right;
  }

  /* 消息内容框 */

  .msg-text-left {
    position: relative;
    padding: 5px 20px;
    margin-left: 10px;
    vertical-align: middle;
    display: inline-block;
    border-radius: 5px;
    box-shadow: 1px 1px 5px #ccc;
    background: #33a3dc;
    color: #fff;
    height: 100%;
    z-index: 100;
  }

  .msg-text-left:after {
    content: "";
    position: absolute;
    top: 10px;
    left: -12px;
    display: block;
    border-width: 8px;
    border-style: solid;
    border-color: transparent #33a3dc transparent transparent;
  }

  /* 消息内容框 */

  .msg-text-right {
    position: relative;
    float: right;
    padding: 5px 20px;
    margin-right: 15px;
    vertical-align: middle;
    display: inline-block;
    /* border:1px solid red; */
    border-radius: 6px;
    box-shadow: -1px 1px 5px #ccc;
    color: #fff;
    background: #33a3dc;
    height: 100%;
    z-index: 100;
    /* width:50%; */
  }

  .msg-text-right::after {
    position: absolute;
    content: "";
    display: block;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent #33a3dc;
    right: -12px;
    top: 10px;
  }

  .msg-container {
    position: relative;
    padding: 5px;
    margin: 5px 10px;
    min-height: 40px;
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

  .chat-online-text {
    color: green;
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

  .chat-wrapper {
    position: relative;
    /* margin: 0 auto; */
    width: 100%;
    /* height:600px; */
  }

  .chat-header {
    height: 10%;
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
    top: 10%;
    width: 100%;
    height: 84%;
    background: #e2e1d9;
    overflow: auto;
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
      margin: 0 auto;
      box-shadow: 1px 1px 5px #ccc;
    }
  }

</style>

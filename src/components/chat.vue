<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div ref="chat" class="chat-wrapper">

    <header class="chat-header">
      hello
      <!-- <mu-appbar title="Connect With You"></mu-appbar> -->
    </header>

    <div class="chat-body">
      <!-- <mu-container class="demo-container is-stripe"> -->
      <mu-row >
        <mu-col span="3" sm="3" md="3" lg="3" xl="3">
          <div class="grid-cell chat-userlist">
            <mu-list >
              <mu-sub-header>OnLine</mu-sub-header>

              <mu-list-item avatar button :ripple="false" v-for="item in userlist" :key="item.user">
                <mu-list-item-action>
                  <mu-avatar></mu-avatar>
                </mu-list-item-action>
                <mu-list-item-title>{{item.user}}</mu-list-item-title>
              </mu-list-item>
            </mu-list>
          </div>
        </mu-col>

        <mu-col span="9" sm="9" md="9" lg="9" xl="9">
          <div class=" chat-showbox">
            <div class="chat-showInfo">

            </div>
            <div class="chat-inputText">
              <!-- <textarea></textarea> -->
              <!-- <mu-text-field v-model="message" multi-line :rows="4" full-width></mu-text-field><br/> -->
            </div>
          </div>
        </mu-col>
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
  import io from 'socket.io-client';
  export default {
    data(){
      return{
        userInfo:{},
        message:'',
        userlist:[]
      }
    },
    mounted(){
      // 获得布局视口高度，设置外围高度
      this.$refs.chat.style.height = document.documentElement.clientHeight + 'px';

      // 请求用户数据
      this.$http.get('/api/chat').then((data)=>{
        this.userInfo  = data.data.data;
      }).catch((err)=>{console.log(err)});

      var socket = io.connect('http://localhost:8000/');

      //   接受广播的消息例子 登录用户显示
      var that = this;
      socket.on('broadcast message all',function(data){
      that.userlist = data;
      console.log('socket....');
      console.log(this.userlist);
    });



    }
  };

</script>

<style>
*{
  margin:0;
  padding:0;
}
  .chat-wrapper {
    position: relative;
    /* margin: 0 auto; */
    width:100%;
    /* height:600px; */
  }

  .chat-header {
    height: 8%;
    width:90%;
    /* border: 1px solid #000; */
    position: absolute;
    top:0px;
  }
  .chat-body{
    position: absolute;
    top:8%;
    width:100%;
    height:84%;
    background:#f6f5ec;
    /* border:1px solid red; */
  }
  .chat-footer {
    /* border: 1px solid #000; */
    background-color: #f3715c;
    position: absolute;
    bottom: 0px;
    width:100%;
    height:8%;
  }
  .chat-footer-nav{
    height:100%;
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
  @media screen and (max-width:750px) {
    .chat-wrapper{
      width:100%;
    }
  }
</style>

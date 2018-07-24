<template>
    <div class="login-wrapper">
        <div class="login-bg"></div>
        <header class="login-header">
            <span>来聊登录</span>
        </header>

        <section class="login-from">
            <mu-container class="login-from-input">
                <mu-text-field v-model="username" label="UserName" label-float  icon="account_circle"></mu-text-field><br/>
                <mu-text-field type="password" v-model="password" label="Password" label-float  :error-text="errorText" icon="locked" ></mu-text-field><br/>
                <mu-button class="login-btn" color="primary" @click="submitLogin">登录</mu-button>
                <router-link to="/register" class="login-tologin">没有账号？快去注册</router-link>
            </mu-container>
        </section>

    </div>
</template>
<script>
export default {
  data() {
    return {
        username:'',
        password:'',
        errorText:''
    };
  },
  methods:{
      submitLogin:function(){
        //   loading
        // 发送请求
        this.$http.post('/api/userlogin',{
            username:this.username,
            password:this.password
        }).then((data)=>{
            console.log(data.data);
            if(data.data.code == 0 ){
                // this.$router.push('/chat');
                location.href = '/chat';
            }
            if(data.data.code == 1002){
                this.errorText = data.data.msg;
            }
            console.log('login success');
        }).catch((err)=>{
            console.log('login error');
        })
      }
  },
  mounted() {
    
  }
};
</script>

<style>
.login-bg{
    position: absolute;
    width:100%;
    height:100%;
    z-index:-100;
    background:url(../../assets/bg.jpg);
    background-repeat: no-repeat;
    opacity: 0.5;
}
.login-wrapper{
    /* border:1px solid #000; */
}
/* 头部 */
.login-header{
    padding-top:100px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}
/* 表单 */
.login-from{
    text-align: center;
    /* border:1px solid red; */
}

.login-btn{
    margin-top:30px;
    width:220px;
}

/* 去登陆 */
.login-tologin{
    display:block;
    margin:10px auto;
    width:256px;
    font-size: 12px; font-weight: 400;
    text-align: right;
    cursor: pointer;
    color:#2196f3;
}
.login-tologin:hover{
    color:#219999;
}
</style>

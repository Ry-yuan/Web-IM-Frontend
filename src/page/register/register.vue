<template>
    <div class="register-wrapper">
        <div class="register-bg"></div>
        <header class="register-header">
            <span>来聊注册</span>
        </header>

        <section class="register-from">
            <mu-container class="register-from-input">
                <mu-text-field v-model="username" label="UserName" label-float help-text="用户名为6-12长度的字符" :error-text="userError" icon="account_circle"></mu-text-field><br/>
                <mu-text-field type="password" v-model="password" label="Password" label-float help-text="密码至少6位" :error-text="passError" icon="locked"></mu-text-field><br/>
                <mu-text-field type="password" v-model="enpassword" label="Password" label-float error-text="" icon="locked"></mu-text-field><br/>
                <mu-button class="register-btn" color="primary" @click="submitRegister">注册</mu-button>
                <router-link to='/login' class="register-tologin">已有账号去登陆</router-link>
            </mu-container>
        </section>
        
    </div>
</template>
<script>
import Tool from '../../ulit/tool.js'
export default {
  data() {
    return {
        username:'',
        password:'',
        enpassword:'',
        userError:'',
        passError:''
    }
  },
  methods:{
      submitRegister:function(){
        //   清空错误信息
          this.userError = '';
          this.passError = '';
        //   输入有效性检验
          if(Tool.checkIsEmpty(this.username)){
              this.userError = '用户名不能为空';
              return;
          }
          if(Tool.checkUsername(this.username)){
              this.userError = '用户名长度有误';
              return;
          }
          if(Tool.checkIsEmpty(this.password)){
              this.passError = '密码不能为空';
              return;
          }
         
          if(Tool.checkPasswordLength(this.password)){
              this.passError = '密码长度不够';
              return;
          }
          if(!Tool.checkPassword(this.password,this.enpassword)){
              this.passError = '密码不一致';
              return;
          }
         //   发送请求
        //  this.$http.get('/api').then((res)=>{
        //      console.log(res);
        //  }).then((err)=>{
        //      console.log(err);
        //  });

        // POST
        this.$http.post('/api/userregister',{
            username:this.username,
            password:this.password
        }).then((data)=>{
            // 注册成功调到登陆页
            this.$router.push('/login');
        }).catch((err)=>{
            console.log(err);
        })
      }
  },
  mounted() {
  }
};

</script>

<style>
.register-bg{
    position: absolute;
    width:100%;
    height:100%;
    z-index:-100;
    background:url(../../assets/bg.jpg);
    background-repeat: no-repeat;
    opacity: 0.5;
}
.register-wrapper{
    z-index: 100;
}
/* 头部 */
.register-header{
    padding-top:100px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}
/* 表单 */
.register-from{
    text-align: center;
}

.register-btn{
    margin-top:30px;
    width:220px;
}

/* 去登陆 */
.register-tologin{
    display: block;
    margin:10px auto;
    width:256px;
    font-size: 12px; font-weight: 400;
    text-align: right;
    cursor: pointer;
    color:#2196f3;
}
.register-tologin:hover{
    color:#219999;
}
</style>

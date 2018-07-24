<template>
    <div class="register-wrapper">
        <div class="register-bg"></div>
        <header class="register-header">
            <span>来聊注册</span>
        </header>

        <section class="register-from">
            <mu-container class="register-from-input">
                <mu-text-field v-model="value13" label="UserName" label-float help-text="用户名为6-12长度的字符" icon="account_circle"></mu-text-field><br/>
                <mu-text-field v-model="value14" label="Password" label-float help-text="密码至少6位" error-text="" icon="locked"></mu-text-field><br/>
                <mu-text-field v-model="value14" label="Password" label-float error-text="" icon="locked"></mu-text-field><br/>
                <mu-button class="register-btn" color="primary">注册</mu-button>
                <router-link to='/login' class="register-tologin">已有账号去登陆</router-link>
            </mu-container>
        </section>
        
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // this.$el.style.height = documnet.documentElement.clientHeight
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

<template>
    <!-- <mu-flex class="register-wrapper flex-wrapper" justify-content="center">
        <mu-flex class="register-box flex-demo" justify-content="center" >center</mu-flex>
    </mu-flex> -->
    <div class="reigster-box">ss</div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
        // this.$el.style.height = documnet.documentElement.clientHeight
    }
}
</script>

<style>
.register-wrapper{
    position: relative;
    height: 300px;
    /* transform: translateY(50%); */
}

.register-box{
     position: relative;
        top:50%;
        transform: translateY(-50%);
        border:1px solid red;
        height: 200px;
}

</style>

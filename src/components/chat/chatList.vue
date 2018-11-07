<template>
  <mu-list>
    <mu-list-item
      class="chat-list-item"
      @click="openItemDialog(item)"
      avatar
      button
      :ripple="false"
      v-for="item in userList"
      :key="item.user"
    >
      <mu-list-item-action>
        <mu-avatar>
          <img v-if="item.sex == 0" src="@/assets/images/p0.jpg">
          <img v-if="item.sex == 1" src="@/assets/images/p1.jpg">
          <img v-if="!item.sex" src="@/assets/images/user.png">
        </mu-avatar>
      </mu-list-item-action>
      <mu-list-item-content>
        <mu-list-item-title>{{item.username}}</mu-list-item-title>
        <mu-list-item-sub-title class="chat-online-text" v-if="item.status == 1">在线</mu-list-item-sub-title>
        <mu-list-item-sub-title v-if="item.status != 1">离线</mu-list-item-sub-title>
      </mu-list-item-content>
      <!-- 提示 -->
      
      <mu-list-item-action v-if="msgCount[item.username]>0">
        <mu-badge :content="msgCount[item.username]+''" circle
          color="secondary"
          v-if="(msgCount[item.username]!=undefined)&&(msgCount[item.username])>0 "
        >
          <mu-button icon>
            <mu-icon value="notifications"></mu-icon>
          </mu-button>
        </mu-badge>
      </mu-list-item-action>
    </mu-list-item>
  </mu-list>
</template>

<script>
export default {
  // 获取父组件传过来的值
  props: ['userList','msgCount'],
  data() {
    return {
    };
  },
   watch:{
    'msgCount':function(newValue,oldValue){
      console.log('sdsdf');
    }
  },
  mounted() {
    console.log('msg');
    console.log(this.msgCount);
    // this.msg = this.msgCount;
  },
  methods: {
    // 打开对话框，子组件向父组件传值
    openItemDialog(item) {
      this.$emit("openDialog", item);
    }
  }
};
</script>

<style>
</style>

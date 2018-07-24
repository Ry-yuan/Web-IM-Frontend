<template>
  <!-- <mu-flex class="flex-wrapper" justify-content="center"> -->
  <div class="chat-wrapper">

    <header class="chat-header">
      <mu-appbar title="Connect With You"></mu-appbar>
    </header>

    <div class="chat-body">
      <!-- <mu-container class="demo-container is-stripe"> -->
      <mu-row gutter>
        <mu-col span="3" sm="3" md="3" lg="3" xl="3">
          <div class="grid-cell chat-userlist">
            <mu-list>
              <mu-sub-header>OnLine</mu-sub-header>
              <mu-list-item avatar button :ripple="false">
                <mu-list-item-action>
                  <mu-avatar>

                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-title>Mike Li</mu-list-item-title>
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
              <mu-text-field v-model="value10" multi-line :rows="4" full-width></mu-text-field><br/>
            </div>
          </div>
        </mu-col>
      </mu-row>
      <!-- </mu-container> -->

    </div>

    <footer class="chat-footer">
      <!-- <mu-container> -->
      <mu-bottom-nav>
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
  export default {};

</script>

<style>
  .chat-wrapper {
    margin: 0 auto;
    width:70%;
  }

  .chat-header {
    /* height: 100px; */
    border: 1px solid #000;
  }

  .chat-footer {
    border: 1px solid #000;
  }

  .chat-body {
    background: #fff;
    min-height: 400px;
  }

  .chat-userlist {
    /* border-right:1px solid #000; */
    min-height: 400px;
  }

  .chat-showbox {
    border-left: 1px solid #000;
    position: relative;
    min-height: 400px;
  }

  .chat-showInfo {
    height: 250px;
  }

  .chat-inputText {
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #000;
  }
  @media screen and (max-width:750px) {
    .chat-wrapper{
      width:100%;
    }
  }
</style>

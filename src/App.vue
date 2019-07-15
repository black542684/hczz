<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    let userInfo = {
      loginName: "admin"
    };
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
};
</script>

<style lang="less">
@bg: background; //  背景色

html,
body {
  height: 100%;
}
#app {
  height: 100%;
  overflow: auto;
  @{bg}: #ebf0f5;
}
//  @import "//at.alicdn.com/t/font_1129198_dkgbebuh6hn.css";
@import "../static/css/callDetail/font_icon.css";
// @import "../static/css/featureGuidance.less";
</style>

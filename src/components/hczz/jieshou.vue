<template>
  <div>
    <div class="xsxc-btn-box">
      <el-button type="primary" size="mini" @click="tjjs('shForm',0,0)">提交接收</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['myMethods'],
  data() {
    return {
      
    };
  },
  methods: {
    //  提交接收
    tjjs(formName, number, number02) {
      // 提交接收
      this.myMethods();
    }
  }
};
</script>
<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
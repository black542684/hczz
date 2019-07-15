<template>
  <div style="margin-bottom:10px;">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item" v-if="qsjgList.length>0">
        <div class="xsxc-form-title">签收结果</div>
        <div class="approve-list" v-for="(item,index) in qsjgList" :key="index">
          <el-form-item label="签收单位：">
            <div>{{ item.hParam.depName }}</div>
          </el-form-item>
          <el-form-item label="签收人：">
            <p class="success-result">{{ item.hParam.createName }}</p>
          </el-form-item>
          <el-form-item label="签收时间：">
            <div>{{ item.hParam.date }}</div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["qsjgList"],
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
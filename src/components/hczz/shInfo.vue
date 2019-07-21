<template>
  <div style="margin-bottom:10px;">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item" v-if="approveList.length>0">
        <div class="xsxc-form-title">审核信息</div>
        <div class="approve-list" v-for="(item,index) in approveList" :key="index">
          <el-form-item label="审核人：">
            <div>{{ item.createName }}</div>
          </el-form-item>
          <el-form-item label="审核结果：">
            <p class="success-result">{{ item.result }}</p>
          </el-form-item>
          <el-form-item label="审核意见：" class="xsxc-width100">
            <div>{{ item.suggest }}</div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["approveList"],
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
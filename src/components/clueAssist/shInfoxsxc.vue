<template>
  <div style="margin-bottom:10px;">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item" v-if="countApproveList.length>0">
        <div class="xsxc-form-title">审核信息</div>
        <div class="approve-list" v-for="(item,index) in countApproveList" :key="index">
          <el-form-item label="审核人：">
            <div>{{ item.createName }}</div>
          </el-form-item>
          <el-form-item label="审核结果：">
            <p class="success-result">{{ item.result }}</p>
          </el-form-item>
          <el-form-item
            v-if="item.suggest && item.suggest!=(-1)"
            label="审核意见："
            class="xsxc-width100"
          >
            <p>{{ item.suggest }}</p>
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
  },
  computed: {
    // 处理父组件传来的数据
    countApproveList: function () {
      let arr = [];
      this.approveList.forEach(item => {
        if (
          (item.endTime !== null) &&
          (item.hParam.result !== undefined) &&
          (item.hParam.result !== "退回") &&
          //  区县接收内容不显示
          (item.taskDefinitionKey != "xzqxjs") &&
          //  市级接收内容不显示
          (item.taskDefinitionKey != "sjjs") &&
          //  区县反馈
          (item.taskDefinitionKey != "xzqxfk") &&
          //  市局反馈
          (item.taskDefinitionKey != "sjjgfk")
        ) 
        {
          arr.push(item.hParam);
          console.log('除了反馈，接收，退回以外的历史信息', item);
        }
      });
      return arr.filter(item => item.suggest);
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
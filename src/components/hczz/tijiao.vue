<template>
  <div>
    <el-form :inline="true" :model="hczzData" :rules="ayRules" ref="tijiaoForm">
      <div class="xsxc-form-item">
        <div class="xsxc-form-title">提交信息</div>
        <el-form-item label="申请说明：" prop="applyDesc" class="xsxc-width100">
          <el-input type="textarea" v-model="hczzData.applyDesc" autosize></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  // 需要传递表单校验的方法
  props: ['hczzData'],
  data(){
    return{ayRules:{
        applyDesc: [
          { required: true, message: "请输入申请说明", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ] 
      },
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>

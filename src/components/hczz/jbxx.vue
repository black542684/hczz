<template>
  <div style="margin-bottom:10px;">
    <el-form :inline="true" :model="jbxx" :rules="edit ? ayRules : {}" ref="jbxxForm">
      <div :class="{'xsxc-xcxx-only-read':!edit}">
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">基本信息</div>
          <el-form-item label="合战名称：" prop="name">
            <el-input v-model="jbxx.name" placeholder size="small" :readonly="!edit"></el-input>
          </el-form-item>
          <el-form-item label="合战编号：">
            <el-input
              v-model="jbxx.code"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="下发时间：">
            <el-input
              v-model="jbxx.createTime"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="发起单位：">
            <el-input
              v-model="jbxx.createDepName"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="发起人：">
            <el-input
              v-model="jbxx.createName"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="!edit" label="提请需求：" class="xsxc-width100">
            <el-input
              type="textarea"
              v-model="jbxx.applyDesc"
              autosize
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["edit", "jbxx"],
  data() {
    return {
      ayRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ]
      }
    };
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
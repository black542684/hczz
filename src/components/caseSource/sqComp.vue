<template>
  <div style="margin-bottom:10px;">
    <el-form :inline="true" :model="ayData" :rules="ayRules" ref="ayForm">
      <div :class="{'xsxc-xcxx-only-read':!sqIsRead}">
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">{{titleList01.formName}}</div>
          <el-form-item :label="titleList01.name" prop="name">
            <el-input v-model="ayData.name" placeholder size="small" :readonly="!sqIsRead"></el-input>
          </el-form-item>
          <el-form-item :label="titleList01.number">
            <el-input
              v-model="ayData.code"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item :label="titleList01.time">
            <el-input
              v-model="ayData.createTime"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item :label="titleList01.unit">
            <el-input
              v-model="ayData.createDepName"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item :label="titleList01.person">
            <el-input
              v-model="ayData.createName"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="!sqIsRead" label="提请需求：" class="xsxc-width100">
            <el-input
              type="textarea"
              v-model="ayData.applyDesc"
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
import ayRules from '../../util/mixinRules.js'; //校验规则
import { titleList01 } from '../../util/publicObject.js'; // 设置标题变量
export default {
  props: ["sqIsRead", "ayData"],
  mixins: [ayRules],
  data() {
    return {
      yySuccess1: false, //  申请 - 引用成功与否（名称、数量）
      yySuccess2: false, //  申请 - 引用成功与否（手段、类别）
      bkID: "",
      createBy: "",
      taskId: "",
      ayRules,
      titleList01
    };
  },
  created() {
    console.log('子组件中获取ayData', this.ayData);
    this.bkID = this.$route.query.id;
    this.createBy = localStorage.getItem("userName");
    this.taskId = this.$route.query.taskId;
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
<template>
  <div>
    <el-form style="margin-top:10px;" :inline="true" :model="shData" :rules="shRules" ref="shForm">
      <div>
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">审核信息</div>
          <el-form-item label="审核人：">
            <el-input
              v-model="shData.createName"
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核结果：">
            <el-radio-group v-model="shData.result">
              <el-radio label="通过" @change="shResultFn"></el-radio>
              <el-radio label="退回" @change="shResultFn"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见：" prop="shyj" class="xsxc-width100">
            <el-input type="textarea" v-model="shData.suggest" autosize></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- 审核按钮 -->
    <div class="xsxc-btn-box">
      <template v-if="shBtnShow">
        <el-button type="primary" size="mini" @click="shSubmit('shForm',1)">通过审核</el-button>
      </template>
      <template v-if="!shBtnShow">
        <el-button type="warning" size="mini" @click="shSubmit('shForm',0)">退回给申请人</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ['audit', 'shData'],
  mixins: [],
  data() {
    return {
      shBtnShow: true, //  审核流程按钮切换控制
      shRules:{
        suggest: [
          { required: true, message: "请输入审核意见", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ]
      },
    };
  },
  methods: {
    //  审核页面 - 审核结果切换
    shResultFn(label) {
      if (label === "通过") {
        this.shBtnShow = true;
        this.shData.shyjLabel = "审核意见：";
      } else if (label === "退回") {
        this.shBtnShow = false;
        this.shData.shyjLabel = "退回原因：";
      }
    },
    //  审核页面 - 提交审核/退回
    shSubmit(formName, number) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交审核
          this.audit(number);
        }
      });
    },
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
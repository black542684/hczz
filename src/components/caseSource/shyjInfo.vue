<template>
  <div>
    <el-form style="margin-top:10px;" :inline="true" :model="shData" :rules="shRules" ref="shForm">
      <div>
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">审核信息</div>
          <el-form-item label="审核人：">
            <el-input
              v-model="shData.shr"
              placeholder
              size="small"
              class="xsxc-input-only-read"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核结果：">
            <el-radio-group v-model="shData.shjg">
              <el-radio label="通过" @change="shResultFn"></el-radio>
              <el-radio label="退回" @change="shResultFn"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="shData.shyjLabel" prop="shyj" class="xsxc-width100">
            <el-input type="textarea" v-model="shData.shyj" :rows="4"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 审核按钮 -->
    <div class="xsxc-btn-box">
      <template v-if="shBtnShow">
        <el-button type="primary" size="mini" @click="shSubmit('shForm','0')">通过审核</el-button>
      </template>
      <template v-if="!shBtnShow">
        <el-button type="warning" size="mini" @click="shSubmit('shForm','1')">退回给申请人</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["shData", "newTaskId"],
  data() {
    return {
      bkID: "",
      taskId: "",
      statusId: "",

      //  案源审核校验
      shRules: {
        shyj: [
          { required: true, message: "请输入审核意见", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ]
      },
      shBtnShow: true //  审核流程按钮切换控制
    };
  },
  mounted() {
    this.bkID = this.$route.query.id;
    this.taskId = this.$route.query.taskId;
    this.statusId = this.$route.query.statusId;
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
      //  审核退回
      this.$refs[formName].validate(valid => {
        if (valid) {
          //  表单校验非空
          let reviewData = {
            createBy: localStorage.getItem("userName"), //..审核状态下，当前登陆人
            id: this.bkID,
            statusId: this.statusId,
            taskId: this.newTaskId,
            opinionInfo: {
              suggest: this.shData.shyj,
              result: this.shData.shjg,
              createName: localStorage.getItem("realName"), //..审核状态下，当前登陆人
              isInvalid: number, //  通过or退回
              createBy: this.shData.sqr //  流程单子申请的人
            }
          };
          console.log(reviewData);
          this.$Ajax.post("casesource/csReview", reviewData, true).then(res => {
            console.log(res);
          });

          if (number === 0) {
            //  通过
            this.$message({
              type: "success",
              message: "审核成功!"
            });
            this.$router.push({
              name: "caseSourceManage"
            });
          } else {
            //  退回
            this.$confirm("是否退回给申请人重新填写?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$message({
                  type: "success",
                  message: "退回成功!"
                });
                this.$router.push({
                  name: "caseSourceManage"
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消退回操作"
                });
              });
          }
        } else {
          //console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
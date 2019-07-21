<template>
  <div>
    <el-form
      style="margin-top:10px;"
      :inline="true"
      :model="fkData"
      :rules="shRules"
      ref="shForm"
    >
      <div>
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">反馈信息</div>
          <el-form-item label="反馈意见" prop="feedbackContent" class="xsxc-width100">
            <el-input type="textarea" v-model="fkData.feedbackContent" autosize></el-input>
          </el-form-item>
          <el-form-item
            label="附件："
            style="width: auto;margin-right: 10px;"
            prop="originFile"
          >
            <div class="origin-upload">
              <input
                type="file"
                style="position: absolute;top: 7px;opacity: 0;z-index: 999;width: 56px;height: 28px;"
                multiple
                @change="uploadFiles($event, 7)"
                ref="uploadFiles"
              />
              <el-button type="primary" size="mini">上传</el-button>
              <el-input v-show="false" v-model="FKData.originFile"></el-input>
            </div>
          </el-form-item>
          <el-form-item style="width: 1030px;">
            <div class="origin-file-list">
              <ul v-show="originFileList.length !== 0" class="clearfix">
                <li
                  v-for="(item,index) in originFileList"
                  :key="index"
                  style="font-size:12px;float:left;margin-right:10px;"
                >
                  <span>{{ item.fileName }}</span>
                  <i
                    class="el-icon-close"
                    style="cursor:pointer;font-size: 14px;"
                    @click="deleleFile(item, fankuiDOM)"
                  ></i>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="xsxc-btn-box">
      <template>
        <el-button type="primary" size="mini" @click="shSubmit()">提交反馈</el-button>
      </template>
      <!-- <template>
        <el-button
          type="warning"
          size="mini"
          @click="shSubmit02('shForm',0,1)"
        >提交市局协查</el-button>
      </template> -->
    </div>
  </div>
</template>

<script>
import instructRules from '@/util/hczz/hczzManageMixinRule.js'; // 表单校验规则
import {  uniq } from '../../util/publicTools.js';  // 数组去重
// import fileMethods from '../../util/hczz/hczzFileMethods.js'; // 上传
export default {
  props: ['myMethods', 'fkData'],
  //mixins: [fileMethods],
  data() {
    return {
      shData:{
        shyj:'',
        uploadNumber:10
      },
      FKData:{
        originFile:'',
        attachments: []
      },
      originFileList:[],
      shRules: {
        feedbackContent: [
          { required: true, message: "请输入审核意见", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        originFile: [{ required: false, message: "请传附件", trigger: "blur" }],
      }
    };
  },
  watch: {
    'fkData.attachments': function (val) {
      this.originFileList = val;
      this.FKData.originFile = '附件上传成功';
    }
  },
  computed: {
    fankuiDOM: function () {
      return this.$refs.uploadFiles
    }
  },
  methods: {
    //  提交市局协查
    shSubmit02(formName, number, number02) {},
    //  审核页面 - 提交审核/退回
    shSubmit(formName, number, number02) {
      this.$refs.shForm.validate(valid => {
        if(valid) {
          // 提交成功
          this.myMethods();
        } else {
          return false;
        }
      })
      
    },
    //  文件上传
    async uploadFiles(e,num) {
      let fileList = e.currentTarget.files;
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }
      if (fileList !== "") {
        this.fkData.originFile = "附件已上传";
      }
      // 上传文件接口
      let data = await this.$Ajax.form(`upload/batch?classify=${num}`, formData);
      if (data.data.length > 0) {
        data.data.forEach(item => {
          this.fkData.attachments.push(item);  // 需要上传的数据列表
          this.originFileList.push(item);   // 展示的文件名字
        });
      }
      // 数组去重
      this.originFileList = uniq(this.originFileList);
    },
    // 删除文件
    deleleFile(item, child) {
      let params = {id: item.id};
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          this.$Ajax
            .post("fightcmd/delAttachments", params, true)
            .then(data => {
              console.log("线索协查信息附件删除", data);
            });
          let path = "";
          let url =
            "upload/deleteFile?id=" +
            item.id +
            "&fileName=" +
            item.fileName +
            "&path=" +
            path;
          let data = await this.$Ajax.post(url, {}, true);

          if (data.status !== 200) {
            this.$message({ message: "附件删除失败", type: "warning" });
          }

          this.originFileList.forEach((ele, index) => {
            if (ele.id === item.id) {
              this.originFileList.splice(index, 1);
            }
          });

          this.fkData.attachments.forEach((ele, index) => {
            if (ele.id === item.id) {
              this.fkData.attachments.splice(index, 1);
            }
          });
          child.value = ""; //..上传input的value置空
          this.$message({
            message: "附件删除成功",
            type: "success"
          });
      }).catch(err => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
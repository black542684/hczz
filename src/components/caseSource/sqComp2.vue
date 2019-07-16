<template>
  <div style="margin-bottom:10px;">
    <el-form :inline="true" :model="ayData" :rules="ayRules" ref="ayForm">
      <div :class="{'xsxc-xcxx-only-read':!sqIsRead}">
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">{{titleList02.formName}}</div>
          <el-form-item :label="titleList02.number" prop="caseSourceCode">
            <el-input
              v-model="ayData.caseSourceCode"
              placeholder
              size="small"
              :readonly="!sqIsRead"
              @blur="reference"
            ></el-input>
          </el-form-item>
          <el-form-item :label="titleList02.name" prop="caseSourceName">
            <el-input
              v-model="ayData.caseSourceName"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess1}"
              :readonly="yySuccess1"
            ></el-input>
          </el-form-item>
          <el-form-item label="作案手段：" prop="meansOfCrime">
            <el-input
              v-model="ayData.meansOfCrime"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess2}"
              :readonly="yySuccess2"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件数量：" prop="caseAmount">
            <el-input
              v-model="ayData.caseAmount"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess1}"
              :readonly="yySuccess1"
            ></el-input>
          </el-form-item>
          <el-form-item label="研判人员：" prop="judgmentName">
            <el-input v-model="ayData.judgmentName" placeholder size="small" :readonly="!sqIsRead"></el-input>
          </el-form-item>
          <el-form-item label="案件类别：" prop="caseTypeName">
            <el-select v-model="ayData.caseTypeName" placeholder="请选择案件类别" size="small" v-if="!yySuccess2">
              <el-option label="盗窃" value="盗窃"></el-option>
              <el-option label="抢劫" value="抢劫"></el-option>
              <el-option label="抢夺" value="抢夺"></el-option>
              <el-option label="诈骗" value="诈骗"></el-option>
            </el-select>
            <div style="width:150px;" v-if="yySuccess2">{{ayData.caseTypeName}}</div>
          </el-form-item>
          <el-form-item label="简要案情：" prop="caseInfo" class="xsxc-width100">
            <el-input type="textarea" v-model="ayData.caseInfo" autosize :readonly="!sqIsRead"></el-input>
          </el-form-item>
          <el-form-item label="串并依据：" prop="techEvide" class="xsxc-width100">
            <el-checkbox-group v-model="ayData.techEvide" v-if="sqIsRead">
              <el-checkbox label="DNA"></el-checkbox>
              <el-checkbox label="指纹"></el-checkbox>
              <el-checkbox label="视频"></el-checkbox>
              <el-checkbox label="足迹"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
            </el-checkbox-group>
            <span v-if="!sqIsRead">{{ayData.techEvide}}</span>
          </el-form-item>
          <el-form-item label="线索特征：" prop="clueFeature" class="xsxc-width100">
            <el-input type="textarea" v-model="ayData.clueFeature" autosize :readonly="!sqIsRead"></el-input>
          </el-form-item>
          <el-form-item label="附件：" style="width: auto;margin-right: 10px;" prop="originFile">
            <div class="origin-upload">
              <input
                type="file"
                style="position: absolute;top: 7px;opacity: 0;z-index: 999;width: 56px;height: 28px;"
                multiple
                @change="uploadFiles($event, 10)"
                ref="uploadFiles"
                v-if="sqIsRead"
              />
              <el-button type="primary" size="mini" v-if="sqIsRead">上传</el-button>
              <el-input v-show="false" v-model="ayData.originFile"></el-input>
            </div>
            <template v-for="(item,index) in ayData.fileList">
              <a
                v-if="!sqIsRead"
                :key="index"
                style="margin-right:10px;color:#409EFF;"
                :href="item.fileVisitPath"
                target="_blank"
              >{{item.fileName}} ;</a>
            </template>
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
                    @click="deleleFile(item, spComps2)"
                  ></i>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import ayRules from '../../util/mixinRules.js'; // 校验规则
import { titleList02 } from '../../util/publicObject.js';  // 标题名字
export default {
  props: [
    "sqIsRead",
    "ayData",
    "originFileList",
    "uploadFiles",
    "deleleFile",
    "yySuccess1",
    "yySuccess2"
  ],
  mixins: [ayRules],
  data() {
    
    return {
      // yySuccess1:false,  //  申请 - 引用成功与否（名称、数量）
      // yySuccess2:false,  //  申请 - 引用成功与否（手段、类别）
      bkID: "",
      createBy: "",
      taskId: "",
      titleList02
    };
  },
  created() {
    console.warn('trim', this.ayRules);
    this.bkID = this.$route.query.id;
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    this.taskId = this.$route.query.taskId;
  },
  methods: {
    //  引用
    reference() {
      // 案件编号
      let caseSourceCode = this.ayData.caseSourceCode.trim();
      if (caseSourceCode === "") {
        this.$message({
          message: "请输入案件编号！",
          type: "warning"
        });
      }
      if (this.sqIsRead) {
        this.$Ajax
          .post("ssSeriesInfoController/listSeriesByNos", {seriesNos: caseSourceCode}, true)
          .then(res => {
            console.log(res);
            if (res.data.length === 0) {
              this.$Ajax
                .post("ssSeriesInfoController/listCaseInfoByNos", {caseNos: caseSourceCode}, true)
                .then(res => {
                  this.ayData.caseAmount = "1";
                  this.ayData.caseSourceName = res.data[0].case_title;
                  this.ayData.briefCase = res.data[0].case_content;
                  this.ayData.meansOfCrime = res.data[0].crime_method_type;
                  this.ayData.caseTypeName = res.data[0].case_small_type;

                  this.yySuccess1 = true;
                  this.yySuccess2 = true;

                  this.$message({
                    message: "案串编号引用成功！",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.ayData.caseAmount = "";
                  this.ayData.caseSourceName = "";
                  this.ayData.briefCase = "";
                  this.ayData.meansOfCrime = "";
                  this.ayData.caseTypeName = "";

                  this.yySuccess1 = false;
                  this.yySuccess2 = false;

                  this.$message({
                    message: "系统未找到对应的串案/案件编号，请手动输入",
                    type: "warning"
                  });
                });

            } else {
              this.ayData.caseAmount = res.data[0].caseNum.toString();
              this.ayData.caseSourceName = res.data[0].seriesName;
              this.ayData.meansOfCrime = "";
              this.ayData.caseTypeName = "";

              this.yySuccess1 = true;
              this.yySuccess2 = false;

              this.$message({
                message: "案串编号引用成功！",
                type: "success"
              });
            }
          })
          .catch(err => {});
      }
    }
  },

  computed: {
    spComps2: function() {
      return this.$refs.uploadFiles;
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
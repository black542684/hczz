<template>
  <div style="margin-bottom:10px;">
    <el-form :inline="true" :model="hczzData" :rules="edit ? {} : ayRules" ref="xcxxForm">
      <div :class="{'xsxc-xcxx-only-read':edit}">
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">案源信息</div>
          <el-form-item label="案件编号：" prop="caseSourceCode">
            <el-input
              v-model="hczzData.caseSourceCode"
              placeholder
              size="small"
              :readonly="edit"
              @blur="reference"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件名称：" prop="caseSourceName">
            <el-input
              v-model="hczzData.caseSourceName"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess1}"
              :readonly="yySuccess1"
            ></el-input>
          </el-form-item>
          <el-form-item label="作案手段：" prop="meansOfCrime">
            <el-input
              v-model="hczzData.meansOfCrime"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess2}"
              :readonly="yySuccess2"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件数量：" prop="caseAmount">
            <el-input
              v-model="hczzData.caseAmount"
              placeholder
              size="small"
              :class="{'xsxc-input-only-read':yySuccess1}"
              :readonly="yySuccess1"
            ></el-input>
          </el-form-item>
          <el-form-item label="研判人员：" prop="judgmentName">
            <el-input v-model="hczzData.judgmentName" placeholder size="small" :readonly="edit"></el-input>
          </el-form-item>
          <el-form-item label="案件类别：" prop="caseTypeName">
            <el-select v-model="hczzData.caseTypeName" placeholder="请选择案件类别" size="small" v-if="!yySuccess2">
              <el-option label="盗窃" value="盗窃"></el-option>
              <el-option label="抢劫" value="抢劫"></el-option>
              <el-option label="抢夺" value="抢夺"></el-option>
              <el-option label="诈骗" value="诈骗"></el-option>
            </el-select>
            <div style="width:150px;" v-if="yySuccess2">{{hczzData.caseTypeName}}</div>
          </el-form-item>
          <el-form-item label="简要案情：" prop="caseInfo" class="xsxc-width100">
            <el-input type="textarea" v-model="hczzData.caseInfo" autosize :readonly="edit"></el-input>
          </el-form-item>
          <el-form-item label="串并依据：" prop="techEvide" class="xsxc-width100">
            <el-checkbox-group v-model="hczzData.techEvide" v-if="!edit">
              <el-checkbox label="DNA"></el-checkbox>
              <el-checkbox label="指纹"></el-checkbox>
              <el-checkbox label="视频"></el-checkbox>
              <el-checkbox label="足迹"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
            </el-checkbox-group>
            <span v-if="edit">{{hczzData.techEvide}}</span>
          </el-form-item>
          <el-form-item label="线索特征：" prop="clueFeature" class="xsxc-width100">
            <el-input type="textarea" v-model="hczzData.clueFeature" autosize :readonly="edit"></el-input>
          </el-form-item>
          <el-form-item label="附件：" style="width: auto;margin-right: 10px;" prop="originFile">
            <div class="origin-upload">
              <input
                type="file"
                style="position: absolute;top: 7px;opacity: 0;z-index: 999;width: 56px;height: 28px;"
                multiple
                @change="uploadFiles($event, 3)"
                ref="uploadFiles"
                v-if="!edit"
              />
              <el-button type="primary" size="mini" v-if="!edit">上传</el-button>
              <el-input v-show="false" v-model="hczzData.originFile"></el-input>
            </div>
            <template v-for="(item,index) in hczzData.attachments">
              <a
                v-if="edit"
                :key="index"
                style="margin-right:10px;color:#409EFF;"
                :href="item.fileVisitPath"
                target="_blank"
              >{{item.fileName}} ;</a>
            </template>
          </el-form-item>
          <el-form-item style="width: 1030px;">
            <div class="origin-file-list">
              <ul v-show="originFileList.length !== 0 && !edit" class="clearfix">
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
import pubilcMethod from '../../util/hczz/hczzFileMethods.js'; // 文件上传和文件删除方法
export default {
  props: [
    "edit",
    "hczzData",           //..返回的数据
    //"uploadFiles",      //..上传文件函数
    //"deleleFile",       //..删除文件函数
    //"titleList02",      //..label名称
    "yySuccess1",       //..控制案件编号引用完成之后，其他两个
    "yySuccess2",       //  作案手段和案件类别切换编辑/只读状态
  ],
  mixins: [ayRules, pubilcMethod],
  data() {
    return {
      bkID: "",
      createBy: "",
      taskId: "",
      // 上传附件的名字
      originFileList: [],
      //  新数据
      xcxx:{
        edit:false,
      }
    };
  },
  created() {
    this.bkID = this.$route.query.id;
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    this.taskId = this.$route.query.taskId;
    /* this.$nextTick(() => {
      this.hczzData.attachments.forEach(ele => {
        this.originFileList.push(ele);
      });
    }) */
    // this.originFileList = this.hczzData.attachments; // 用来展示数据
  },
  watch: {
    'hczzData.attachments': function (val) {
      if(this.$route.query.isSQ=== 1) return;
      this.originFileList = [];
      
      val.forEach(ele => {
        this.originFileList.push(ele);
        // console.log(ele)
        this.hczzData.originFile = '附件上传成功';
      });
    }
  },
  methods: {
    //  引用
    reference() {
      // 案件编号
      let caseSourceCode = this.hczzData.caseSourceCode.trim();
      if (caseSourceCode === "") {
        this.$message({
          message: "请输入案件编号！",
          type: "warning"
        });
      }
      if (!this.edit) {
        this.$Ajax
          .post("ssSeriesInfoController/listSeriesByNos", {seriesNos: caseSourceCode}, true)
          .then(res => {
            console.log(res);
            if (res.data.length === 0) {
              this.$Ajax
                .post("ssSeriesInfoController/listCaseInfoByNos", {caseNos: caseSourceCode}, true)
                .then(res => {
                  this.hczzData.caseAmount = "1";
                  this.hczzData.caseSourceName = res.data[0].case_title;
                  this.hczzData.briefCase = res.data[0].case_content;
                  this.hczzData.meansOfCrime = res.data[0].crime_method_type;
                  this.hczzData.caseTypeName = res.data[0].case_small_type;
                  //this.yySuccess1 = true;
                  //this.yySuccess2 = true;
                  this.$message({
                    message: "案串编号引用成功！",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.hczzData.caseAmount = "";
                  this.hczzData.caseSourceName = "";
                  this.hczzData.briefCase = "";
                  this.hczzData.meansOfCrime = "";
                  this.hczzData.caseTypeName = "";

                  //this.yySuccess1 = false;
                  //this.yySuccess2 = false;

                  this.$message({
                    message: "系统未找到对应的串案/案件编号，请手动输入",
                    type: "warning"
                  });
                });

            } else {
              this.hczzData.caseAmount = res.data[0].caseNum.toString();
              this.hczzData.caseSourceName = res.data[0].seriesName;
              this.hczzData.meansOfCrime = "";
              this.hczzData.caseTypeName = "";

              //this.yySuccess1 = true;
              //this.yySuccess2 = false;

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
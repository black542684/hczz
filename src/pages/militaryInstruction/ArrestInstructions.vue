<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">研判指令落地抓捕</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link tag="span" to='evaluateInstructions' style="display:inline-block;margin-right:10px;"> -->
              <el-button type="primary" size="small" @click="submitZB" v-if="isOnlyRead & btnShowFlag">提交</el-button>
              <!-- </router-link> -->
              <el-button size="small" @click="checkProcess">查看流程</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-form
        :inline="true"
        :model="instructForm"
        ref="instructForm"
        class="instruct-form form-style"
        label-width="100px"
      >
        <instructions :instructForm="instructForm"/>

        <div class="form-item" style="padding-bottom: 20px;">
          <div class="form-title">专案组人员</div>
          <el-table :data="specialCaseTableData" class="element-table border-table">
            <el-table-column prop="types" label="侦办单位" width="80"></el-table-column>
            <el-table-column prop="units" label width="300"></el-table-column>
            <el-table-column prop="names" label="姓名"></el-table-column>
            <el-table-column prop="duty" label="职务"></el-table-column>
            <el-table-column prop="options" label="侦办角色"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
          </el-table>
        </div>

        <div class="form-item">
          <div class="form-title">提交信息</div>
          <div class="approve-list" v-for="(item,index) in approveList" :key="index">
            <el-form-item label="审核人：" prop="superiorAuditor">
              <div>{{ item.hParam.createName }}</div>
            </el-form-item>
            <el-form-item label="审核结果：" prop="auditorResult">
              <p class="success-result">{{ item.hParam.result }}</p>
            </el-form-item>
            <!-- 占位 -->
            <el-form-item></el-form-item>

            <el-form-item label="审核意见：" prop="applyInstructions" class="check-brief-case-content">
              <div>{{ item.hParam.suggest }}</div>
            </el-form-item>
          </div>
        </div>

        <div class="form-item" style="padding-bottom: 20px;">
          <div class="form-title">侦办工作反馈</div>
          <!-- <el-table :data="caseFeedbackTableData" class="element-table border-table">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="duty" label="侦办单位" width="200"></el-table-column>
                        <el-table-column prop="person" label="反馈人员" width="100"></el-table-column>
                        <el-table-column prop="time" label="反馈时间" width="240"></el-table-column>
                        <el-table-column prop="status" label="阶段性工作侦查情况"></el-table-column>
                        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                        <el-table-column prop="accessory" label="附件" width="150">
                        </el-table-column>
          </el-table>-->
          <div class="insFeedbacks-box">
            <div class="insFeedbacks-table">
              <div class="insFeedbacks-title">
                <ul class="clearfix">
                  <li style="width:5%">序号</li>
                  <li>侦办单位</li>
                  <li>反馈人员</li>
                  <li>反馈时间</li>
                  <li style="width:35%">阶段性工作侦查情况</li>
                  <li>附件</li>
                </ul>
              </div>
              <div
                class="insFeedbacks-item"
                v-for="(item,index) in caseFeedbackTableData"
                :key="index"
              >
                <ul class="clearfix">
                  <li style="width:5%">{{ index + 1 }}</li>
                  <li :title="item.spyDepName">{{ item.spyDepName }}</li>
                  <li :title="item.spyDepName">{{ item.spyDepName }}</li>
                  <li :title="item.feedbackTime">{{ item.feedbackTime }}</li>
                  <li style="width:35%" :title="item.workContent">{{ item.workContent }}</li>
                  <li>
                    <a
                      :href="item.fileVisitPath"
                      :download="item.fileName"
                      v-for="(item,index) in item.attachments"
                      :key="index"
                    >{{ item.fileName }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="form-item" style="padding-bottom: 20px;" v-if="isOnlyRead & btnShowFlag">
          <div class="form-title">落地抓捕情况</div>

          <p class="second-title">破获案件</p>
          <el-table :data="arrestTableData" class="element-table padding-table">
            <el-table-column prop="number" label="案件编号" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.number" placeholder="请输入案件编号"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="units" label="立案单位" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.units" placeholder="请输入立案单位"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="立案时间">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="案发地点" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.address" placeholder="请输入案发地点"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="caseName" label="案件名称" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.caseName" placeholder="请输入案件名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="operation" width="60" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, arrestTableData)"
                  icon="el-icon-delete"
                  class="change-delete-style"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" @click="addSolve" style="margin: 10px 0 40px 18px;">添加破获案件</el-button>

          <p class="second-title">抓获人员</p>
          <el-table :data="capturedTableData" class="element-table padding-table">
            <el-table-column prop="name" label="姓名" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="姓名"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="genders" label="性别" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.genders" placeholder="性别" size="small">
                  <el-option
                    v-for="gender in genders"
                    :key="gender.value"
                    :label="gender.label"
                    :value="gender.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="numberID" label="身份证号" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.numberID" placeholder="请输入身份证号"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="homeAddress" label="户籍地址" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.homeAddress" placeholder="请输入户籍地址"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="beforeInfo" label="前科信息" width="300">
              <template slot-scope="scope">
                <el-input v-model="scope.row.beforeInfo" placeholder="请输入前科信息"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="operation" width="60" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRowSec(scope.$index, capturedTableData)"
                  icon="el-icon-delete"
                  class="change-delete-style"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" @click="addCaptured" style="margin: 10px 0 40px 18px;">添加抓获人员</el-button>

          <p class="second-title">破案报告</p>
          <div class="arrest-report">
            <!-- <el-upload
                            action="http://192.168.1.123:8080/upload/batch"
                            ref="newupload"
                            multiple
                            :auto-upload="true"
                            :before-upload="beforeUpload"
                            :before-remove="beforeRemove"
                            :on-success="uploadSuccess"
                            :on-remove="removeSuccess"
                            :limit="10">
                            <div class="upload-box">
                                <el-button size="small">上传</el-button>
                            </div>
            </el-upload>-->
            <div class="arrest-file">
              <input type="file" name id multiple @change="uploadFile">
              <div>上传</div>
            </div>
            <div class="arrest-file-list">
              <div v-for="(item,index) in files" :key="index">
                <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
                <i class="iconfont iconguanbi2"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="isOnlyRead & btnShowFlag">
          <el-form-item>
            <!-- <router-link tag="span" to='ypManagement' style="display:inline-block;"> -->
            <el-button type="primary" size="small" @click="submitZB">提交</el-button>
            <!-- </router-link> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode">
        <flow-chart :chartData='chartData' :processIsShow='isData'></flow-chart>
      </div>
    </div>
  </div>
</template>

<script>
//  引入流程图插件 AntV/g6
import G6 from "@antv/g6";
//  引入流程图节点图片
import processNodeDefault from "../../../static/image/processNodeDefault.png";
import processNodeSuccess from "../../../static/image/processNodeSuccess.png";
// 引入流程图
import flowChart from '../../components/flowChart'
//  引入通用'指令'组件
import instructions from "../../components/MILInstructions.vue";
import UtilService from "../../service/UtilService.js";
import { fail } from "assert";

export default {
  name: "arrestInstructions",
  components: {
    instructions,
    flowChart
  },
  data() {
    return {
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      isBack: false, //  是否退回

      instructForm: {
        //  表单内容
        //  指令信息内容
        instructName: "",
        instructNumber: "",
        unit: "",
        person: "",
        time: "",

        //  案源信息内容
        caseNumber: "",
        caseName: "",
        caseMeans: "",
        caseCount: 0,
        personnel: "",
        caseType: "",
        briefCase: ``,
        gist: "",
        clueTrait: "",
        fileList: [], //  保存上传附件名称的数组

        //  指定侦办内容
        mainSpyUnit: "",
        cooperateSpyUnit: "",
        spyRequire: "",

        //  提交信息内容
        superiorAuditor: "",
        auditorResult: "",
        applyInstructions: "",

        //  审批部分
        approveAuditor: "",
        approveResult: "",
        approveInstructions: ""
      },
      specialCaseTableData: [
        //  专案组table数据
      ],
      caseFeedbackTableData: [
        //  侦办工作反馈table数据
      ],
      isUpload: false,
      arrestTableData: [
        //  破获案件table数据
        {
          number: "",
          units: "",
          time: "",
          address: "",
          caseName: ""
        }
      ],
      capturedTableData: [
        //  抓获人员列表数据
        {
          name: "",
          numberID: "",
          homeAddress: "",
          beforeInfo: ""
        }
      ],
      genders: [
        //  性别
        {
          value: 0,
          label: "男"
        },
        {
          value: 1,
          label: "女"
        }
      ],
      fileAttachments: [],
      bkID: "",
      createBy: "",
      token: "",
      isOnlyRead: false,
      btnShowFlag: false, // 流程控制按钮
      files: [], //破案报告附件
      approveList: [], // 审批过程
      createByName: '', // 建单人
      userList: "", // 主侦下的人员
      taskId: '',
      isData: false,
      chartData: '', // 流程图数据
    };
  },
  created() {
    this.taskId = this.$route.query.taskId
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    if (this.$route.query.statusType) {
      if (
        this.$route.query.statusType === "1" ||
        this.$route.query.statusType === "2"
      ) {
        this.isOnlyRead = false;
      } else {
        this.isOnlyRead = true;
      }
    }
  },
  mounted() {
    // this.bkID = window.location.href.split('=')[1]; //..获取当前路径下的布控ID
    this.bkID = this.$route.query.id;
    this.initChart()

    //  获取数据
    this.$Ajax
      .get(
        "fightcmd/cmdDetails",
        { id: this.bkID, createBy: this.createBy },
        true
      )
      .then(res => {
        console.log(res);
        //  指令信息
        this.instructForm.instructName = res.data.cmdDetails.insName;
        this.instructForm.instructNumber = res.data.cmdDetails.insCode;
        this.instructForm.unit = res.data.cmdDetails.createDepName;
        this.instructForm.person = res.data.cmdDetails.createName;
        this.instructForm.time = res.data.cmdDetails.createTime;

        //  案源信息
        this.instructForm.caseNumber = res.data.cmdDetails.caseSourceCode;
        this.instructForm.caseName = res.data.cmdDetails.caseSourceName;
        this.instructForm.caseMeans = res.data.cmdDetails.meansOfCrime;
        this.instructForm.caseCount = res.data.cmdDetails.caseAmount;
        this.instructForm.personnel = res.data.cmdDetails.judgmentName;
        this.instructForm.caseType = res.data.cmdDetails.caseTypeName;
        this.instructForm.briefCase = res.data.cmdDetails.caseInfo;
        this.instructForm.gist = res.data.cmdDetails.techEvide;
        this.instructForm.clueTrait = res.data.cmdDetails.clueFeature;
        this.instructForm.attachments = res.data.cmdDetails.attachments;
        for (var i = 0; i < res.data.cmdDetails.attachments.length; i++) {
          this.instructForm.fileList.push(
            res.data.cmdDetails.attachments[i].fileName
          );
        }
        // 建单人
        this.createByName = res.data.cmdDetails.createBy
        //  指定侦办
        this.instructForm.mainSpyUnit = res.data.cmdDetails.mainSpyDepName;
        this.instructForm.cooperateSpyUnit = res.data.cmdDetails.coSpyDepName;
        this.instructForm.spyRequire = res.data.cmdDetails.spyRequire;
        this.instructForm.applyDesc = res.data.cmdDetails.applyDesc;

        //  提交信息
        // this.instructForm.superiorAuditor = res.data.activitiInfoList.data[1].assignee;
        // this.instructForm.auditorResult = res.data.activitiInfoList.data[1].hParam.result ;
        // this.instructForm.applyInstructions = res.data.activitiInfoList.data[1].hParam.reason;
        res.data.activitiInfoList.data.forEach(item => {
          if ((item.endTime !== null) & (item.hParam.result !== undefined)) {
            this.approveList.push(item);
          }
          if (item.taskDefinitionKey === "zzzlsq") {
            this.userList = item.hParam.userList;
          }
        });

        // 流程按钮
            if (res.data.btn.length > 0) {
                res.data.btn.forEach(item => {
                    if (item.taskDefKey === this.$route.query.deptType) {
                        this.btnShowFlag = true;
                    }
                });
            }

        //  审批部分
        this.instructForm.approveAuditor =
          res.data.activitiInfoList.data[2].assignee;
        this.instructForm.approveResult =
          res.data.activitiInfoList.data[2].hParam.result;
        this.instructForm.approveInstructions =
          res.data.activitiInfoList.data[2].hParam.reason;

        //  专案组人员table数据
        for (var i = 0; i < res.data.cmdDetails.insTaskForces.length; i++) {
          const setObj = {};
          setObj.types = res.data.cmdDetails.insTaskForces[i].typeName;
          setObj.units = res.data.cmdDetails.insTaskForces[i].spyDepName;
          setObj.names = res.data.cmdDetails.insTaskForces[i].memberName;
          setObj.options = res.data.cmdDetails.insTaskForces[i].role;
          setObj.duty = res.data.cmdDetails.insTaskForces[i].memberPost;
          setObj.phone = res.data.cmdDetails.insTaskForces[i].memberPhone;

          this.specialCaseTableData.push(setObj);
        }

        //  侦办工作反馈table数据
        // for(var j=0;j<res.data.cmdDetails.insFeedbacks.length;j++){
        //     const setObj = {};
        //     setObj.duty = res.data.cmdDetails.insFeedbacks[j].spyDepName;
        //     setObj.person = res.data.cmdDetails.insFeedbacks[j].spyName;
        //     setObj.time = res.data.cmdDetails.insFeedbacks[j].feedbackTime;
        //     setObj.status = res.data.cmdDetails.insFeedbacks[j].workContent;
        //     //setObj.phone = null;//res.data.cmdDetails.insFeedbacks[j].;
        //     setObj.accessory = res.data.cmdDetails.insFeedbacks[j].attachments;

        //     this.caseFeedbackTableData.push(setObj);
        // }
        this.caseFeedbackTableData = res.data.cmdDetails.insFeedbacks;
      });
  },
  methods: {
    initChart() {
            let that = this
            let params = {
                id: that.bkID,
                token: that.token
            }
            this.$Ajax.get('flow/processDrawing',params).then( res=>{
                console.log('流程图', res);
                that.chartData = res.data.results
                that.isData = true
                
            }).catch(err=>{
                console.log(err)
            });
        },
        //  查看流程
        checkProcess() {
            this.processIsShow = !this.processIsShow;
        },

    // 上传文件
    uploadFile(event) {
      let fileList = event.currentTarget.files;
      let that = this;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
      } else {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
        }
      }
      this.$Ajax.form("upload/batch", formData).then(data => {
        if (data.data.length > 0) {
          data.data.forEach(item => {
            item.classify = 2;
            that.fileAttachments.push(item);
            that.files.push(item);
          });
        }
      });
    },

    //  添加破获案件
    addSolve() {
      const solveData = {
        number: "",
        units: "",
        time: "",
        address: "",
        caseName: ""
      };
      this.arrestTableData.push(solveData);
    },
    //  破获案件——表格删除行
    deleteRow(index, rows) {
      if (rows.length === 1) {
        this.$message({
          message: "请至少填写1个破获案件",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            rows.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
        });
      }
    },
    //  添加抓获人员
    addCaptured() {
      const capturedData = {
        name: "",
        numberID: "",
        homeAddress: "",
        beforeInfo: ""
      };
      this.capturedTableData.push(capturedData);
    },
    //  抓获人员——表格删除行
    deleteRowSec(index, rows) {
      if (rows.length === 1) {
        this.$message({
          message: "请至少填写1个抓获人员",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            rows.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
        });
      }
    },

    //  提交
    submitZB() {
      let that = this;
      const postData = {
        id: this.bkID,
        taskId: this.taskId,
        createBy: this.createBy,
        peoples: [],
        cases: [],
        attachments: [
          // {
          //     "id": "5e7cf5379",
          //     "relationId": null,
          //     "fileType": "plain",
          //     "fileName": "治理.txt",
          //     "fileSuffix": ".txt",
          //     "fileSavePath": null,
          //     "uploadTime": null,
          //     "uploadBy": null,
          //     "uploadName": null,
          //     "fileSize": "2085",
          //     "fileVisitPath": null,
          //     "classify": "2，只对应修改此参数"
          // }
        ],
        opinionInfo: {
          userList: this.userList,
          createBy: that.createByName,
        }
      };

      //  cases
      const caseArr = [];
      for (var i = 0; i < this.arrestTableData.length; i++) {
        const aObj = {};
        aObj.insId = this.bkID;
        aObj.caseCode = this.arrestTableData[i].number;
        aObj.putOnDep = this.arrestTableData[i].units;
        aObj.putOnTime = this.arrestTableData[i].time;
        aObj.caseName = this.arrestTableData[i].caseName;
        aObj.caseAddress = this.arrestTableData[i].address;
        aObj.createTime = UtilService.formatDuring(
          +new Date(),
          "yyyy-MM-dd HH:mm:ss"
        ); //this.arrestTableData[i].time;

        caseArr.push(aObj);
      }
      postData.cases = caseArr;

      //  peoples
      const peopleArr = [];
      for (var i = 0; i < this.capturedTableData.length; i++) {
        const aObj = {};
        aObj.insId = this.bkID;
        aObj.peopleIdcard = this.capturedTableData[i].numberID;
        aObj.peopleName = this.capturedTableData[i].name;
        aObj.peopleSex = this.capturedTableData[i].genders;
        aObj.peopleAddr = this.capturedTableData[i].homeAddress;
        aObj.peopleCrimeBefore = this.capturedTableData[i].beforeInfo;
        aObj.createTime = UtilService.formatDuring(
          +new Date(),
          "yyyy-MM-dd HH:mm:ss"
        ); //this.capturedTableData[i].;

        peopleArr.push(aObj);
      }
      postData.peoples = peopleArr;

      postData.attachments = this.fileAttachments;

      console.log("参数参数", postData);
      this.$Ajax
        .post("fightcmd/cmdDownCatch", postData, true)
        .then(res => {
          console.log(res);
          if (res.data === "success") {
            that.$message({
              message: "提交成功！",
              type: "success"
            });
            that.$router.push({
              name: "fightManage"
            });
          } else {
            that.$message({
              message: "提交失败！",
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/CheckIns.less";

.big-box {
  padding-bottom: 10px;
}
.success-result {
  color: #207245;
}

//  饿了么table样式修改
/deep/.element-table {
  width: 1270px;
  margin: 0 auto;
  /deep/tr {
    @{bg}: #f7faff;
  }
  /deep/th {
    @{bg}: #eef4f9;
    .border-top(1px, #d7dde5);
    .border-bottom(1px, #d7dde5);
  }
  /deep/th:nth-child(1) {
    .border-left(1px, #d7dde5);
  }
  /deep/th:nth-last-child(2) {
    .border-right(1px, #d7dde5);
  }
  .change-delete-style {
    border: 0;
    padding: 6px;
    @{bg}: transparent;
  }
  .el-input__inner {
    height: 28px;
    @{lh}: 28px;
  }
  /deep/button {
    padding: 7px 25px;
  }
  /deep/.el-input__icon {
    @{lh}: 28px;
  }
}
/deep/.border-table {
  /deep/td:nth-child(1) {
    .border-left(1px, #d7dde5);
  }
  /deep/td:nth-last-child(1) {
    .border-right(1px, #d7dde5);
  }
}

.second-title {
  margin-bottom: 10px;
  padding-left: 18px;
  @{fs}: 14px;
  @{fw}: bold;
  color: #6b757e;
}
/deep/.padding-table {
  /deep/td:nth-child(1) .cell {
    padding-left: 0;
  }
}

.arrest-report {
  padding-left: 18px;
  /deep/.el-upload-list:after {
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }
  /deep/.el-upload-list__item {
    width: 320px;
    float: left;
    margin-top: 10px !important;
  }
}
</style>

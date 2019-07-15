<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">研判指令反馈</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link tag="span" to='' style="display:inline-block;margin-right:10px;"> -->
              <el-button type="primary" size="small" v-if="isOnlyRead & btnShowFlag" @click="jdgzsb">阶段工作上报</el-button>
              <!-- </router-link> -->
              <!-- <router-link tag="span" to='arrestInstructions' style="display:inline-block;margin-right:10px;"> -->
              <el-button type="primary" size="small" v-if="isOnlyRead & btnShowFlag" @click="pazb">破案抓捕</el-button>
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

        <div class="form-item">
          <div class="form-title">侦办工作反馈</div>
          <!-- <el-table :data="caseFeedbackTableData" class="element-table">
                        <el-table-column prop="duty" label="侦办单位" width="200"></el-table-column>
                        <el-table-column prop="person" label="反馈人员" width="90"></el-table-column>
                        <el-table-column prop="time" label="反馈时间" width="240">
                            <template slot-scope="scope">
                                <el-date-picker
                                v-model="scope.row.time"
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type="datetime"
                                placeholder="选择日期时间">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="阶段性工作侦查情况">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.status" placeholder="请输入内容"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                        <el-table-column prop="accessory" label="附件" width="220">
                            <template slot-scope="scope">
                                <el-upload
                                    action="http://192.168.29.181:8080/upload/batch"
                                    ref="newupload"
                                    multiple
                                    :auto-upload="true"
                                    :before-upload="beforeUpload"
                                    :before-remove="beforeRemove"
                                    :on-success="uploadSuccess"
                                    :on-remove="removeSuccess"
                                    
                                    :limit="10">
                                    <div class="upload-box">
                                        <el-button size="small" @click="sc(scope)">上传</el-button>
                                    </div>
                                </el-upload>
                            </template>
                        </el-table-column>
          </el-table>-->
          <div class="work-feedback">
            <div class="feedback-title">
              <ul class="clearfix">
                <li>侦办单位</li>
                <li>反馈人员</li>
                <li>反馈时间</li>
                <li>阶段性工作侦查情况</li>
                <li>电话</li>
                <li>附件</li>
                <li style="width:4%">操作</li>
              </ul>
            </div>
            <div class="feedback-item" v-for="(item,index) in feedbackData" :key="index">
              <ul class="clearfix">
                <li>
                  <el-input v-model="item.spyDepName" size="small" :disabled="item.isDisable"></el-input>
                </li>
                <li>
                  <el-select
                    v-model="item.spyName"
                    :disabled="item.isDisable"
                    placeholder="选择姓名"
                    size="small"
                    @change="changeSelect(item.spyName,index)"
                  >
                    <el-option
                      v-for="(value,i) in memberNameList"
                      :key="i"
                      :label="value.realName"
                      :value="value.realName"
                    ></el-option>
                  </el-select>
                </li>
                <li>
                  <el-date-picker
                    v-model="item.feedbackTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :disabled="item.isDisable"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </li>
                <li>
                  <el-input
                    v-model="item.workContent"
                    :disabled="item.isDisable"
                    placeholder="请输入内容"
                  ></el-input>
                </li>
                <li>
                  <el-input v-model="item.phone" :disabled="item.isDisable"></el-input>
                </li>
                <li>
                  <div class="file-name" v-show="item.fileNameFlag">
                    {{ item.fileName }}
                    <i class="iconfont iconguanbi2" v-if="item.delFlag"></i>
                  </div>
                  <div class="upload" v-show="!item.fileNameFlag">
                    <input
                      type="file"
                      class="upload-inp"
                      :disabled="item.isDisable"
                      @change="uploadFile(index)"
                    >
                    <div class="upload-btn">上传</div>
                  </div>
                </li>
                <li style="width:4%" v-if="isOnlyRead & btnShowFlag">
                  <img src="../../../static/image/zzzlDel.png" width="16" height="18" alt v-if="item.delFlag" @click="deleteRow(index)">
                </li>
              </ul>
            </div>
          </div>
          <el-button size="small" @click="addFeedback" style="margin: 10px 0 40px 18px;" v-if="isOnlyRead & btnShowFlag">添加反馈</el-button>
        </div>

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="isOnlyRead & btnShowFlag">
          <el-form-item>
            <!-- <router-link tag="span" to='' style="display:inline-block;margin-right:10px;"> -->
            <el-button type="primary" size="small" @click="jdgzsb">阶段工作上报</el-button>
            <!-- </router-link> -->
            <!-- <router-link tag="span" to='ypManagement' style="display:inline-block;"> -->
            <el-button type="primary" size="small" @click="pazb">破案抓捕</el-button>
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
        {
          duty: "石家庄桥西分局",
          person: "刘菊",
          time: "",
          status: "",
          phone: "010-66667777",
          accessory: "",
          attachments: []
        }
      ],
      tableRowIndex: null,
      isUpload: false,
      bkID: "",
      createBy: "",
      realName: "",
      token: "",
      isOnlyRead: false,
      btnShowFlag: false, // 流程控制按钮
      approveList: [], // 审批过程
      memberNameList: [],
      mainSpyDepId: "",
      feedbackData: [
        {
          spyDepName: "主侦",
          spyName: "",
          feedbackTime: "",
          workContent: "",
          phone: "",
          fileName: "",
          attachments: [],
          fileNameFlag: false,
          isDisable: false,
          delFlag: true
        }
      ],
      userList: "", // 主侦下的人员
      chartData: '', // 流程图数据
      taskId: '',
      isData: false
    };
  },
  created() {
    this.taskId = this.$route.query.taskId
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    if (localStorage.getItem("realName")) {
      this.realName = localStorage.getItem("realName");
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

        //  指定侦办
        this.instructForm.mainSpyUnit = res.data.cmdDetails.mainSpyDepName;
        this.mainSpyDepId = res.data.cmdDetails.mainSpyDepId;
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
        // types:'主侦',
        // units:'北京市朝阳区分局',
        // names:'张三',
        // options:'专家组领导',
        // duty:'支队队长',
        // roles:'',
        // phone:'15288889999',
        // operation:'',
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

        // 侦办工作反馈
        console.log('aaaaaaaaaaaaaa', this.feedbackData)
        if (res.data.cmdDetails.insFeedbacks.length > 0) {
          if (this.isOnlyRead || this.btnShowFlag) {
            this.feedbackData.splice(0, 1)            
          }
          res.data.cmdDetails.insFeedbacks.forEach(item => {
            this.feedbackData.unshift({
              spyDepName: "主侦",
              spyName: item.spyName,
              feedbackTime: item.feedbackTime,
              workContent: item.workContent,
              phone: "",
              fileName: item.attachments.length > 0? item.attachments[0].fileName:'',
              attachments: item.attachments,
              fileNameFlag: true,
              isDisable: true,
              delFlag: false
            });
          });
        }

        this.getUsersByDepId();
        // sendObj.insId = "6fbe4188-832c-4871-9d7f-e2a279e7f43e";
        // sendObj.typeName = this.specialCaseTableData[i].types;
        // sendObj.spyDepName = this.specialCaseTableData[i].units;
        // sendObj.memberName = this.specialCaseTableData[i].names;
        // sendObj.memberId = '123456';
        // sendObj.memberPost = this.specialCaseTableData[i].duty;
        // sendObj.memberPhone = this.specialCaseTableData[i].phone;
        // sendObj.createTime = new Date();
      });
  },
  methods: {
    //  添加反馈
    addFeedback() {
      const feedbackData = {
        spyDepName: "主侦",
        spyName: "",
        feedbackTime: "",
        workContent: "",
        phone: "",
        fileName: "",
        attachments: [],
        fileNameFlag: false,
        isDisable: false,
        delFlag: true
      };
      this.feedbackData.push(feedbackData);
    },
    // 删除表格
    deleteRow(index) {
      if (this.feedbackData.length === 1) {
        this.$message({
          message: "请至少填写1个侦办工作反馈",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.feedbackData.splice(index, 1);
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
    // 上传文件
    uploadFile(index) {
      let event = window.event || arguments.callee.caller.arguments[0];
      let fileList = event.currentTarget.files;
      console.log("file", fileList);
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
            item.classify = 8;
            that.feedbackData[index].fileName = item.fileName;
            that.feedbackData[index].fileNameFlag = true;
          });
        }
        that.feedbackData[index].attachments = data.data;
      });
    },
    // 获取组织下的人员
    getUsersByDepId() {
      let that = this;
      let params = {
        departmentId: this.mainSpyDepId,
        token: this.token
      };
      this.$Ajax.get("/orgApi/getUsersByDepId", params).then(data => {
        if (data.length > 0) {
          that.memberNameList = data;
        }
      });
    },
    changeSelect(realName, index) {
      this.memberNameList.forEach(item => {
        if (item.realName === realName) {
          this.feedbackData[index].phone = item.phone;
        }
      });
    },
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
    //  阶段工作上报
    jdgzsb() {
      let that = this;
      const jdgzsbData = {
        insFeedbacks: [],
        createBy: that.createBy,
        createName: that.realName
      };
      this.feedbackData.forEach(item => {
        const sendObj = {};
        sendObj.insId = this.bkID;
        sendObj.spyName = item.spyName;
        sendObj.spyDepName = item.spyDepName;
        sendObj.feedbackTime = item.feedbackTime;
        this.memberNameList.forEach(ele => {
          if (ele.realName === item.spyName) {
            sendObj.spyBy = ele.id;
          }
        });
        sendObj.workContent = item.workContent;
        sendObj.phone = item.phone;
        sendObj.attachments = item.attachments;
        sendObj.createTime = UtilService.formatDuring(
          +new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );

        jdgzsbData.insFeedbacks.push(sendObj);
      });
      // for(var i=0;i<this.caseFeedbackTableData.length;i++){
      //     const myobj = {}
      //     myobj.insId = this.bkID;
      //     myobj.spyName = this.caseFeedbackTableData[i].person;
      //     myobj.spyDepName = this.caseFeedbackTableData[i].duty;
      //     myobj.feedbackTime = null;//this.caseFeedbackTableData[i].time;
      //     myobj.workContent = this.caseFeedbackTableData[i].status;
      //     myobj.createTime = null;
      //     myobj.attachments = this.caseFeedbackTableData[i].attachments;
      //     myobj.spyBy = '侦办人id';

      //     jdgzsbData.insFeedbacks.push(myobj);
      // }
      console.log("参数参数参数参数参数参数", jdgzsbData);

      this.$Ajax
        .post("fightcmd/cmdStageReport", jdgzsbData, true)
        .then(res => {
          console.log(res);
          if (res.data === "success") {
            that.$message({
              message: "阶段工作上报成功！",
              type: "success"
            });
          } else {
            that.$message({
              message: "阶段工作上报失败！",
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //  破案抓捕
    pazb() {
      let that = this;
      const postData = {
        id: this.bkID,
        taskId: this.taskId,
        createBy: this.createBy,
        opinionInfo: {
          userList: this.userList
        }
      };
      this.$Ajax
        .post("fightcmd/cmdFeedback", postData, true)
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
</style>

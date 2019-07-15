<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">研判指令接收</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link tag="span" to='feedbackInstructions' style="display:inline-block;margin-right:10px;"> -->
              <el-button
                type="primary"
                size="small"
                v-if="isOnlyRead & btnShowFlag"
                @click="jstj"
              >接收提交</el-button>
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
        <div class="form-item" style="padding-bottom: 20px;" v-if="specialCaseTableFlag">
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

        <div class="form-item" v-if="isOnlyRead & btnShowFlag">
          <div class="form-title">专案组人员</div>
          <!-- <el-table :data="specialCaseTableData" class="element-table">
                        <el-table-column prop="types" label="侦办单位" width="130" align="center">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.types" placeholder="选择类型" size="small">
                                    <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="units" label="" width="300">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.units" placeholder="请选择侦办单位" size="small" style="width:100%;">
                                    <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="names" label="姓名" align="center">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.names" placeholder="请选择侦办人" size="small">
                                    <el-option v-for="name in names" :key="name.value" :label="name.label" :value="name.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="duty"
                            label="职务">
                            <el-input v-model="duty" size="small"></el-input>
                        </el-table-column>
                        <el-table-column prop="options" label="侦办角色" align="center">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.options" placeholder="请选择侦办人" size="small">
                                    <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="phone"
                            label="电话">
                        </el-table-column>
                        <el-table-column prop="operation" width="60" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="deleteRow(scope.$index, specialCaseTableData)"
                                icon="el-icon-delete" 
                                class="change-delete-style"
                                circle></el-button>
                            </template>
                        </el-table-column>
          </el-table>-->
          <div class="group">
            <div class="group-title">
              <ul class="clearfix">
                <li style="width:33%">侦办单位</li>
                <li style="width:12%">姓名</li>
                <li style="width:15%">职务</li>
                <li style="width:15%">侦办角色</li>
                <li style="width:20%">电话</li>
                <li style="width:5%">操作</li>
              </ul>
            </div>
            <div class="group-item" v-for="(item,index) in groupData" :key="index">
              <ul class="clearfix">
                <li style="width:33%">
                  <el-input v-model="item.typeName" size="small"></el-input>
                  <el-input v-model="item.spyDepName" size="small" class="spyDepName-inp"></el-input>
                </li>
                <li style="width:12%">
                  <el-select
                    v-model="item.memberName"
                    placeholder="选择姓名"
                    size="small"
                    @change="changeSelect(item.memberName,index)"
                  >
                    <el-option
                      v-for="(value,i) in memberNameList"
                      :key="i"
                      :label="value.realName"
                      :value="value.realName"
                    ></el-option>
                  </el-select>
                </li>
                <li style="width:15%">
                  <el-input v-model="item.memberPost" size="small"></el-input>
                </li>
                <li style="width:15%">
                  <el-select v-model="item.role" placeholder="选择侦办角色" size="small">
                    <el-option
                      v-for="(value,i) in roleList"
                      :key="i"
                      :label="value.label"
                      :value="value.value"
                    ></el-option>
                  </el-select>
                </li>
                <li style="width:20%">
                  <el-input v-model="item.memberPhone" size="small"></el-input>
                </li>
                <li style="width:5%" @click="deleteRow(index)">
                  <img src="../../../static/image/zzzlDel.png" width="16" height="18" alt>
                </li>
              </ul>
            </div>
          </div>
          <el-button size="small" @click="addTableRow" style="margin: 10px 0 40px 18px;">添加</el-button>
        </div>

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="isOnlyRead & btnShowFlag">
          <el-form-item>
            <!-- <router-link tag="span" to='ypManagement' style="display:inline-block;margin-right:10px;"> -->
            <el-button type="primary" size="small" @click="jstj">接收提交</el-button>
            <!-- </router-link> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode">
        <flow-chart :chartData="chartData" :processIsShow="isData"></flow-chart>
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
import flowChart from "../../components/flowChart";
//  引入通用'指令'组件
import instructions from "../../components/MILInstructions.vue";

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
      specialCaseTableFlag: false,
      specialCaseTableData: [],
      specialCaseTableData: [
        //  专案组table数据
        {
          types: "主侦",
          names: "",
          duty: "支队队长",
          phone: "15288889999",
          operation: ""
        }
      ],
      types: [
        //  侦办类型
        {
          value: "主侦",
          label: "主侦"
        },
        {
          value: "配侦",
          label: "配侦"
        }
      ],
      units: [
        //  侦办单位
        {
          value: "北京市朝阳区分局",
          label: "北京市朝阳区分局"
        },
        {
          value: "北京市海淀区分局",
          label: "北京市海淀区分局"
        }
      ],
      names: [
        //  侦办人
        {
          value: "张三",
          label: "张三"
        },
        {
          value: "李四",
          label: "李四"
        }
      ],
      options: [
        //  侦办角色
        {
          value: "专家组领导",
          label: "专家组领导"
        },
        {
          value: "联络员",
          label: "联络员"
        },
        {
          value: "侦查员",
          label: "侦查员"
        }
      ],
      bkID: "",
      createBy: "",
      token: "",
      userId: "",
      isOnlyRead: false,
      btnShowFlag: false, // 流程控制按钮
      mainSpyDepId: "", // 主侦部门id
      approveList: [], // 审批过程
      spyDepName: "",
      typeName: "", // 配侦
      groupData: [
        {
          typeName: "主侦",
          spyDepName: "",
          memberName: "",
          memberPost: "",
          role: "",
          memberPhone: ""
        }
      ],
      spyDepNameList: [{ label: "工作主流测试" }],
      memberNameList: [],
      userList: "", // 主侦单位下的人员
      roleList: [
        {
          value: "专家组领导",
          label: "专家组领导"
        },
        {
          value: "联络员",
          label: "联络员"
        },
        {
          value: "侦查员",
          label: "侦查员"
        }
      ],
      taskId: "",
      isData: false,
      chartData: "" // 流程图数据
    };
  },
  created() {
    this.taskId = this.$route.query.taskId;
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    if (localStorage.getItem("userId")) {
      this.userId = localStorage.getItem("userId");
    }
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    if (localStorage.getItem("realName")) {
      this.instructForm.approveAuditor = localStorage.getItem("realName");
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
    if (this.$route.query.deptType === "peizhen") {
      this.groupData[0].typeName = "配侦";
      this.typeName = "配侦";
    } else {
      this.typeName = "主侦";
    }
    this.getCurDep();
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
        console.log(res.data);
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
        if (res.data.cmdDetails.insTaskForces.length > 0) {
          this.specialCaseTableFlag = true;
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

        // //  审批部分
        // this.instructForm.approveAuditor = res.data.activitiInfoList.data[2].assignee;
        // this.instructForm.approveResult = res.data.activitiInfoList.data[2].hParam.result ;
        // this.instructForm.approveInstructions = res.data.activitiInfoList.data[2].hParam.reason;
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
        if (this.$route.query.deptType !== "peizhen") {
          this.spyDepName = res.data.cmdDetails.createDepName;
          this.groupData[0].spyDepName = this.spyDepName;
        }
        this.getUsersByDepId();
      });
  },
  methods: {
    getCurDep() {
      let that = this;
      let params = {
        token: this.token
      };
      let url = "/userApi/" + this.userId;
      this.$Ajax.get(url, params).then(data => {
        that.spyDepName = data.depName;
        that.groupData[0].spyDepName = that.spyDepName;
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
          console.log("人员", data);
        }
      });
    },
    // 改变名字
    changeSelect(realName, index) {
      this.memberNameList.forEach(item => {
        if (item.realName === realName) {
          this.groupData[index].memberPost = item.positionName;
          this.groupData[index].memberPhone = item.phone;
          // this.groupData[index].memberPost = '职务'
          // this.groupData[index].memberPhone = '99999999999'
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
    resultRadio(e) {
      console.log(e);
      e == "退回" ? (this.isBack = true) : (this.isBack = false);
    },

    //  表格删除行
    deleteRow(index) {
      if (this.groupData.length === 1) {
        this.$message({
          message: "请至少填写1个侦办人员名单",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.groupData.splice(index, 1);
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
    //  表格添加行
    addTableRow() {
      let rowData = {
        typeName: this.typeName,
        spyDepName: "",
        memberName: "",
        memberPost: "",
        role: "",
        memberPhone: ""
      };
      rowData.spyDepName = this.spyDepName;
      this.groupData.push(rowData);
    },

    jstj() {
      let that = this;
      // 获取数据
      const sendData = [];
      this.groupData.forEach(item => {
        const sendObj = {};
        sendObj.insId = this.bkID;
        sendObj.typeName = item.typeName;
        sendObj.spyDepName = item.spyDepName;
        sendObj.memberName = item.memberName;
        this.memberNameList.forEach(ele => {
          if (ele.realName === item.memberName) {
            sendObj.memberId = ele.id;
          }
        });
        sendObj.memberPost = item.memberPost;
        sendObj.role = item.role;
        sendObj.memberPhone = item.memberPhone;
        sendObj.createTime = new Date();

        sendData.push(sendObj);
      });
      const postData = {
        id: this.bkID,
        taskId: this.taskId,
        createBy: this.createBy,
        insTaskForces: sendData,
        opinionInfo: {
          userList: that.userList
        }
      };
      if (this.$route.query.deptType === "peizhen") {
        postData.opinionInfo.userList = "";
      }
      console.log("canshu", postData);
      this.$Ajax
        .post("fightcmd/cmdAccept", postData, true)
        .then(res => {
          console.log(res);
          if (res.data === "success") {
            that.$message({
              message: "接收成功！",
              type: "success"
            });
            that.$router.push({
              name: "fightManage"
            });
          } else {
            that.$message({
              message: "接收失败！",
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
  background: #f7faff;
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
  /deep/td:nth-child(1) .cell {
    padding-left: 0;
  }
  /deep/td {
    padding-left: 16px;
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
}
</style>

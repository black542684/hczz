<template>
  <div class="xsxc-content">
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode">
        <flow-chart :chartData="chartData" :processIsShow="isData"></flow-chart>
      </div>
    </div>
    <!-- 头部 -->
    <el-row :gutter="20" class="el-row-style">
      <el-col :span="6" class="el-col-style">
        <div class="grid-content">
          <span class="xsxc-title">{{changeTitle}}</span>
          <a class="xsxc-back" href="javascript:;" @click="$router.go(-1)">返回</a>
        </div>
      </el-col>
      <el-col :span="8" :offset="10">
        <div class="grid-content">
          <el-row class="el-row-right">
            <el-button
              type="primary"
              size="small"
              @click="processIsShow = !processIsShow"
              v-if="this.$route.query.isSQ !== 1 && this.$route.query.statusStr !== '草稿'"
            >查看流程</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 只显示退回内容 -->
    <shInfo :approveList="approveListTH" />
    <!-- 基本信息 -->
    <jbxx-component :jbxx="hczzData" :edit="sectionShowEdit('hczz_fqsq')" ref="jbxx"></jbxx-component>
    <!-- 案源信息 -->
    <xcxx-component
      ref="xcxx"
      :yySuccess1="!sectionShowEdit('hczz_fqsq')"
      :yySuccess2="!sectionShowEdit('hczz_fqsq')"
      :edit="!sectionShowEdit('hczz_fqsq')"
      :hczzData="hczzData"
    ></xcxx-component>
    <!-- 合成信息 -->
    <hc-info
      ref="hcxx"
      v-if="sectionShowEdit('hczz_fqsq')"
      :coprDepts="hczzData.coprDepts"
      :getSection="getCheckedSection"
      :editHczzData="editHczzData"
    ></hc-info>
    <hcxx-show v-if="!sectionShowEdit('hczz_fqsq')" :coprDepts="hczzData.coprDepts"></hcxx-show>

    <!-- （审核信息） -->
    <shenhe-component :audit="startCheck" v-if="sectionShowSH()" :shData="auditData"></shenhe-component>
    <!-- 反馈 -->
    <fankui-component :myMethods="startFeedback" :fkData="feedbackData" v-if="sectionShowFK()"></fankui-component>
    <fankui-show :showFeedback='showFeedbackData' :coprDepts="hczzData.coprDepts" v-if="!sectionShowFK()"></fankui-show>
    
    <!-- 接收 -->
    <jieshou-component :myMethods="reception" v-if="sectionShowJS()"></jieshou-component>
    <!-- 提交 -->
    <tijiao-component ref="tijiao" v-if="sectionShowEdit('hczz_fqsq')" :hczzData="hczzData"></tijiao-component>

    <!-- 申请按钮（申请，退回，草稿） -->
    <div class="xsxc-btn-box" v-if="sectionShowEdit('hczz_fqsq')">
      <el-button type="primary" size="mini" @click="saveDrafts(0)">保存草稿</el-button>
      <el-button type="primary" size="mini" @click="submitForApproval()">提交审批</el-button>
    </div>

    <!-- 确认按钮 -->
    <div class="xsxc-btn-box" v-if="sectionShowQR()">
      <el-button type="primary" size="mini" @click="submitFroAffirm">确认</el-button>
    </div>
    <!-- 签收结果 -->
    <qs-info :qsjgList="qsjgList"></qs-info>
  </div>
</template>
<script>
import flowChart from "../../components/flowChart"; // 引入流程图
import hczzURL from "../../util/url/hczzURL.js"; // URL接口
import qsInfo from "../../components/hczz/qsInfo.vue"; // 签收结果
import hczzData from "../../util/hczz/hczzData.js"; // 合成作战数据
import hczzMethods from "../../util/hczz/hczzMixinMethods.js"; // 合成作战中公用的方法

import jbxxComponent from "../../components/hczz/jbxx.vue"; // 基本信息
import xcxxComponent from "../../components/hczz/xcxx.vue"; // 协查信息

import hcxxShow from "../../components/hczz/hcxxShow.vue"; // 显示合成信息
import hcInfo from "../../components/hczz/hcInfo.vue"; // 合成信息

import shenheComponent from "../../components/hczz/shenhe.vue"; //提交信息（审核）

import fankuiComponent from "../../components/hczz/fankui.vue"; // 反馈
import fankuiShow from '../../components/hczz/fankuiShow.vue'; // 显示反馈

import jieshouComponent from "../../components/hczz/jieshou.vue"; // 接收
import tijiaoComponent from "../../components/hczz/tijiao.vue"; // 提交

import shInfo from '../../components/hczz/shInfo.vue'; // 只显示退回内容
// 工具函数，使用promis校验多个表单
import { getFormPromise } from "../../util/publicTools.js";
import moment from "moment";
import hczzUploadName from '../../util/hczz/hczzUploadName';
export default {
  name: "hczzParticulars",
  components: {
    flowChart,
    qsInfo,
    jbxxComponent,
    xcxxComponent,
    hcInfo,
    hcxxShow,
    shenheComponent,
    fankuiComponent,
    fankuiShow,
    jieshouComponent,
    tijiaoComponent,
    shInfo
  },
  mixins: [hczzData, hczzMethods],
  data() {
    return {
      // 退回内容
      approveListTH: [],
      // 获取部门数据
      getSection: {},
      // 用户所有的权限
      // allPermission: [],
      // 历史走过的流程(可看不可编辑)
      historyFromProps: [],
      // 当前的流程（可看可编辑）
      currentProps: [],
      // 流程弹窗，显示or隐藏
      processIsShow: false,
      // 当前页面标题
      changeTitle: this.$route.query.statusStr,
      // 控制流程图只显示一次
      isData: false,
      // 流程图需要的数据
      chartData: {},
      // 申请按钮显示
      showApplyButton: false,
      // 确认按钮显示（最后一个步骤的按钮）
      showAffirmButton: false,
      // 签收结果需要的数据
      // TODO:假数据
      /* qsjgList: [
        { depName: "签收单位", createName: "签收人", date: "签收时间" }
      ], */
      // 签收结果的数据
      qsjgArr: [],
      // 签收结果
      qsjgList: [],
      // 选中的六个部门
      checkedSection: []
    };
  },
  async created() {
    // 获取部门
    this.getCurDep();
    // 判断非申请，草稿页才能获取流程图
    if (!this.$route.query.isSQ && this.$route.query.statusStr !== "草稿") {
      // 获取流程图
      this.initChart();
    } else {
      // 申请按钮
      this.showApplyButton = true;
      // 控制是否可编辑
      this.controllerData["hczz_fqsq"].edit = true;
    }
    if (!this.$route.query.isSQ) {
      // 获取详情
      this.getInformationData();
    }
    // 草稿可编辑
    if(this.$route.query.statusStr == '草稿') {
      this.controllerData['hczz_fqsq'].edit = true;
    }
    // 测试
    //this.sectionShowSH();
  },
  methods: {
    // 获取选中的合战部门
    getCheckedSection(arr) {
      // 通过子组件传入，选中的合战部门数组
      this.checkedSection = arr;
      console.log(this.checkedSection);
    },
    // 保存草稿
    saveDrafts(status) {
      // 提交表单
      this.submitForm(status);
    },
    // 进行表单验证
    submitForApproval() {
      let jbxx = this.$refs.jbxx.$refs.jbxxForm;
      let xcxx = this.$refs.xcxx.$refs.xcxxForm;
      let hcxx = this.$refs.hcxx.$refs.hcxxForm;
      let tijiao = this.$refs.tijiao.$refs.tijiaoForm;
      Promise.all([jbxx, xcxx, hcxx, tijiao].map(getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          console.log("表单验证成功");
          // TODO:
          // 提交表单
          this.submitForm(1);
          // this.submitCG(num);
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    },
    // 提交表单,提交审批
    async submitForm(status) {
      // 选中的合战部门数组
      let department = ["技侦", "网安", "刑侦", "经侦", "反恐", "治安"];
      let arr = this.checkedSection; // 用来过滤选中的
      let params = { ...this.hczzData };
      console.log('选中的数组', arr);
      params.coprDepts = params.coprDepts.filter((item, index) => {
        item.deptTypeName = department[index];
        return arr.includes(item.deptType);
      });
      params.techEvide = this.hczzData.techEvide.join(",");
      params.status = status; // 提交 1 or 草稿 0
      // params.deptType = params.deptType.join('');
      console.log('判断保存草稿1', params)
      // TODO:
      // 提示信息
      let msg = "提交成功";
      let failMsg = "提交失败";
      if (status === 0) {
        msg = "保存草稿成功";
        failMsg = "保存草稿失败";
      }
      let res = await this.$Ajax
        .post(hczzURL.apply, params, true)
        .catch(err => console.log(err));
      let lcData = {
        createBy: this.hczzData.createBy,
        id: res.data,
        modeType: "4",
        taskKey: null,
        taskId: null,
        opinionInfo: {
          userList: "shenpi,shenhe"
        },
        // feedbackObj: JSON.stringify(params)
      };
      console.log("提交第一个接口", res);


      if (status==0) {
        if (res.status === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$router.push('/hczzManage');
        }
        return console.log('判断保存草稿2', params);
      };




      let data = await this.$Ajax
        .post("flow/submitFlow", lcData, true)
        .catch(err => console.log(err));
        console.log('提交表单结果',data);
      if (data.data === "success") {
        this.$message({
          message: msg,
          type: "success"
        });
        this.$router.push({
          name: "hczzManage"
        });
      } else {
        this.$message({
          message: failMsg,
          type: "warning"
        });
      }
    },
    //  加载流程图数据
    initChart() {
      // 调用流程图需要的数据
      let params = {
        id: this.$route.query.id,
        token: localStorage.getItem("token")
      };
      this.$Ajax
        .get(hczzURL.getFlow, params)
        .then(res => {
          this.chartData = res.data.results; // 流程图需要的数据
          this.isData = true; // 控制流程图只显示一次
        })
        .catch(err => {
          console.warn("流程图错误", err);
        });
      console.log("流程图数据", params);
    },
    // 判断是否可编辑
    sectionShowEdit(val) {
      return this.controllerData[val].edit;
    },
    // 判断审核是否可见
    sectionShowSH() {
      let flag = (        
      this.controllerData['hczz_jizsh'].edit || 
        this.controllerData['hczz_jingzsh'].edit ||
        this.controllerData['hczz_xzsh'].edit ||
        this.controllerData['hczz_zash'].edit ||
        this.controllerData['hczz_wash'].edit ||
        this.controllerData['hczz_fkgbsh'].edit ||
        this.controllerData["hczz_fqbmsp"].edit);
      return flag;
    },
    // 判断反馈是否可见
    sectionShowFK() {
      let flag = (
        this.controllerData["hczz_jingzfk"].edit ||
        this.controllerData["hczz_xzfk"].edit ||
        this.controllerData["hczz_zafk"].edit ||
        this.controllerData["hczz_wafk"].edit ||
        this.controllerData["hczz_jizfk"].edit ||
        this.controllerData["hczz_fkgbfk"].edit);
      //console.log('判断审核是否可见-------------------', flag);
      return flag;
    },
    // 判断接收是否可见
    sectionShowJS() {
      let flag =
        this.controllerData["hczz_xzjs"].edit ||
        this.controllerData["hczz_zajs"].edit ||
        this.controllerData["hczz_jingzjs"].edit ||
        this.controllerData["hczz_fkgbjs"].edit ||
        this.controllerData["hczz_jizjs"].edit ||
        this.controllerData["hczz_wajs"].edit;
      return flag;
    },
    // 判断确认是否可见
    sectionShowQR() {
      let flag =
        this.controllerData["hczz_waqr"].edit ||
        this.controllerData["hczz_jizqr"].edit ||
        this.controllerData["hczz_zaqr"].edit ||
        this.controllerData["hczz_jingzqr"].edit ||
        this.controllerData["hczz_fkgbqr"].edit ||
        this.controllerData["hczz_xzqr"].edit;
      return flag;
    },
    // 发起部门审核
    startCheck(num) {
      let params = {
        createBy: this.createBy,
        id: this.id,
        taskKey: this.taskKey,
        taskId: this.taskId,
        modeType: "4",
        opinionInfo: {}
      };
      this.auditData.back = num;  // 根据是否通过取值，通过1，退回0
      let checked = this.hczzData.coprDepts;
      let shenheArr = [
        "jizhen",
        "wangzhen",
        "shipin",
        "jingzhen",
        "fankong",
        "zhian"
      ];
      // 把选中的部门设置为1
      this.hczzData.coprDepts.forEach(item => {
        this.auditData[shenheArr[item.deptType]] = 1;
      });
      params.opinionInfo = { ...this.auditData };
      params.opinionInfo.createBy = this.hczzData.createBy;
      console.warn("审核1", this.hczzData);
      console.warn("审核2", params);
      // return ;
      let successMsg = "部门审核成功";
      let failMsg = "部门审核失败";
      if (this.auditData.result !== "通过") {
        successMsg = "退回成功";
        failMsg = "退回失败";
      }
      this.$Ajax.post(hczzURL.publicApply, params, true).then(data => {
        console.log('审核数据', data);
        if (data.data === "success") {
          this.$message({
            message: successMsg,
            type: "success"
          });
          this.$router.push({
            name: "hczzManage"
          });
        } else {
          this.$message({
            message: failMsg,
            type: "warning"
          });
        }
      });
    },
    // 提交反馈
    async startFeedback() {
      let params = {
        createBy: this.createBy,
        createName: localStorage.getItem('realName'),
        coprDepts: []
      };
      // TODO:
      /* hczzData.coprDepts.filter(item => {
        if (item.deptType === 0 ) {
          this.feedbackData.id = item.id; 
        }
      }); */
      params.coprDepts.push(this.feedbackData);
      // 过滤
      let isID = this.hczzData.coprDepts.filter(item => {
        return this.$route.query.statusStr.includes(item.deptTypeName);
      });
      console.log('获取的ID',isID);
      params.coprDepts[0].id = isID[0].id;

      // 反馈的内容
      // params.coprDepts[0].feedbackContent = this.feedbackData.feedbackContent; 
      // return ;
      console.log('反馈数组', params);
      let data = await this.$Ajax.post(hczzURL.startFeedback, params, true);
      console.log('提交反馈1', data)
      if (data.data === "success") {
        this.$message({
          message: "部门反馈成功",
          type: "success"
        });
        this.$router.push({
          name: "hczzManage"
        });
      } else {
        this.$message({
          message: "部门反馈失败",
          type: "warning"
        });
      }
      let lcData = {
        createBy: localStorage.getItem("userName"),
        id: this.id,
        modeType: "4",   // 4合战
        taskKey: this.taskKey,
        taskId: this.taskId,
        opinionInfo: this.auditData
      }
      lcData.opinionInfo.feedbackObj = JSON.stringify(params);
      lcData.opinionInfo.createBy = this.hczzData.createBy;
      this.$Ajax.post(hczzURL.publicApply,lcData , true).then(res => {
        console.log('提交反馈2', res)
      })

    },
    // 接收
    async reception() {
      console.log('接收的数据1', this.hczzData);
      let params = this.hczzData.coprDepts;
      params = params.filter(item => {
        return this.$route.query.statusStr.includes(item.deptTypeName);
      });
      console.log('接收的数据2', this.$route.query.statusStr, params);
      // return;
      params[0].receiveDeptId = this.getSection.depId;
      params[0].receiveDeptName = this.getSection.depName;
      params[0].receivePeopleId = localStorage.getItem('userId');
      params[0].receivePeopleName = localStorage.getItem('userName');
      params[0].receiveTime = moment().format('YYYY-MM-DD HH:mm:ss');
      let data = await this.$Ajax.post(hczzURL.receptionURL, {
        coprDepts: params
      }, true);
      console.log('接收结果', data);
      if (data.data === "success") {
        this.$message({
          message: "接收成功",
          type: "success"
        });
        this.$router.push({
          name: "hczzManage"
        });
      } else {
        this.$message({
          message: "接收失败",
          type: "warning"
        });
      }
      let twoParams = {
        createBy: localStorage.getItem("userName"),
        modeType: "4",   // 4合战
        taskKey: this.taskKey,
        taskId: this.taskId,
        opinionInfo: {
          createName: localStorage.getItem("userName"),
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          depName: this.getSection.depName
        }
      };
      twoParams.id = this.id;
      console.log('接收', twoParams)
      this.$Ajax.post(hczzURL.publicApply, twoParams, true).then(res => {
        
      })
    },
    // 确认按钮
    async submitFroAffirm() {
      let { data } =  await this.$Ajax.get('flow/waitTaskList', {procId: this.procId}, true);;
      let arr = [];
      for (let i = 0; i <  data.length; i++) {
        arr.push(
          this.$Ajax.post(hczzURL.publicApply, {
            createBy: localStorage.getItem("userName"),
            id: this.id ,
            modeType: "4",   // 4合战
            taskKey: data[i].statusId, // 就是statusID
            taskId: data[i].taskId,
            opinionInfo: this.auditData
          }, true));
          console.log('循环的参数', data[i]);
      }
      let results = [];
      for(let i = 0; i< arr.length; i++) {
        let data = await arr[i];
        results.push(data);
      }
     
      let flag = results.every(item => {
        return item.status === 200;
      });
      if (flag) {
        this.$message({
          message: '确认成功',
          type: 'success'
        });
        // this.getInformationData();
        this.$router.push('/hczzManage');
      } else {
        this.$message({
          message: '确认失败',
          type: 'error'
        });
      }
      // this.circulation();
      console.log('提交确认接口' ,results);
      /* return ;
      this.$Ajax.post(hczzURL.publicApply, {
        createBy: localStorage.getItem("userName"),
        id: this.id ,
        modeType: "4",   // 4合战
        taskKey: this.taskKey, // 就是statusID
        taskId: this.taskId,
        opinionInfo: this.auditData
      }, true).then(res => {
        console.log('确认按钮', res);
        // 获取详情
        // this.getInformationData();
        this.$router.push('/hczzManage');
      }) */
    },
    // 循环确认按钮
    async circulation() {
      let data = await this.$Ajax.get('flow/waitTaskList', {procId: this.procId}, true);
      console.log(data);
      // if (data.data.length > 0) return this.circulation();
      return data;
    },
    // 修改父组件的hczzData
    editHczzData(val) {
      this.hczzData.coprDepts = [...val];
      console.log('上传完成后父组件的zhi', this.hczzData.coprDepts);
    }
  },
  computed: {
    // 判断是否申请页面
    applyShow() {
      return this.$route.query.isSQ === 1;
    }
  }
};
</script>
<style lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
.el-radio{
height: 40px;
line-height: 40px;
}
.el-radio__label{
padding: 0 10px;
}
.el-radio.is-checked{
border-bottom: 2px solid #409EFF;
}
</style>
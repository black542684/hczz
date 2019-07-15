<!--线索协查管理流程页面 -->
<template>
  <div class="xsxc-content">
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode">
        <flow-chart :chartData="chartData" :processIsShow="isData"></flow-chart>
      </div>
    </div>
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
              @click="checkProcess"
              v-if="this.$route.query.isSQ != 1 && this.$route.query.statusStr !== '草稿'"
            >查看流程</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 历史审核流转信息（只显示退回内容） - 组件 -->
    <shInfo :approveList="approveListTH" />

    <!-- 申请 基本信息 组件 -->
    <!-- 1.能否编辑; 2.表单数据; 3.title名称列表; 4.设置DOM名称用于表单验证; -->
    <sqComp :sqIsRead="sqIsRead" :ayData="ayData" :titleList01="titleList01" ref="sqCom" />

    <!-- 申请 线索协查信息 组件 -->
    <!-- 1.能否编辑; 2.表单数据; 3.上传文件; 4.文件上传方法; 5.文件删除方法; 6.title名称列表; 7.设置DOM名称用于表单验证; -->
    <sqComp2
      :sqIsRead="sqIsRead"
      :ayData="ayData"
      :originFileList="originFileList"
      :uploadFiles="uploadFiles"
      :deleleFile="deleleFile"
      :titleList02="titleList02"
      :yySuccess1="yySuccess1"
      :yySuccess2="yySuccess2"
      ref="sqCom2"
    />

    <el-form :inline="true" :model="ayData" :rules="ayRules" v-if="!sqIsRead" ref="sqComLocal">
      <div class="xsxc-form-item" :class="{'xsxc-xcxx-only-read':sqIsRead}">
        <div class="xsxc-form-title">提交审核</div>
        <el-form-item label="协查级别：" prop="level" v-if="!sqIsRead">
          <el-radio-group v-model="ayData.level">
            <el-radio label="区县" @change="chooseLevel"></el-radio>
            <el-radio label="市局" @change="chooseLevel"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="查询单位：" prop="cxdw" v-if="!sqIsRead">
          <el-select v-model="ayData.cxdw" placeholder="请选择查询单位" v-if="!cxdwStatus" size="small">
            <el-option
              :key="item.id"
              v-for="(item) in quxianList"
              :label="item.NAME"
              :value="item.NAME"
            ></el-option>
          </el-select>
          <div style="width:150px;" v-if="cxdwStatus">{{ayData.cxdw}}</div>
        </el-form-item>
        <el-form-item label="提请需求：" prop="tqxq" class="xsxc-width100">
          <el-input type="textarea" v-model="ayData.tqxq" autosize :readonly="sqIsRead"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <!-- 历史审核流转信息 - 组件 -->
    <!-- <shInfo :approveList='approveList'/> -->
    <shInfoxsxc :approveList="approveList" />

    <!-- 区县反馈信息 - 组件 -->
    <qxfkInfoxsxc :fkInfoList="fkInfoList" :fkFJInfoList="fkFJInfoList" />

    <!-- 市局反馈信息 - 组件 -->
    <sjfkInfoxsxc :sjfkInfoList="sjfkInfoList" :sjfkFJInfoList="sjfkFJInfoList" />

    <!-- 当前审核人及审核意见 -->
    <!-- <shyjInfo :shData='shData' :newTaskId='newTaskId' v-if='sjypyspBtn'/> -->
    <qxspInfo :shData="shData" :newTaskId="newTaskId" v-if="sjypyspBtn" />

    <!-- 申请按钮 -->
    <div class="xsxc-btn-box" v-if="sqBtn">
      <el-button type="primary" size="mini" @click="submitCG(procInstId?null:0)">保存草稿</el-button>
      <el-button type="primary" size="mini" @click="submitFormSP('ayForm', 1)">提交审批</el-button>
    </div>

    <!-- 确认按钮 -->
    <div class="xsxc-btn-box" v-if="qrBtn">
      <el-button type="primary" size="mini" @click="qrSubmit">确认</el-button>
    </div>

    <!-- 签收结果 -->
    <qsInfo :qsjgList="qsjgList" />
  </div>
</template>

<script>
import flowChart from "../../components/flowChart"; // 引入流程图
import sqComp from "../../components/caseSource/sqComp"; // 引入申请的表单
import sqComp2 from "../../components/caseSource/sqComp2"; // 引入申请2的表单
import shInfo from "../../components/caseSource/shInfo"; //  引入审核流转历史信息组件
import shyjInfo from "../../components/caseSource/shyjInfo"; //  引入审核意见组件
import qsInfo from "../../components/caseSource/qsInfo"; //  签收结果信息组件

import qxspInfo from "../../components/clueAssist/qxspInfo"; //  引入区县审批组件
import shInfoxsxc from "../../components/clueAssist/shInfoxsxc"; //  引入审核流转历史信息组件
import qxfkInfoxsxc from "../../components/clueAssist/fkInfoxsxc"; //  引入反馈信息组件
import sjfkInfoxsxc from "../../components/clueAssist/fkInfoxsxcSJ"; //  引入反馈信息组件

import moment from "moment"; // 时间格式化
import { uniq } from '../../util/publicTools.js';  // 工具函数导入
export default {
  components: {
    flowChart, //流程图
    sqComp, //申请表单
    sqComp2, //申请表单2
    shInfo, //审核信息
    shyjInfo, //审核意见
    qsInfo, //签收结果
    qxspInfo, //区县审批
    shInfoxsxc,
    qxfkInfoxsxc,
    sjfkInfoxsxc
  },
  data() {
    return {
      changeTitle: "线索协查申请", //..title
      processIsShow: false, //  流程弹框显示与否
      chartData: "", // 流程图数据
      isData: false, //  控制流程图只渲染一次
      //    申请提交需要上传的数据（从管理页面拿到的数据）
      bkID: "",
      createBy: "",
      token: "",
      userId: "",
      taskId: "",
      procInstId: "",
      statusId: "",
      depId: "",
      roleId: "",

      newTaskId: "",

      yySuccess1: false,
      yySuccess2: false,

      approveList: [], //  保存流转历史数据
      approveListTH: [],
      qsjgList: [], //  签收结果数据

      sqIsRead: false, //  申请模块是否只读

      /** 按钮方面数据 */
      sqBtn: true,

      shxxEditIsShow: false, //  审核编辑框显示与否
      sjypyspBtn: false, //  审核按钮显示与否
      qrBtn: false, //  确认btn是否显示

      //  线索协查审核数据
      shData: {
        shr: "",
        shjg: "通过",
        shyj: "",

        shyjLabel: "审核意见：", //..切换通过/退回状态使用
        sqr: "", //..保存单据申请人，审核步骤下，提交审核结果需要用到

        url: "clue/invReview",
        userLi: "",
        isCity: 0,
        statusId02: "",
        jumpPath: "clueAssistManage", //..跳转路径
        backIsShow: false,
        btnSecShow: false,
        sjjsBtn: false,
        sjjgfkBtn: false,
        showUpload: false,
        uploadNumber: 0,
        statusIdNew: "",
        xzqxjsBtn: true,
        sjjsBtn02: true,
        unitType: null,
        xzqxJSFKtask: false,
        sjbmIsCity: 0,
        setFkHide: true,
        taskKey:'',
        taskIdNew:''
      },
      originFileList: [], //  申请上传附件列表

      // TODO:
      //    线索协查数据
      ayData: {
        //  基本信息
        aymc: "",
        aybh: new Date().getTime(),
        xfsj: "",
        sqdw: "",
        sqr: "",

        //  中间固定信息
        ajbh: "",
        ajmc: "",
        zasd: "",
        ajsl: "",
        ypry: "",
        ajlb: "",
        jyaq: "",
        cbyj: [],
        xstz: "",
        attachments: [],
        originFile: "", // 判定附件是否上传的数据

        //  提交审核
        level: "区县",
        cxdw: "",
        tqxq: "",

        fileList: [], //保存回显的数据列表
        userList: "" //  用户列表（下级审批人）
      },
      //  title名称动态数据 - 基本信息
      titleList01: {
        formName: "基本信息",

        name: "协查名称：",
        number: "协查编号：",
        time: "下发时间：",
        unit: "申请单位：",
        person: "申请人："
      },
      //  title名称动态数据 - 线索协查信息
      titleList02: {
        formName: "协查信息",

        number: "案件编号：",
        name: "案件名称："
      },

      ayRules: {
        tqxq: [
          { required: true, message: "请输入提请需求", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        //  协查级别
        level: [
          { required: true, message: "请选择协查级别", trigger: "change" }
        ],
        //  查询单位
        cxdw: [{ required: true, message: "请选择查询单位", trigger: "change" }]
      },

      //  线索协查数据
      cxdwStatus: false,
      //  查询单位市局
      shiju: "",
      shijuID: "",
      quxianList: [],
      queryUnitBy: "",
      statusId02: "",

      fkInfoList: [],
      fkFJInfoList: [],

      sjfkInfoList: [],
      sjfkFJInfoList: []
    };
  },

  created() {
    this.bkID = this.$route.query.id;
    // this.taskId = this.$route.query.taskId;
    this.procInstId = this.$route.query.procInstId;
    this.statusId = this.$route.query.statusId;

    this.createBy = localStorage.getItem("userName");

    this.token = localStorage.getItem("token");

    this.userId = localStorage.getItem("userId");

    //..申请人
    this.ayData.sqr = localStorage.getItem("realName");

    this.getUserList(); //  获取userList和申请单位、查询单位

    //  如果在管理页点击的不是申请按钮，才会调用详情数据
    if (this.$route.query.isSQ != 1) {
      //  调用详情数据
      this.getDetails();
    }
  },
  mounted() {
    //    获取当前时间，赋值给申请时间
    this.ayData.xfsj = moment().format("YYYY-MM-DD HH:mm:ss");

    //  如果在管理页点击的不是申请按钮，且不是草稿页面，才会调用流程图数据
    if (this.$route.query.isSQ != 1 && this.$route.query.statusStr !== "草稿") {
      //  加载流程图数据
      this.initChart();
    }
  },
  watch: {
    // 判断附件数量是否为0
    originFileList(nv) {
      nv.length === 0
        ? (this.ayData.originFile = "")
        : (this.ayData.originFile = "线索协查信息附件已上传");
    }
  },
  methods: {
    //  协查级别
    chooseLevel(label) {
      if (label === "区县") {
        this.cxdwStatus = false;
        this.ayData.cxdw = "";
      } else {
        this.cxdwStatus = true;
        this.ayData.cxdw = this.shiju;
        this.getUserList02();
      }
    },
    //  封装了一个getFormPromise去生成Promise对象，并使用Promise.all去并行调用返回最终的校验结果数组
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        });
      });
    },
    //  申请页面 - 提交审批
    submitFormSP(formName, num) {
      //  获取子组件的ref DOM名称
      const ayFormName = this.$refs.sqCom.$refs.ayForm;
      const ayFormName2 = this.$refs.sqCom2.$refs.ayForm;
      const ayFormNameLocal = this.$refs.sqComLocal;

      Promise.all(
        [ayFormName, ayFormName2, ayFormNameLocal].map(this.getFormPromise)
      ).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          console.log("申请提交成功");
          this.submitCG(num);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //  申请页面 - 保存草稿
    async submitCG(num) {
      // TODO:
      const applyData = {
        id: this.bkID,
        createBy: this.createBy,

        code: this.ayData.aybh,
        name: this.ayData.aymc,
        createName: this.ayData.sqr,
        createDepId: null, //申请单位id
        createDepName: this.ayData.sqdw,
        createTime: this.ayData.xfsj,
        caseSourceCode: this.ayData.ajbh,
        isSeriesed: 0, //是否系列案
        caseSourceName: this.ayData.ajmc,
        caseTypeCode: null, //  案件类型编码
        caseTypeName: this.ayData.ajlb,
        caseAmount: this.ayData.ajsl,
        judgmentBy: null, //  研判人员id
        judgmentName: this.ayData.ypry,
        caseInfo: this.ayData.jyaq,
        techEvide: this.ayData.cbyj.join(","),
        meansOfCrime: this.ayData.zasd,
        clueFeature: this.ayData.xstz,
        reviewBy: null, //  上级审核人id
        reviewName: null, //  上级审核人姓名
        applyDesc: this.ayData.tqxq,
        status: num, // 线索协查状态   null保存  1提交
        excute: null,
        opinionInfo: {
          userList: this.ayData.userList,
          createBy: this.createBy
        },
        attachments: this.ayData.attachments,
        taskId: this.newTaskId,

        unitType: 0,
        queryUnitBy: null, //查询单位id
        queryUnitName: null //查询单位名称
      };
      //  区县为0，市级为1。
      applyData.unitType = this.ayData.level === "区县" ? 0 : 1;
      //  获取查询单位名称和id
      if (this.cxdwStatus) {
        applyData.queryUnitBy = this.shijuID;
        applyData.queryUnitName = this.shiju;
      } else {
        applyData.queryUnitName = this.ayData.cxdw;
        this.quxianList.forEach(da => {
          if (da.NAME === this.ayData.cxdw) {
            applyData.queryUnitBy = da.id;
          }
        });
      }

      applyData.taskId = this.taskId || applyData.taskId;

      let successMsg = "提交成功！";
      let failMsg = "提交失败！";
      if (num === 0) {
        successMsg = "保存草稿成功！";
        failMsg = "保存草稿失败！";
      }
      /* let submit = await this.$Ajax.post("clue/invApply", applyData, true);

      if (submit.data !== "success") return this.$message({ message: failMsg, type: "warning" });
		
			this.$message({
				message: successMsg,
				type: "success"
			});
      this.$router.push({
        name: "clueAssistManage"
      }); */
      console.warn(applyData);
			this.$Ajax.post('clue/invApply', applyData, true).then(res => {
				const lcData = {
					createBy:this.createBy,
					id: res.data !== 'fail' ? res.data : null,
					modeType:'2',
					taskKey:null,
					taskId:null,
					opinionInfo:{
            userList: this.ayData.userList,
            createBy:this.createBy
					}
				}
				this.$Ajax.post('flow/submitFlow', lcData, true).then(res=>{
					if (res.data === "success") {
						this.$message({
								message: successMsg,
								type: "success"
						});
						this.$router.push({
								name: "clueAssistManage"
						});
					} else {
						this.$message({
								message: failMsg,
								type: "warning"
						});
					}
				});
		});
    },
    //  获取userList
    async getUserList() {
      try {
        /* 申请单位 */
        let url01 = "/userApi/" + this.userId;
        // 获取申请单位和部门ID
        let parentID = await this.$Ajax.get(url01, { token: this.token }, true);
        this.ayData.sqdw = parentID.depName; //  获取申请单位
        this.depId = parentID.depId; // 获取部门ID

        // 获取父级部门
        let url02 = "/orgApi/getParentDeps/" + parentID.depId;
        this.$Ajax.get(url02, { token: this.token }, true).then(res => {
          //  获取市级查询单位数据
          this.shiju = res[0].name;
          this.shijuID = res[0].id;
        });

        // 获取角色ID
        this.$Ajax
          .get("/clue/getTaskRole/", { statusId: this.statusId }, true)
          .then(res => {
            this.roleId = res[0];
            this.$Ajax
              .get(
                "userApi/getUsersByOrgIdAndRoleId/",
                { orgId: this.depId, roleId: this.roleId },
                true
              )
              .then(res => {
                this.ayData.userList = res.join(",");
              });
          });

        // 获取区县
        let url03 = "/orgApi/getSameevelDeps/" + res.depId;
        this.$Ajax.get(url03, { token: this.token }, true).then(res => {
          this.quxianList = res;
        });
        /* 申请单位 */
      } catch (err) {
        console.log(err);
      }
    },
    //  获取userList方法02
    async getUserList02() {
      try {
        // 获取角色ID
        let res = await this.$Ajax.get(
          "/clue/getTaskRole/",
          { statusId: this.statusId02 },
          true
        );
        this.roleId = res[0];
        // 获取用户列表
        
        let user = await this.$Ajax.get(
          "userApi/getUsersByOrgIdAndRoleId/",
          { orgId: this.queryUnitBy, roleId: this.roleId },
          true
        );
        this.shData.userLi = user.join(",");

      } catch (err) {
        console.log(err);
      }
    },
    //  加载流程图数据
    initChart() {
      let that = this;
      let params = {
        id: that.bkID,
        token: that.token
      };
      this.$Ajax.get("flow/processDrawing", params).then(res => {
				that.chartData = res.data.results;
				that.isData = true;
			})
			.catch(err => {
				console.warn(err);
			});
    },
    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
    },
    //  获取详情数据
    getDetails() {
      let statusType = this.$route.query.statusType;
      // { id: 'c6225d1e-02cd-4034-8f69-655b07e7adc1', createBy: 'jiandan' }
      this.$Ajax.get("clue/invDetails",
        {
          id: this.bkID,
          createBy: this.createBy,
          procInstId: this.procInstId,
          statusType: statusType
        },
        true
      ).then(res => {
          res.data.taskList && res.data.taskList.length != 0
            ? (this.shData.statusIdNew = res.data.taskList[0].statusId)
            : "";
          console.log("申请人是：", this.shData.sqr);

          if (res.data.details) {
            //  审核数据
            this.shData.shr = localStorage.getItem("realName");
            this.shData.sqr = res.data.details.createBy;

            this.queryUnitBy = res.data.details.queryUnitBy;

            res.data.taskList && res.data.taskList.length !== 0
              ? (this.statusId02 = res.data.taskList[0].statusId)
              : (this.statusId02 = "");
            res.data.taskList && res.data.taskList.length !== 0
              ? (this.shData.statusId02 = res.data.taskList[0].statusId)
              : (this.shData.statusId02 = "");

            this.shData.isCity = res.data.details.unitType;
            // TODO:
            console.warn('申请数据', res.data);
            //  申请数据
            this.ayData.aymc = res.data.details.name;
            this.ayData.aybh = res.data.details.code;
            this.ayData.xfsj = res.data.details.createTime;
            this.ayData.sqdw = res.data.details.createDepName;
            this.ayData.sqr = res.data.details.createName;

            this.ayData.ajbh = res.data.details.caseSourceCode;
            this.ayData.ajmc = res.data.details.caseSourceName;
            this.ayData.zasd = res.data.details.meansOfCrime;
            this.ayData.ajsl = res.data.details.caseAmount.toString();
            this.ayData.ypry = res.data.details.judgmentName;
            this.ayData.ajlb = res.data.details.caseTypeName;
            this.ayData.jyaq = res.data.details.caseInfo;
            this.ayData.cbyj = res.data.details.techEvide;
            this.ayData.xstz = res.data.details.clueFeature;
            // this.ayData.cxdw: "石家庄市桥西分局第四刑侦大队", //查询单位
            this.ayData.tqxq = res.data.details.applyDesc;
            
            //  附件
            for (var i = 0; i < res.data.details.attachments.length; i++) {
              if (res.data.details.attachments[i].classify == 10) {
                //  普通工单附件
                this.ayData.fileList.push(res.data.details.attachments[i]);
              }
              if (res.data.details.attachments[i].classify == 11) {
                //  区县反馈附件
                this.fkFJInfoList.push(res.data.details.attachments[i]);
              }
              if (res.data.details.attachments[i].classify == 12) {
                //  市级反馈附件
                this.sjfkFJInfoList.push(res.data.details.attachments[i]);
              }
            }
            //  普通工单附件
            this.ayData.fileList = uniq(this.ayData.fileList);
            //  区县反馈附件
            this.fkFJInfoList = uniq(this.fkFJInfoList);
            //  市级
            this.sjfkFJInfoList = uniq(this.sjfkFJInfoList);
          }
          // TODO:  控制编辑只读状态
          if (res.data.activitiInfoList == null || res.data.details == null) {
            //  activitiInfoList为空，线索协查申请页面
            this.sqIsRead = false;
            this.yySuccess1 = false;
            this.yySuccess2 = false;
            this.ayRules = this.ayRules;
          } else if (res.data.activitiInfoList) {
            this.sqIsRead = true;
            this.yySuccess1 = true;
            this.yySuccess2 = true;
            this.ayRules = {};
          }

          this.getUserList02();

          res.data.activitiInfoList.data.forEach(item => {
            if (
              (item.endTime !== null) &&
              (item.hParam.result !== undefined) &&
              (item.hParam.result !== "退回") &&
              //  区县接收内容不显示
              (item.taskDefinitionKey != "xzqxjs") &&
              //  市级接收内容不显示
              (item.taskDefinitionKey != "sjjs") &&
              //  区县反馈
              (item.taskDefinitionKey != "xzqxfk") &&
              //  市局反馈
              (item.taskDefinitionKey != "sjjgfk")
            ) {
              this.approveList.push(item.hParam);
            }
            //  获取签收结果数据
            if (
              item.hParam.date &&
              item.hParam.depName &&
              item.taskDefinitionKey == "jgjs"
            ) {
              this.qsjgList.push(item);
            }

            //  反馈
            if (
              (item.endTime !== null) &
              (item.hParam.result !== undefined) &
              (item.taskDefinitionKey == "xzqxfk")
            ) {
              this.fkInfoList.push(item.hParam);
            }
            if (
              (item.endTime !== null) &
              (item.hParam.result !== undefined) &
              (item.taskDefinitionKey == "sjjgfk")
            ) {
              this.sjfkInfoList.push(item.hParam);
            }
          });

          //  获取退回结果数据
          if (res.data.taskList) {
            res.data.taskList.forEach(item => {
              res.data.activitiInfoList.data.forEach(list => {
                if (item.taskId === list.id && list.hParam.result === "退回") {
                  this.approveListTH.push(list.hParam);
                }
              });
            });
          }

          //  控制按钮显示

          //  只有待办才显示
          //  获取当前页面状态   0待办；1发起；2已办
          if (statusType) {
            if (statusType === "1" && this.$route.query.statusStr === "草稿") {
              //..发起状态，申请按钮显示
              this.sqBtn = true; //  显示申请按钮
              this.originFileList = this.ayData.fileList; //  已经上传的文件渲染出来,展示名称
              this.ayData.attachments = res.data.details.attachments; //  已经上传的文件保存给后台

              this.sqIsRead = false; //  切换为编辑状态
              this.yySuccess1 = false;
              this.yySuccess2 = false;
              this.ayRules = this.ayRules;

              this.ayData.ajsl = this.ayData.ajsl
                ? this.ayData.ajsl.toString()
                : ""; //  案件数量
              this.ayData.cbyj =
                res.data.details.techEvide.length > 0
                  ? res.data.details.techEvide.split(",")
                  : []; //..串并依据

              if (res.data.details.unitType == 0) {
                this.ayData.level = "区县";
                this.cxdwStatus = false;
                this.ayData.cxdw = res.data.details.queryUnitName;
              } else if (res.data.details.unitType == 1) {
                this.ayData.level = "市局";
                this.cxdwStatus = true;
                this.ayData.cxdw = res.data.details.queryUnitName;
              }
            } else {
              this.sqBtn = false;

              this.sqIsRead = true;
              this.yySuccess1 = true;
              this.yySuccess2 = true;
              this.ayRules = {};
            }
            if (statusType === "1" || statusType === "2") {
							// 只读状态
              this.changeTitle = "线索协查详情";
              if (this.$route.query.statusStr === "草稿") {
                this.changeTitle = "线索协查申请";
							}
            } else {
							//  编辑状态，且按钮显示(待办)
              if (res.data.taskList && res.data.taskList[0].formProps.length > 0) {
                (this.newTaskId = res.data.taskList[0].taskId),
                  res.data.taskList[0].formProps.forEach(item => {
                    if (item === "review_info") {
                      //  审核编辑框显示与否
                      this.shxxEditIsShow = true;
                      this.changeTitle = "线索协查审核";
                    }
                    if (item === "submit_review_btn") {
                      //  审核按钮显示与否
                      this.sjypyspBtn = true;
                    }
                    if (item === "confirm_btn") {
                      //  确认按钮是否显示
                      this.qrBtn = true;
                      this.changeTitle = "线索协查确认";
                    }
                    //  被退回之后
                    if (item === "back_btn") {
                      this.changeTitle = "线索协查申请";
                      //申请按钮出现，而且是编辑状态
                      this.ayData.ajsl = this.ayData.ajsl.toString(); //  案件数量
                      this.ayData.cbyj = res.data.details.techEvide.split(","); //..串并依据
                      this.originFileList = this.ayData.fileList; //  已经上传的文件渲染出来,展示名称
                      this.ayData.attachments = res.data.details.attachments; //  已经上传的文件保存给后台
                      this.sqIsRead = false; //  切换为编辑状态
                      this.sqBtn = true; //  显示申请按钮

                      if (res.data.details.unitType == 0) {
                        this.ayData.level = "区县";
                        this.cxdwStatus = false;
                        this.ayData.cxdw = res.data.details.queryUnitName;
                      } else if (res.data.details.unitType == 1) {
                        this.ayData.level = "市局";
                        this.cxdwStatus = true;
                        this.ayData.cxdw = res.data.details.queryUnitName;
                      }
                    }

                    /**
                     * 申请jiandan-
                     * 发起区县审批caimin-
                     * 协作区县审批test001-
                     * 协作区县接收shenpi-
                     * 协作区县反馈jieshou-
                     * 市级部门审批fankui-
                     * 市局接收zhangjianjun-
                     * 市局结果反馈test1-
                     * 确认签收yinfan-
                     */
                    // 获取详情反馈流程接口数据
                    this.shData.taskKey = res.data.taskList[0].statusId;
                    this.shData.taskIdNew = res.data.taskList[0].taskId;
                    //  发起区县审批
                    if (item === "fqqxsp_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "发起区县审批";
                      this.shData.unitType = res.data.details.unitType;
                      
                    }
                    //  协作区县审批
                    if (item === "xzqxsp_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "协作区县审批";
                      this.shData.url = "clue/invCooperativeApproval";
                      // this.shData.userLi = 'shenpi';
                    }
                    //  协作区县接收
                    if (item === "xzqxjs_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "协作区县接收";
                      this.shData.url = "clue/invCooperativeAccept";
                      // this.shData.userLi = 'jieshou';

                      //  通过/退回选择按钮不显示
                      this.shData.backIsShow = true;
                      //  提交市局按钮显示
                      this.shData.btnSecShow = true;

                      this.shData.xzqxjsBtn = false;

                      //  控制协作区县接收、反馈步骤，提请市局按钮点击后的弹窗
                      this.shData.xzqxJSFKtask = true;
                    }
                    //  协作区县反馈
                    if (item === "xzqxfk_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "协作区县反馈";
                      this.shData.url = "clue/invCooperativeFeedback";

                      //  通过/退回选择按钮不显示
                      this.shData.backIsShow = true;
                      //  提交市局按钮显示
                      this.shData.btnSecShow = true;

                      //  上传附件按钮展示
                      this.shData.showUpload = true;
                      this.shData.uploadNumber = 11;

                      //  控制协作区县接收、反馈步骤，提请市局按钮点击后的弹窗
                      this.shData.xzqxJSFKtask = true;

                      this.shData.setFkHide = false;
                      
                    }
                    //  市级部门审批
                    if (item === "sjbmsp_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "市级部门审批";
                      this.shData.url = "clue/invCityApproval";
                      // this.shData.userLi = 'zhangjianjun';

                      this.shData.sjbmIsCity = 1;
                    }
                    //  市局接收
                    if (item === "sjjs_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "市局接收";
                      this.shData.url = "clue/cityAccept";
                      // this.shData.userLi = 'test1';

                      //  通过/退回选择按钮不显示
                      this.shData.backIsShow = true;
                      //  提交市局按钮显示
                      // this.shData.btnSecShow = true;
                      //  市局接收按钮显示
                      this.shData.sjjsBtn = true;

                      this.shData.xzqxjsBtn = false;
                      this.shData.sjjsBtn02 = false;

                      this.shData.sjbmIsCity = 1;
                    }
                    //  市局结果反馈
                    if (item === "sjjgfk_btn") {
                      this.sjypyspBtn = true;
                      this.changeTitle = "市局结果反馈";
                      this.shData.url = "clue/cityFeedback";
                      // this.shData.userLi = 'yinfan';

                      //  通过/退回选择按钮不显示
                      this.shData.backIsShow = true;
                      //  提交市局按钮显示
                      // this.shData.btnSecShow = true;

                      //  市局结果反馈按钮显示
                      this.shData.sjjgfkBtn = true;

                      //  上传附件按钮展示
                      this.shData.showUpload = true;
                      this.shData.uploadNumber = 12;

                      this.shData.setFkHide = false;
                      // 获取详情反馈流程接口数据
                      this.shData.taskKey = res.data.taskList[0].statusId;
                      this.shData.taskIdNew = res.data.taskList[0].taskId;
                    }
                    //  确认签收
                    if (item === "qrqs_btn") {
                      this.qrBtn = true;

                      this.changeTitle = "确认签收";
                      this.shData.url = "clue/confirm";
                    }
                  });
              }
            }
          }
          console.warn('申请数据结束', this.ayData);
        });
    },
    //  文件上传
    uploadFiles(e) {
      let fileList = e.currentTarget.files;
      let that = this;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
      } else if (fileList.length > 1) {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
        }
      }
      if (fileList !== "") {
        this.ayData.originFile = "线索协查信息附件已上传";
      }
      this.$Ajax.form("upload/batch?classify=10", formData).then(data => {
        
        if (data.data.length > 0) {
          data.data.forEach(item => {
            //item.classify = "9";
            that.ayData.attachments.push(item);
            that.originFileList.push(item);
          });
        }
        // 数组去重
        that.originFileList = uniq(that.originFileList);
      });
    },
    //  文件删除
    deleleFile(item, child) {
      let that = this;
      let params = {
        id: item.id
      };
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
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
            that.$message({ message: "附件删除失败", type: "warning" });
          }

          that.originFileList.forEach((ele, index) => {
            if (ele.id === item.id) {
              that.originFileList.splice(index, 1);
            }
          });

          that.ayData.attachments.forEach((ele, index) => {
            if (ele.id === item.id) {
              that.ayData.attachments.splice(index, 1);
            }
          });

          child.value = ""; //..上传input的value置空

          that.$message({
            message: "附件删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //  发起人确认页面 - 确认按钮
    qrSubmit() {
      let qrData = {
        createBy: this.shData.sqr,
        id: this.bkID,
        statusId: this.statusId,
        taskId: this.newTaskId,
        opinionInfo: {
          depName: this.ayData.sqdw,
          createName: this.ayData.sqr,
          date: moment().format("YYYY-MM-DD HH:mm:ss")
        }
      };
      const lcData = {
        createBy: localStorage.getItem("userName"),
        id: this.bkID,
        modeType: "2",
        taskKey:this.shData.taskKey,
        taskId:this.shData.taskIdNew,
        opinionInfo: {
          depName: this.ayData.sqdw,
          createName: this.ayData.sqr,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
          createBy: this.createBy, //  流程单子申请的人
          userList: this.ayData.userList
        }
      };
      this.$Ajax.post("flow/submitFlow", lcData, true).then(res => {
        console.warn(res);
        if (res.data === "success") {
          this.$message({
            message: successMsg,
            type: "success"
          });
          this.$router.push({
            name: "clueAssistManage"
          });
        } else {
          this.$message({
            message: failMsg,
            type: "warning"
          });
        }
      });
      this.$Ajax.post("clue/confirm", qrData, true).then(res => {
        this.$message({
          type: "success",
          message: "确认成功!"
        });
        this.$router.push({
          name: "clueAssistManage"
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>

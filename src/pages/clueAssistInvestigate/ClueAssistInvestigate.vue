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
        <el-form-item label="提请需求：" prop="applyDesc" class="xsxc-width100">
          <el-input type="textarea" v-model="ayData.applyDesc" autosize :readonly="sqIsRead"></el-input>
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
    <qxspInfo 
    :shData="shData" 
    :newTaskId="newTaskId" 
    v-if="sjypyspBtn"/>

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
import { uniq, deepCopy } from '../../util/publicTools.js';  // 工具函数导入,和验证规则,对象深拷贝
import { myData, titleList01, titleList02 } from '../../util/publicObject.js'; // 引入需要的applyData,里面的字段是固定的，以后可能需要继续使用
import ayRules from '../../util/mixinRules.js'; //校验规则
import ayData from '../../util/mixinAyData.js';  // 案源数据
import publicMethods from '../../util/mixinPublicMethods.js'; // 一些公用的方法
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
  mixins: [ayRules, ayData, publicMethods],
  data() {
    return {
      //  title名称动态数据 - 基本信息
      titleList01,
      //  title名称动态数据 - 线索协查信息
      titleList02,
    };
  },

  async created() {
    this.bkID = this.$route.query.id;
    this.procInstId = this.$route.query.procInstId;
    this.statusId = this.$route.query.statusId;

    this.createBy = localStorage.getItem("userName");
    this.token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    //..申请人
    // this.ayData.createName = localStorage.getItem("realName");
    
    this.getUserList()//  获取userList和申请单位、查询单位
    // 案源编号时间
    this.ayData.code = new Date().getTime();
    //  如果在管理页点击的不是申请按钮，才会调用详情数据
    if (this.$route.query.isSQ != 1) {
      //  调用详情数据
      this.getDetails();
    }
    // TODO:
    // 测试方法, 这个是获取用户的  和historyFrom  取交集使用
    let res = await this.$Ajax.get('permissionApi/getFeatures?appCode=hczz').catch(err => console.log(err));
    let arr = res.map(item => item.code);
    console.warn('获取用户取交集', arr);
  },
  mounted() {
    //    获取当前时间，赋值给申请时间
    // this.$set(this.ayData, 'createTime', moment().format("YYYY-MM-DD HH:mm:ss"));
    this.ayData.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
    //  如果在管理页点击的不是申请按钮，且不是草稿页面，才会调用流程图数据
    if (this.$route.query.isSQ != 1 && this.$route.query.statusStr !== "草稿") {
      //  加载流程图数据
      this.initChart();
    }
  },
  watch: {
    // 判断附件数量是否为0
    originFileList(nv) {
      // TODO: 这里的监听  ayData.originFile 这个属性，一开始没有需要注意
      nv.length === 0
        ? (this.ayData.originFile = "")
        : (this.ayData.originFile = "线索协查信息附件已上传");
    }
  },
  methods: {
    //  协查级别
    chooseLevel(label) {
      console.warn('显示label', label);
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
      // 这个是深拷贝方法
      let obj = deepCopy(this.ayData);
      let myApplyData = {
        id: this.bkID,
        createBy: this.createBy,
        taskId: this.newTaskId,
        opinionInfo: {
          userList: this.ayData.userList,
          createBy: this.createBy
        },
        techEvide: this.ayData.techEvide.join(","),
        status: num // 线索协查状态   null保存  1提交
      };
      let applyData = {...obj, ...myApplyData, ...myData};

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
      
      console.warn(applyData);
      console.warn('打印num', num);
			this.$Ajax.post('clue/invApply', applyData, true).then(res => {
				const lcData = {
					createBy:this.createBy,
					id: res.data !== 'fail' ? res.data : null,
					modeType:'2',
					taskKey:this.shData.taskKey || null,
          taskId:this.shData.taskIdNew || null,
					opinionInfo:{
            userList: this.ayData.userList,
            createBy:this.createBy,
            depName: this.ayData.createDepName,
            createName: this.ayData.createName,
            date: moment().format("YYYY-MM-DD HH:mm:ss")
					}
        }
        console.warn(lcData);
        if (num !== 1) return this.$router.push({name: "clueAssistManage"});
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
        let url01 = "userApi/" + this.userId;
        // 获取申请单位和部门ID
        let parentID = await this.$Ajax.get(url01, { token: this.token }, true);
        this.ayData.createDepName = parentID.depName; //  获取申请单位
        //this.$set(this.ayData, 'createDepName', parentID.depName);
        this.depId = parentID.depId; // 获取部门ID
        console.warn('部门', this.ayData);
        // 获取父级部门
        let url02 = "orgApi/getParentDeps/" + parentID.depId;
        this.$Ajax.get(url02, { token: this.token }, true).then(res => {
          //  获取市级查询单位数据
          this.shiju = res[0].name;
          this.shijuID = res[0].id;
        });
        // 获取角色ID
        this.$Ajax
          .get("clue/getTaskRole/", { statusId: this.statusId }, true)
          .then(res => {
            this.roleId = res[0];
            this.$Ajax
              .get(
                "userApi/getUsersByOrgIdAndRoleId/",
                { orgId: this.depId, roleId: this.roleId },
                true
              )
              .then(res => {
                console.log('getUsersByOrgIdAndRoleId第一个', res, this.depId, this.roleId);
                this.ayData.userList = res.join(",");
              });
          });

        // 获取区县
        let url03 = "orgApi/getSameevelDeps/" + parentID.depId;
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
          "clue/getTaskRole/",
          { statusId: this.shData.statusIdNew },
          true
        );
        this.roleId = res[0];
        // 获取用户列表
        let user = await this.$Ajax.get(
          "userApi/getUsersByOrgIdAndRoleId/",
          { orgId: this.queryUnitBy, roleId: this.roleId },
          true
        );
        console.log('getUsersByOrgIdAndRoleId第二个', user, this.queryUnitBy, this.roleId);
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
    async getDetails() {
      let statusType = this.$route.query.statusType;
      // { id: 'c6225d1e-02cd-4034-8f69-655b07e7adc1', createBy: 'jiandan' }
      let res = await this.$Ajax.get("clue/invDetails",
        {
          id: this.bkID,
          createBy: this.createBy,
          procInstId: this.procInstId,
          statusType: statusType
        },
        true
      );
      let taskList = res.data.taskList;
      this.shData.statusIdNew = taskList && taskList.length !== 0
        ? taskList[0].statusId
        : "";
      console.log("申请人是：", this.shData.sqr);
      
      // 判断如果是申请页面则没有这个数据
      let details = res.data.details;
      let activitiInfoList = res.data.activitiInfoList;
      if (details) {
        //  审核数据
        this.shData.sqr = details.createBy;
        this.queryUnitBy = details.queryUnitBy;
        this.shData.isCity = details.unitType;
        //  申请数据
        // 这是修改的数据 
        this.ayData = {...this.ayData,...details};
        //  附件
        this.ayData.fileList = [];
        const attachments = details.attachments;
        //  普通工单附件, 去重后赋值
        this.ayData.fileList = uniq(attachments.filter(item => item.classify == 10));
        //  区县反馈附件, 去重后赋值
        this.fkFJInfoList = uniq(attachments.filter(item => item.classify == 11));
        //  市级反馈附件, 去重后赋值
        this.sjfkFJInfoList = uniq(attachments.filter(item => item.classify == 12));
      }
      
      // TODO:  控制编辑只读状态
      if (activitiInfoList) {
        //  activitiInfoList为空，线索协查申请页面
        this.sqIsRead = true;
        this.yySuccess1 = true;
        this.yySuccess2 = true;
      } 
      else{
        this.sqIsRead = false;
        this.yySuccess1 = false;
        this.yySuccess2 = false;
      }
      this.getUserList02();
      console.warn('获取详情数据：', res.data.activitiInfoList.data);
      /* 循环开始---------------------------------- */
      
      activitiInfoList.data.forEach(item => {
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
        ) 
        {
          this.approveList.push(item.hParam);
        }
        //  获取签收结果数据
        if (
          item.hParam.date &&
          item.hParam.depName &&
          item.taskDefinitionKey == "jgjs"
          ) 
        {
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
      /* 循环结束----------------------------------- */
      //  获取退回结果数据
      if (res.data.taskList) {
        res.data.taskList.forEach(item => {
          activitiInfoList.data.forEach(list => {
            if (item.taskId === list.id && list.hParam.result === "退回") {
              this.approveListTH.push(list.hParam);
            }
          });
        });
      }
      //  控制按钮显示
      //  只有待办才显示
      //  获取当前页面状态   0待办；1发起；2已办
      console.log('获取当前页面状态:', statusType)
      if (statusType) {
        /* 发起草稿状态 */
        if (statusType === "1" && this.$route.query.statusStr === "草稿") {
          //..发起状态，申请按钮显示
          this.sqBtn = true; //  显示申请按钮
          this.originFileList = this.ayData.fileList; //  已经上传的文件渲染出来,展示名称
          this.ayData.attachments = details.attachments; //  已经上传的文件保存给后台

          this.sqIsRead = false; //  切换为编辑状态
          this.yySuccess1 = false;
          this.yySuccess2 = false;
          //  案件数量,转换成字符串
          this.ayData.caseAmount = this.ayData.caseAmount
            ? this.ayData.caseAmount.toString()
            : ""; 
          
          //..串并依据
          this.ayData.techEvide =
            details.techEvide.length > 0
              ? details.techEvide.split(",")
              : [];
          if (details.unitType == 0) {
            this.ayData.level = "区县";
            this.cxdwStatus = false;
            this.ayData.cxdw = details.queryUnitName;
          } 
          else if (details.unitType == 1) {
            this.ayData.level = "市局";
            this.cxdwStatus = true;
            this.ayData.cxdw = details.queryUnitName;
          }
        } 
        /* 代办或者已办状态 */
        else {
          this.sqBtn = false;
          this.sqIsRead = true;
          this.yySuccess1 = true;
          this.yySuccess2 = true;
          
        }
        /* 发起，已办状态 */
        if (statusType != 0) {
          // 只读状态
          this.changeTitle = "线索协查详情";
          if (this.$route.query.statusStr === "草稿") {
            this.changeTitle = "线索协查申请";
          }
        } 
        /* 待办状态 */
        else {
          //  编辑状态，且按钮显示(待办)
          if (res.data.taskList && res.data.taskList[0].formProps.length > 0) {
            (this.newTaskId = res.data.taskList[0].taskId);
            /* 循环开始----------------------- */
            let formProps = res.data.taskList[0].formProps[0];
            console.log('循环的-------------', formProps);
            switch(formProps){
              case "review_info":
                //  审核编辑框显示与否
                this.shxxEditIsShow = true;
                this.changeTitle = "线索协查审核";
              break;
              case "submit_review_btn":
                //  审核按钮显示与否
                this.sjypyspBtn = true;
              break;
              case "confirm_btn":
                //  确认按钮是否显示
                this.qrBtn = true;
                this.changeTitle = "线索协查确认";
              break;
              case "back_btn":
                //  被退回之后
                this.changeTitle = "线索协查申请";
                //申请按钮出现，而且是编辑状态
                this.ayData.caseAmount = this.ayData.caseAmount.toString(); //  案件数量
                this.ayData.techEvide = details.techEvide.split(","); //..串并依据
                this.originFileList = this.ayData.fileList; //  已经上传的文件渲染出来,展示名称
                this.ayData.attachments = details.attachments; //  已经上传的文件保存给后台
                this.sqIsRead = false; //  切换为编辑状态
                this.sqBtn = true; //  显示申请按钮
                this.yySuccess1 = false;  // 案件名称设置为可编辑状态
                this.yySuccess2 = false;  // 作案手段设置为可编辑状态
                if (details.unitType == 0) {
                  this.ayData.level = "区县";
                  this.cxdwStatus = false;
                  this.ayData.cxdw = details.queryUnitName;
                } else if (details.unitType == 1) {
                  this.ayData.level = "市局";
                  this.cxdwStatus = true;
                  this.ayData.cxdw = details.queryUnitName;
                }
              break;
              //  发起区县审批
              case"fqqxsp_btn":
                this.sjypyspBtn = true;
                this.changeTitle = "发起区县审批";
                this.shData.unitType = details.unitType;
              break;
              //  协作区县审批
              case "xzqxsp_btn":
                this.sjypyspBtn = true;
                this.changeTitle = "协作区县审批";
                this.shData.url = "clue/invCooperativeApproval";
               break;
              //  协作区县接收
              case "xzqxjs_btn":
                this.sjypyspBtn = true;
                this.changeTitle = "协作区县接收";
                this.shData.url = "clue/invCooperativeAccept";
                //  通过/退回选择按钮不显示
                this.shData.backIsShow = true;
                //  提交市局按钮显示
                this.shData.btnSecShow = true;
                this.shData.xzqxjsBtn = false;
                //  控制协作区县接收、反馈步骤，提请市局按钮点击后的弹窗
                this.shData.xzqxJSFKtask = true;
              break;
              //  协作区县反馈
              case "xzqxfk_btn":
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
              break;
              //  市级部门审批
              case "sjbmsp_btn":
                this.sjypyspBtn = true;
                this.changeTitle = "市级部门审批";
                this.shData.url = "clue/invCityApproval";
                // this.shData.userLi = 'zhangjianjun';
                this.shData.sjbmIsCity = 1;
              break;
              //  市局接收
              case "sjjs_btn":
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
              break;
              //  市局结果反馈
              case "sjjgfk_btn":
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
              break;
              //  确认签收
              case "qrqs_btn":
                this.qrBtn = true;
                this.changeTitle = "确认签收";
                this.shData.url = "clue/confirm";
              break;
            };
            // 获取详情反馈流程接口数据
            this.shData.taskKey = res.data.taskList[0].statusId;
            this.shData.taskIdNew = res.data.taskList[0].taskId;
            /* 循环结束----------------------- */
          }
        }
      }
      console.warn('申请数据结束', this.ayData);
    },
    //  发起人确认页面 - 确认按钮
    qrSubmit() {
      let qrData = {
        createBy: this.shData.sqr,
        id: this.bkID,
        statusId: this.statusId,
        taskId: this.newTaskId,
        opinionInfo: {
          depName: this.ayData.createDepName,
          createName: this.ayData.createName,
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
          depName: this.ayData.createDepName,
          createName: this.ayData.createName,
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
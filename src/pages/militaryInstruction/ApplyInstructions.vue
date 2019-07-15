<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">作战指令申请</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link tag="span" to='ypManagement' style="display:inline-block;margin-right:10px;">
                                <el-button type="primary" size="small">提交审核</el-button>
                            </router-link>
              <el-button type="primary" size="small">保存草稿</el-button>-->
              <!-- <router-link tag="span" to='fightManage' style="display:inline-block;margin-right:10px;"> -->
              <el-button
                type="primary"
                size="small"
                v-if="isOnlyRead & btnShowFlag"
                @click="submit('instructForm', 1)"
              >提交审核</el-button>
              <!-- </router-link> -->
              <!-- <router-link tag="span" to='fightManage' style="display:inline-block;margin-right:10px;"> -->
              <el-button
                type="primary"
                size="small"
                v-if="isOnlyRead & btnShowFlag"
                @click="submitAudit(0)"
              >保存草稿</el-button>
              <!-- </router-link> -->
              <!-- <el-button size="small" @click="checkProcess">查看流程</el-button> -->
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-form
        :inline="true"
        :model="instructForm"
        :rules="instructRules"
        ref="instructForm"
        class="instruct-form form-style"
        label-width="100px"
      >
        <div class="form-item">
          <div class="form-title">指令信息</div>
          <el-form-item
            label="指令名称："
            prop="instructName"
            class="instruct-name"
            style="width: 66%;margin-right: 4px;"
          >
            <el-input
              v-model.trim="instructForm.instructName"
              :disabled="noDisable"
              class="instruct-name-input form-ipt-style"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="指令编号：" prop="instructNumber">
            <div>{{instructForm.instructNumber}}</div>
          </el-form-item>
          <el-form-item label="发起单位：" prop="unit">
            <div>{{instructForm.unit}}</div>
          </el-form-item>
          <el-form-item label="发起人：" prop="person">
            <div>{{instructForm.person}}</div>
          </el-form-item>
          <el-form-item label="下发时间：" prop="time">
            <div>{{instructForm.time}}</div>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">案源信息</div>
          <el-form-item label="案串编号：" prop="caseNumber">
            <el-input
              v-model.trim="instructForm.caseNumber"
              :disabled="noDisable"
              placeholder="串案/案件编号"
              class="form-ipt-style"
              size="small"
              @keydown.enter.native="reference"
            ></el-input>
            <a href="javascript:;" class="btn-quote" @click="reference">引用</a>
          </el-form-item>
          <el-form-item label="案串名称：" prop="caseName">
            <!-- <div>{{instructForm.caseName}}</div> -->
            <el-input
              v-model.trim="instructForm.caseName"
              placeholder="案串名称"
              class="form-ipt-style"
              size="small"
              :disabled="isDisable || isDisableA || noDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="作案手段：" prop="caseMeans">
            <el-input
              v-model.trim="instructForm.caseMeans"
              :disabled="isDisableA || noDisable"
              class="form-ipt-style"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件数量：" prop="caseCount">
            <!-- <div>{{instructForm.caseCount}}</div> -->
            <el-input
              v-model.trim="instructForm.caseCount"
              placeholder="案件数量"
              class="form-ipt-style"
              size="small"
              :disabled="isDisable || isDisableA || noDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="研判人员：" prop="personnel">
            <!-- <div>{{instructForm.personnel}}</div> -->
            <el-input
              v-model.trim="instructForm.personnel"
              :disabled="noDisable"
              class="form-ipt-style"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件类别：" prop="caseType">
            <el-select
              v-model="instructForm.caseType"
              :disabled="isDisableA || noDisable"
              placeholder="请选择案件类别"
              size="small"
            >
              <el-option label="盗窃" value="盗窃"></el-option>
              <el-option label="抢劫" value="抢劫"></el-option>
              <el-option label="抢夺" value="抢夺"></el-option>
              <el-option label="诈骗" value="诈骗"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简要案情：" prop="briefCase" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="isDisableA || noDisable"
              placeholder="请输入简要案情"
              v-model="instructForm.briefCase"
            ></el-input>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="串并依据：" prop="gist" style="width: 66%">
            <el-checkbox-group v-model="instructForm.gist" :disabled="noDisable">
              <el-checkbox label="DNA"></el-checkbox>
              <el-checkbox label="指纹"></el-checkbox>
              <el-checkbox label="视频"></el-checkbox>
              <el-checkbox label="足迹"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="线索特征：" prop="clueTrait" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="noDisable"
              placeholder="请输入线索特征"
              v-model="instructForm.clueTrait"
            ></el-input>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="附件：" class="brief-case-content" prop="originFile">
            <el-input
              type="textarea"
              :rows="4"
              v-model="instructForm.originFile"
              :placeholder="accessoryPlacrholder"
              disabled="disabled"
            ></el-input>
            <div class="origin-file-list">
              <span v-show="originFileList.length === 0">{{ accessoryPlacrholder }}</span>
              <ul v-show="originFileList.length !== 0">
                <li v-for="(item,index) in originFileList" :key="index">
                  <span :title="item">{{ item.fileName }}</span>
                  <i class="iconfont iconguanbi2" @click="deleleFile(item)"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="originChange" :disabled="noDisable" ref="inp">
              <div>上传</div>
            </div>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">指定侦办</div>
          <el-form-item label="主侦单位：" prop="mainSpyUnit">
            <el-select
              v-model="instructForm.mainSpyUnit"
              :disabled="noDisable"
              placeholder="请选择主侦单位"
              size="small"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item,index) in curDepList1"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配侦单位：" prop="cooperateSpyUnit">
            <el-select
              v-model="instructForm.cooperateSpyUnit"
              :disabled="noDisable"
              multiple
              placeholder="请选择配侦单位"
              size="small"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                :disabled="item.disabled"
                v-for="(item,index) in curDepList2"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="侦办要求：" prop="spyRequire" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="noDisable"
              placeholder="请输入侦办要求"
              v-model="instructForm.spyRequire"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">提交信息</div>
          <el-form-item label="申请说明：" prop="applyInstructions" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="noDisable"
              placeholder="请输入申请说明"
              v-model="instructForm.applyInstructions"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-btn-item" v-if="isOnlyRead & btnShowFlag">
          <el-form-item>
            <!-- <router-link tag="span" to='fightManage' style="display:inline-block;margin-right:10px;"> -->
            <el-button type="primary" size="small" @click="submit('instructForm', 1)">提交审核</el-button>
            <!-- </router-link> -->
            <!-- <router-link tag="span" to='fightManage'> -->
            <el-button type="primary" size="small" @click="submitAudit(0)">保存草稿</el-button>
            <!-- </router-link> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode">
        <!-- 流程图 -->
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
import { stringify } from "querystring";

import Api from "../../service/api.js";
import config from "../../../config";
import { connect } from "net";
import { constants } from "os";

export default {
  name: "applyInstructions",
  data() {
    let numCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("案件数量"));
      } else {
        let reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error("请输入大于0的数字"));
        } else {
          callback();
        }
      }
    };
    return {
      isDisable: false, //  默认可以编辑
      isDisableA: false,
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "",

      instructForm: {
        //  表单内容
        //  指令信息内容
        instructName: "",
        instructNumber: new Date().getTime(), //Math.random(),
        unit: "",
        person: "",
        time:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate() +
          " " +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds(),

        //  案源信息内容
        caseNumber: "",
        caseName: "",
        caseMeans: "",
        caseCount: "",
        personnel: "",
        caseType: "",
        briefCase: "",
        gist: [],
        clueTrait: "",
        fileList: [], //  保存上传附件名称的数组
        originFile: "",

        //  指定侦办内容
        mainSpyUnit: "",
        cooperateSpyUnit: "",
        spyRequire: "",

        //  提交信息内容
        // superiorAuditor:'',
        applyInstructions: "",
        attachments: []
      },
      instructRules: {
        //  指令信息检查规则
        instructName: [
          { required: true, message: "请输入指令名称", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseNumber: [
          { required: true, message: "请输入案串编号", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseName: [
          { required: true, message: "请输入案串名称", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseMeans: [
          { required: true, message: "请输入作案手段", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseCount: [
          { required: true, message: "请输入案件数量", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] },
          { validator: numCheck, trigger: "blur" }
        ],
        personnel: [
          { required: true, message: "请输入研判人员", trigger: ["blur"] },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseType: [
          {
            required: true,
            message: "请选择案件类别",
            trigger: ["change", "blur"]
          }
        ],
        briefCase: [
          { required: true, message: "请输入简要案情", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        gist: [
          { required: true, message: "请选择串并依据", trigger: ["blur"] }
        ],
        clueTrait: [
          { required: true, message: "请输入线索特征", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        originFile: [
          { required: true, message: "请上传附件", trigger: ["blur"] }
        ],
        mainSpyUnit: [
          {
            required: true,
            message: "请选择主侦单位",
            trigger: ["change", "blur"]
          }
        ],
        cooperateSpyUnit: [
          { required: false, message: "请选择配侦单位", trigger: ["blur"] }
        ],
        spyRequire: [
          { required: false, message: "请输入侦办要求", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        applyInstructions: [
          { required: true, message: "请输入申请说明", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ]
      },
      originFileList: [],
      userId: "",
      token: "",
      createBy: "",
      bkID: "",
      baseUrl: "",
      actionUrl: "",
      curDepList1: [],
      curDepList2: [],
      userList: [], // 主侦单位下的人员
      users: [], // 配侦单位下的人员
      count: "", // 配侦单位下的人员数量
      mainSpyDepId: "", // 主侦部门id
      isOnlyRead: true,
      btnShowFlag: true,
      noDisable: false,
      taskId: '', 
      nodesData: [
        //  流程图节点数据
        {
          id: "node1",
          x: 265,
          y: 208,
          size: [40, 40],
          shape: "image",
          img: processNodeSuccess,
          label: `
                    申请
                    张三  发起申请
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node2",
          x: 423,
          y: 208,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node3",
          x: 670,
          y: 67,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node4",
          x: 670,
          y: 208,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node5",
          x: 670,
          y: 357,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node6",
          x: 830,
          y: 67,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node7",
          x: 830,
          y: 208,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node8",
          x: 830,
          y: 357,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node9",
          x: 990,
          y: 67,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node10",
          x: 990,
          y: 208,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        },
        {
          id: "node11",
          x: 990,
          y: 357,
          size: [40, 40],
          shape: "image",
          img: processNodeDefault,
          label: `
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        }
      ]
    };
  },
  computed: {
    mainSpyUnit() {
      return this.instructForm.mainSpyUnit;
    },
    cooperateSpyUnit() {
      return this.instructForm.cooperateSpyUnit;
    }
  },
  watch: {
    mainSpyUnit(nv) {
      if (nv !== "") {
        this.curDepList2.forEach(item => {
          if (nv === item.name) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
        this.curDepList1.forEach(item => {
          if (nv === item.name) {
            this.mainSpyDepId = item.id;
            this.getUsersByDepIdZhuzhen(this.mainSpyDepId);
          }
        });
      }
    },
    cooperateSpyUnit(nv) {
      if (nv.length > 0) {
        nv.forEach(item => {
          this.curDepList2.forEach(value => {
            if (value.name === item) {
              this.getUsersByDepIdPeizhen(value.id);
            }
          });
        });
      }
    },
    // 判断附件数量是否为0
    originFileList(nv) {
      nv.length === 0? this.instructForm.originFile = "":this.instructForm.originFile = "案源信息附件已上传"
    }
  },
  created() {
    this.taskId = this.$route.query.taskId? this.$route.query.taskId:''
    if (localStorage.getItem("userName")) {
      this.createBy = localStorage.getItem("userName");
    }
    if (localStorage.getItem("realName")) {
      this.instructForm.person = localStorage.getItem("realName");
    }
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    if (localStorage.getItem("userId")) {
      this.userId = localStorage.getItem("userId");
    }
    this.bkID = this.$route.query.id;
    this.getCurDep();
    this.getCurDepAndSubDepIdsAndName();
    if (
      this.$route.query.spyStatus == 0 ||
      this.$route.query.deptType === "zzzlsq"
    ) {
      this.getInformationData();
    }
    if (this.$route.query.statusType) {
      if (this.$route.query.statusType === "2") {
        this.isOnlyRead = false;
        this.noDisable = true;
      } else {
        this.isOnlyRead = true;
        this.noDisable = false;
      }
    }
  },
  mounted() {
    let datas = {
      elements: [
        {
          completed: true,
          current: false,
          id: "startEvent1",
          name: null,
          incomingFlows: [],
          x: 0.0,
          y: 140.50000223517418,
          width: 30.0,
          height: 30.0,
          type: "StartEvent"
        },
        {
          completed: true,
          current: false,
          id: "zzzlsq",
          name: "作战指令申请",
          incomingFlows: ["sid-2721236F-9508-47AC-A0CD-37F2189AE9ED"],
          x: 90.0,
          y: 105.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [
            { name: "Candidate users", value: "jiandan, test7, yinfan" }
          ]
        },
        {
          completed: true,
          current: false,
          id: "zzzlsp",
          name: "作战指令审批",
          incomingFlows: ["sid-34A407F7-A061-460A-B99B-20293663A6CE"],
          x: 435.0,
          y: 105.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Candidate users", value: "shenpi, test6" }]
        },
        {
          completed: true,
          current: false,
          id: "zzzlsh",
          name: "作战指令审核",
          incomingFlows: ["sid-D2670E9D-B9A6-43E6-95C4-DD5E45647CA4"],
          x: 255.0,
          y: 105.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Candidate users", value: "shenhe, test5" }]
        },
        {
          completed: true,
          current: false,
          id: "zzzljs",
          name: "作战指令接收",
          incomingFlows: ["sid-CCCF08DF-7228-41B9-9810-76A8AE1C6EAF"],
          x: 675.0,
          y: 60.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Candidate users", value: "${userList}, test1" }]
        },
        {
          completed: true,
          current: false,
          id: "zzzlfk",
          name: "作战指令反馈",
          incomingFlows: ["sid-805830A1-0119-492B-B2E5-CAD5EF8A4E68"],
          x: 825.0,
          y: 60.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Candidate users", value: "${userList}, test1" }]
        },
        {
          completed: true,
          current: true,
          id: "ldzb",
          name: "落地抓捕",
          incomingFlows: ["sid-D1D82D54-2642-43D3-9CA9-BF742A585EA1"],
          x: 990.0,
          y: 60.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Candidate users", value: "${userList}, test1" }]
        },
        {
          completed: false,
          current: false,
          id: "qrpj",
          name: "确认评价",
          incomingFlows: ["sid-1799B120-D668-47EA-AF15-297B88B402C0"],
          x: 1155.0,
          y: 60.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [{ name: "Assignee", value: "${createBy}" }]
        },
        {
          completed: false,
          current: false,
          id: "end",
          name: "结束",
          incomingFlows: [
            "sid-ABC98A22-2D08-4CB6-B021-EDECA62C04E5",
            "sid-BD2660B6-3F6F-44EE-8086-A023DE822C6D"
          ],
          x: 1195.0,
          y: 270.0,
          width: 28.0,
          height: 28.0,
          type: "EndEvent"
        },
        {
          completed: true,
          current: true,
          id: "peizhen",
          name: "配侦",
          incomingFlows: ["sid-E197A848-D978-4919-AEA5-EAF13A905BB4"],
          x: 630.0,
          y: 165.0,
          width: 100.0,
          height: 80.0,
          type: "UserTask",
          properties: [
            { name: "Assignee", value: "${user}" },
            { name: "Candidate users", value: "test2" }
          ]
        }
      ],
      flows: [
        {
          completed: true,
          current: false,
          id: "sid-2721236F-9508-47AC-A0CD-37F2189AE9ED",
          type: "sequenceFlow",
          sourceRef: "startEvent1",
          targetRef: "zzzlsq",
          waypoints: [
            { x: 29.0, y: 155.0 },
            { x: 60.0, y: 155.0 },
            { x: 60.0, y: 145.0 },
            { x: 90.0, y: 145.0 }
          ]
        },
        {
          completed: true,
          current: false,
          id: "sid-34A407F7-A061-460A-B99B-20293663A6CE",
          type: "sequenceFlow",
          sourceRef: "zzzlsh",
          targetRef: "zzzlsp",
          waypoints: [{ x: 355.0, y: 145.0 }, { x: 435.0, y: 145.0 }]
        },
        {
          completed: false,
          current: false,
          id: "sid-805830A1-0119-492B-B2E5-CAD5EF8A4E68",
          type: "sequenceFlow",
          sourceRef: "zzzljs",
          targetRef: "zzzlfk",
          waypoints: [{ x: 775.0, y: 100.0 }, { x: 825.0, y: 100.0 }]
        },
        {
          completed: true,
          current: false,
          id: "sid-D1D82D54-2642-43D3-9CA9-BF742A585EA1",
          type: "sequenceFlow",
          sourceRef: "zzzlfk",
          targetRef: "ldzb",
          waypoints: [{ x: 925.0, y: 100.0 }, { x: 990.0, y: 100.0 }]
        },
        {
          completed: false,
          current: false,
          id: "sid-1799B120-D668-47EA-AF15-297B88B402C0",
          type: "sequenceFlow",
          sourceRef: "ldzb",
          targetRef: "qrpj",
          waypoints: [{ x: 1090.0, y: 100.0 }, { x: 1155.0, y: 100.0 }]
        },
        {
          completed: false,
          current: false,
          id: "sid-ABC98A22-2D08-4CB6-B021-EDECA62C04E5",
          type: "sequenceFlow",
          sourceRef: "qrpj",
          targetRef: "end",
          waypoints: [
            { x: 1205.0, y: 140.0 },
            { x: 1205.0, y: 205.0 },
            { x: 1208.0, y: 270.0 }
          ]
        },
        {
          completed: true,
          current: false,
          id: "sid-D2670E9D-B9A6-43E6-95C4-DD5E45647CA4",
          type: "sequenceFlow",
          sourceRef: "zzzlsq",
          targetRef: "zzzlsh",
          waypoints: [{ x: 190.0, y: 146.0 }, { x: 255.0, y: 148.0 }]
        },
        {
          completed: false,
          current: false,
          id: "sid-BD2660B6-3F6F-44EE-8086-A023DE822C6D",
          type: "sequenceFlow",
          sourceRef: "peizhen",
          targetRef: "end",
          waypoints: [{ x: 730.0, y: 205.0 }, { x: 1195.0, y: 281.0 }]
        },
        {
          completed: true,
          current: false,
          id: "sid-CCCF08DF-7228-41B9-9810-76A8AE1C6EAF",
          type: "sequenceFlow",
          sourceRef: "zzzlsp",
          targetRef: "zzzljs",
          waypoints: [{ x: 535.0, y: 133.0 }, { x: 675.0, y: 108.0 }]
        },
        {
          completed: false,
          current: false,
          id: "sid-E197A848-D978-4919-AEA5-EAF13A905BB4",
          type: "sequenceFlow",
          sourceRef: "zzzlsp",
          targetRef: "peizhen",
          waypoints: [{ x: 535.0, y: 160.0 }, { x: 630.0, y: 189.0 }]
        }
      ],
      diagramBeginX: 15.0,
      diagramBeginY: 60.0,
      diagramWidth: 1255.0,
      diagramHeight: 298.0,
      completedActivities: [
        "startEvent1",
        "zzzlsq",
        "zzzlsh",
        "zzzlsp",
        "zzzljs",
        "peizhen",
        "peizhen",
        "zzzlfk",
        "ldzb"
      ],
      currentActivities: ["peizhen", "peizhen", "ldzb"],
      completedSequenceFlows: [
        "sid-2721236F-9508-47AC-A0CD-37F2189AE9ED",
        "sid-D2670E9D-B9A6-43E6-95C4-DD5E45647CA4",
        "sid-CCCF08DF-7228-41B9-9810-76A8AE1C6EAF",
        "sid-34A407F7-A061-460A-B99B-20293663A6CE",
        "sid-D1D82D54-2642-43D3-9CA9-BF742A585EA1"
      ]
    };

    let nodes = [];
    let edges = [];
    datas.elements.forEach(item => {
      let currentImg =
        item.current || item.completed
          ? processNodeSuccess
          : processNodeDefault;
      if (item.id !== "startEvent1") {
        nodes.push({
          id: item.id,
          x: item.x,
          y: item.y,
          size: [40, 40],
          shape: "image",
          img: currentImg,
          label: item.name,
          labelCfg: {
            position: "bottom",
            textAlign: "left"
          }
        });
      }
    });
    datas.flows.forEach(item => {
      if (item.sourceRef !== "startEvent1") {
        edges.push({
          source: item.sourceRef,
          target: item.targetRef,
          style: {
            endArrow: true
          }
        });
      }
    });

    //  显示流程图
    const data = {
      //  节点
      nodes: nodes,
      //  连接线
      edges: edges
      // edges: [
      //   {
      //     source: "node1",
      //     target: "node2",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node2",
      //     target: "node3",
      //     shape: "polyline", //  折线
      //     controlPoints: [{ x: 423, y: 67 }], //  折线转折处坐标
      //     style: {
      //       endArrow: true //  连接线结尾箭头
      //     }
      //   },
      //   {
      //     source: "node2",
      //     target: "node4",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node2",
      //     target: "node5",
      //     shape: "polyline",
      //     controlPoints: [{ x: 423, y: 357 }],
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node3",
      //     target: "node6",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node4",
      //     target: "node7",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node5",
      //     target: "node8",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node6",
      //     target: "node9",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node7",
      //     target: "node10",
      //     style: {
      //       endArrow: true
      //     }
      //   },
      //   {
      //     source: "node8",
      //     target: "node11",
      //     style: {
      //       endArrow: true
      //     }
      //   }
      // ]
    };
    const graph = new G6.Graph({
      container: "mountNode",
      width: 1306,
      height: 480,
      nodeStyle: {
        default: {
          fill: "#f7faff", //  节点背景色
          stroke: "#c0ccd7" //  节点边框色
        }
      },
      edgeStyle: {
        default: {
          stroke: "#bfcbd6", //  连接线颜色
          lineWidth: 2
        }
      }
    });
    graph.read(data);
  },
  methods: {
    //文件上传
    originChange(e) {
      let fileList = e.currentTarget.files;
      let that = this;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
        // this.originFileList.push(fileList[0].name);
      } else if (fileList.length > 1) {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
          // this.originFileList.push(fileList[i].name);
        }
      }
      if (fileList !== "") {
        this.instructForm.originFile = "案源信息附件已上传";
      }
      this.$Ajax.form("upload/batch", formData).then(data => {
        console.log("案源信息附件上传", data);
        if (data.data.length > 0) {
          data.data.forEach(item => {
            item.classify = "1";
            that.instructForm.attachments.push(item);
            that.originFileList.push(item);
          });
        }

        //  数组去重
            function uniq(array){
                var temp = []; 
                var _arr = [];
                for(var i = 0; i < array.length; i++){
                    if(temp.indexOf(array[i].fileName) == -1){
                        temp.push(array[i].fileName);
                        _arr.push(array[i])
                    }
                }
                return _arr;
            }
            that.originFileList = uniq(that.originFileList);
      });
    },
    // 文件删除
    deleleFile(item) {
      let that = this;
      let params = {
        id: item.id
      };
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$Ajax
            .post("fightcmd/delAttachments", params, true)
            .then(data => {
              console.log("案源信息附件删除", data);
            });
          let path = "";
          if (!item.fileSavePath) {
            path = "";
          } else {
            path = item.fileSavePath;
          }
          let url = "upload/deleteFile?id=" + item.id + "&fileName=" + item.fileName + "&path=" + path;
          this.$Ajax.post(url, {}, true).then(data => {
            if (data.data === "删除成功") {
              that.originFileList.forEach((ele, index) => {
                if (ele.id === item.id) {
                  that.originFileList.splice(index, 1);
                }
              });
              that.instructForm.attachments.forEach((ele, index) => {
                if (ele.id === item.id) {
                  that.instructForm.attachments.splice(index, 1);
                }
              })
              // 附件列表数组为空
              // if (that.originFileList.length === 0) {
                that.$refs.inp.value = ''
              // }
              that.$message({
                message: "附件删除成功",
                type: "success"
              });
            } else {
              that.$message({
                message: "附件删除失败",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取部门
    getCurDep() {
      let that = this;
      let params = {
        token: this.token
      };
      let url = "/userApi/" + this.userId;
      this.$Ajax.get(url, params).then(data => {
        that.instructForm.unit = data.depName;
      });
    },
    // 获取主侦下的人
    getUsersByDepIdZhuzhen(id) {
      let that = this;
      let params = {
        orgId: id,
        token: this.token
      };
      this.$Ajax.get("/userApi/getUsersByOrgAndRoles", params).then(data => {
        if (data.length > 0) {
          console.log("主侦==========", data);
          data.forEach(item => {
            that.userList.push(item);
          });
        }
      });
    },
    // 获取配侦下的人
    getUsersByDepIdPeizhen(id) {
      let that = this;
      let params = {
        orgId: id,
        token: this.token
      };
      this.$Ajax.get("/userApi/getUsersByOrgAndRolesPZ", params).then(data => {
        if (data.length > 0) {
          console.log("配侦==========", data);
          data.forEach(item => {
            that.users.push(item);
          });
          that.users = that.unqi(that.users);
          console.log("配侦1==========", that.users);
        }
      });
    },
    // 去重
    unqi(arr) {
      let temp = [];
      arr.forEach(item => {
        if (temp.indexOf(item) === -1) {
          temp.push(item);
        }
      });
      return temp;
    },
    // 获取主侦配侦单位
    getCurDepAndSubDepIdsAndName() {
      let that = this;
      let params = {
        token: this.token
      };
      let url = "/orgApi/getCurDepAndSubDepIdsAndName/" + this.userId;
      this.$Ajax.get(url, params).then(data => {
        console.log("datalist", data);
        that.curDepList1 = data;
        that.curDepList1.forEach(item => {
          item.disabled = false;
        });
        that.curDepList2 = [...that.curDepList1];
      });
    },
    getInformationData() {
      this.$Ajax
        .get(
          "fightcmd/cmdDetails",
          { id: this.bkID, createBy: this.createBy },
          true
        )
        .then(res => {
          console.log(res.data.cmdDetails);
          //   if(this.createBy === res.data.cmdDetails.createBy) {
          //       this.noDisable = false
          //   } else {
          //       this.noDisable = true
          //   }
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
          this.instructForm.caseCount = res.data.cmdDetails.caseAmount? res.data.cmdDetails.caseAmount.toString():'';
          this.instructForm.personnel = res.data.cmdDetails.judgmentName;
          this.instructForm.caseType = res.data.cmdDetails.caseTypeName;
          this.instructForm.briefCase = res.data.cmdDetails.caseInfo;
          this.instructForm.gist = res.data.cmdDetails.techEvide.split(",");
          this.instructForm.clueTrait = res.data.cmdDetails.clueFeature;
          this.instructForm.attachments = res.data.cmdDetails.attachments;
          this.mainSpyDepId = res.data.cmdDetails.mainSpyDepId;
          for (var i = 0; i < res.data.cmdDetails.attachments.length; i++) {
            this.originFileList.push(res.data.cmdDetails.attachments[i]);
          }

          //  指定侦办
          this.instructForm.mainSpyUnit = res.data.cmdDetails.mainSpyDepName;
          this.instructForm.cooperateSpyUnit = res.data.cmdDetails.coSpyDepName.split(
            ","
          );
          if (!res.data.cmdDetails.coSpyDepName) {
            this.instructForm.cooperateSpyUnit = [];
          }
          this.instructForm.spyRequire = res.data.cmdDetails.spyRequire;

          this.instructForm.applyInstructions = res.data.cmdDetails.applyDesc;

          res.data.activitiInfoList.data.forEach(item => {
                if (item.taskDefinitionKey === "zzzlsq" & item.hParam.userList !== undefined) {
                    this.userList = item.hParam.userList.split(',');
                    this.users = item.hParam.users;
                    let str1 = this.users.replace('[', '')
                    let str2 = str1.replace(']', '')
                    this.users = str2.replace(' ','').split(',')
                    this.count = item.hParam.count;
                }
            });

          // 流程按钮
          if ((res.data.btn.length > 0) & this.$route.query.deptType) {
            res.data.btn.forEach(item => {
              if (item.taskDefKey === this.$route.query.deptType) {
                this.btnShowFlag = true;
                this.noDisable = false;
              } else {
                this.btnShowFlag = false;
                this.noDisable = true;
              }
            });
          }
        });
    },
    //  引用
    reference() {
      const caseNum = {
        seriesNos: this.instructForm.caseNumber.trim()
      };
      let params = {
        caseNos: this.instructForm.caseNumber.trim()
      };
      if (this.instructForm.caseNumber.trim() === "") {
        this.$message({
          message: "请输入案串编号！",
          type: "warning"
        });
      }
      this.$Ajax
        .post("ssSeriesInfoController/listSeriesByNos", caseNum, true)
        .then(res => {
          console.log(res);
          if (res.data.length === 0) {
            this.$Ajax
              .post("ssSeriesInfoController/listCaseInfoByNos", params, true)
              .then(res => {
                console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbb", res);
                this.instructForm.caseCount = "1";
                this.instructForm.caseName = res.data[0].case_title;
                this.instructForm.briefCase = res.data[0].case_content;
                this.instructForm.caseMeans = res.data[0].crime_method_type;
                this.instructForm.caseType = res.data[0].case_small_type;
                this.isDisableA = true;
                this.$message({
                  message: "案串编号引用成功！",
                  type: "success"
                });
              })
              .catch(err => {
                this.isDisableA = false;
                this.isDisable = false;
                this.instructForm.caseCount = "";
                this.instructForm.caseName = "";
                this.instructForm.briefCase = "";
                this.instructForm.caseMeans = "";
                this.instructForm.caseType = "";
                this.$message({
                  message: "系统未找到对应的串案/案件编号，请手动输入",
                  type: "warning"
                });
              });
          } else {
            this.instructForm.caseCount = res.data[0].caseNum.toString();
            this.instructForm.caseName = res.data[0].seriesName;
            this.isDisable = true;
            this.$message({
              message: "案串编号引用成功！",
              type: "success"
            });
          }
        })
        .catch(err => {});
    },
    submit(formName, num) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitAudit(num);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //  提交审核
    submitAudit(num) {
      let that = this;
      let isCoprStatus = num
      if (this.$route.query.statusType === '0') { 
        isCoprStatus = null // 待办进来时 保存草稿 参数为null
      }
      const audit = {
        taskId: this.taskId,
        id: this.bkID,
        createBy: this.createBy,
        isSeriesed: 1,
        // 'caseTypeCode': '3',
        spyStatus: isCoprStatus, //..提交为 1  ；  保存为  0 ；

        //  指令信息
        insName: this.instructForm.instructName,
        insCode: this.instructForm.instructNumber,
        createDepName: this.instructForm.unit,
        createName: this.instructForm.person,
        createTime: this.instructForm.time,

        //  案源信息
        caseSourceCode: this.instructForm.caseNumber,
        caseSourceName: this.instructForm.caseName,
        meansOfCrime: this.instructForm.caseMeans,
        caseAmount: this.instructForm.caseCount,
        judgmentName: this.instructForm.personnel,
        caseTypeName: this.instructForm.caseType,

        caseInfo: this.instructForm.briefCase,
        techEvide: this.instructForm.gist.join(","),
        clueFeature: this.instructForm.clueTrait,
        caseSourceAttachs: this.instructForm.fileList.join(","),

        //  指定侦办
        mainSpyDepName: this.instructForm.mainSpyUnit,
        mainSpyDepId: this.mainSpyDepId,
        coSpyDepName:
          this.instructForm.cooperateSpyUnit.length === 1
            ? this.instructForm.cooperateSpyUnit[0]
            : this.instructForm.cooperateSpyUnit.join(","),
        spyRequire: this.instructForm.spyRequire,

        //  提交信息
        applyDesc: this.instructForm.applyInstructions,

        //  附件
        attachments: this.instructForm.attachments,
        opinionInfo: {
          userList: this.userList.join(), // 主侦下面人员account 
          users: this.users, // 配侦 
          count: this.users.length // 配侦下用户总个数
        }
      };
      let successMsg = "提交成功！";
      let failMsg = "提交失败！";
      if (num == 0) {
        successMsg = "保存草稿成功！";
        failMsg = "保存草稿失败！";
      }
      console.log("参数参数", audit);
      this.$Ajax.post("fightcmd/cmdApply", audit, true).then(data => {
        console.log(data);
        if (data.data === "success") {
          that.$message({
            message: successMsg,
            type: "success"
          });
          that.$router.push({
            name: "fightManage"
          });
        } else {
          that.$message({
            message: failMsg,
            type: "warning"
          });
        }
      });
    },

    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
      console.log(this.instructForm);
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/AppIns.less";
</style>

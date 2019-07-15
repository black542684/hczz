<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">合成作战申请</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link
                tag="span"
                to="checkSynCom"
                style="display:inline-block;margin-right:10px;"
              >-->
              <el-button
                type="primary"
                size="small"
                @click="submit('instructForm')"
                v-if="isOnlyRead"
              >提交审核</el-button>
              <!-- </router-link> -->
              <el-button type="primary" size="small" @click="keepDraft" v-if="isOnlyRead">保存草稿</el-button>
              <el-button size="small" @click="checkProcess">查看流程</el-button>
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
          <div class="form-title">合成信息</div>
          <el-form-item
            label="合战名称："
            prop="coprName"
            class="instruct-name"
            style="width: 66%;margin-right: 4px;"
          >
            <el-input
              v-model.trim="instructForm.coprName"
              class="instruct-name-input form-ipt-style"
              size="small"
              :disabled="isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="合战编号：" prop="coprCode">
            <div>{{instructForm.coprCode}}</div>
          </el-form-item>
          <el-form-item label="发起单位：" prop="createDepName">
            <div>{{instructForm.createDepName}}</div>
          </el-form-item>
          <el-form-item label="发起人：" prop="createName">
            <div>{{instructForm.createName}}</div>
          </el-form-item>
          <el-form-item label="申请时间：" prop="createTime">
            <div>{{instructForm.createTime}}</div>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">案源信息</div>
          <el-form-item label="案串编号：" prop="caseSourceCode">
            <el-input
              v-model.trim="instructForm.caseSourceCode"
              placeholder="串案/案件编号"
              class="form-ipt-style"
              size="small"
              :disabled="isDisable"
              @keyup.enter="getNumQuery"
            ></el-input>
            <a href="javascript:;" class="btn-quote" @click="getNumQuery">引用</a>
          </el-form-item>
          <el-form-item label="案串名称：" prop="caseSourceName">
            <el-input
              v-model.trim="instructForm.caseSourceName"
              class="form-ipt-style"
              size="small"
              :disabled="disabledFlag || disabledFlagA || isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="作案手段：" prop="meansOfCrime">
            <el-input
              v-model.trim="instructForm.meansOfCrime"
              class="form-ipt-style"
              size="small"
              :disabled="disabledFlagA || isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件数量：" prop="caseAmount">
            <el-input
              v-model.trim="instructForm.caseAmount"
              class="form-ipt-style"
              size="small"
              :disabled="disabledFlag || disabledFlagA || isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="研判人员：" prop="judgmentName">
            <el-input
              v-model.trim="instructForm.judgmentName"
              class="form-ipt-style"
              size="small"
              :disabled="isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="案件类别：" prop="caseTypeName">
            <el-select
              v-model="instructForm.caseTypeName"
              placeholder="请选择案件类别"
              size="small"
              :disabled="disabledFlagA || isDisable"
            >
              <el-option label="盗窃" value="盗窃"></el-option>
              <el-option label="抢劫" value="抢劫"></el-option>
              <el-option label="抢夺" value="抢夺"></el-option>
              <el-option label="诈骗" value="诈骗"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简要案情：" prop="caseInfo" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入简要案情"
              :disabled="disabledFlagA || isDisable"
              v-model="instructForm.caseInfo"
            ></el-input>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="串并依据：" class="origin-checkbox" prop="techEvide">
            <el-checkbox-group v-model="instructForm.techEvide" :disabled="isDisable">
              <el-checkbox label="DNA"></el-checkbox>
              <el-checkbox label="指纹"></el-checkbox>
              <el-checkbox label="视频"></el-checkbox>
              <el-checkbox label="足迹"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="线索特征：" prop="clueFeature" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="isDisable"
              placeholder="请输入线索特征"
              v-model="instructForm.clueFeature"
            ></el-input>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="附件：" class="brief-case-content" prop="originFile">
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="accessoryPlacrholder"
              v-model="instructForm.originFile"
              disabled="disabled"
              style="display: none"
            ></el-input>
            <div class="origin-file-list">
              <span v-show="originFileList.length === 0">{{ accessoryPlacrholder }}</span>
              <ul v-show="originFileList.length !== 0">
                <li v-for="(item,index) in originFileList" :key="index">
                  <span :title="item">{{ item }}</span>
                  <i class="iconfont iconguanbi2"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="originChange" :disabled="isDisable" />
              <div>上传</div>
            </div>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">合成信息</div>
          <el-form-item label="合战部门：" class="compound-info" prop="deptType">
            <el-checkbox-group v-model="instructForm.deptType">
              <el-checkbox
                label="0"
                :class="{ 'checkbox-border': formItemFlag === '0' }"
                :disabled="jzDisable"
              >技侦</el-checkbox>
              <el-checkbox
                label="1"
                :class="{ 'checkbox-border': formItemFlag === '1' }"
                :disabled="wzDisable"
              >网侦</el-checkbox>
              <el-checkbox
                label="2"
                :class="{ 'checkbox-border': formItemFlag === '2' }"
                :disabled="spDisable"
              >视频</el-checkbox>
            </el-checkbox-group>
            <div class="jz" @click="formItemFlag = '0'">技侦</div>
            <div class="wj" @click="formItemFlag = '1'">网侦</div>
            <div class="sp" @click="formItemFlag = '2'">视频</div>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>
          <el-form-item></el-form-item>

          <!-- 技侦 -->
          <el-form-item
            label="技术侦查  查询类别"
            prop="jzQueryType"
            class="br-style"
            v-show="formItemFlag === '0'"
          >
            <el-select
              v-model="instructForm.jzQueryType"
              clearable
              placeholder="请选择技术侦查查询类别"
              size="small"
              :disabled="jzDisable"
            >
              <el-option
                :value="item.name"
                :label="item.name"
                v-for="(item,index) in jzQueryTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" prop="jzQueryContent" v-show="formItemFlag === '0'">
            <el-input
              v-model="instructForm.jzQueryContent"
              placeholder="请输入查询内容"
              size="small"
              :disabled="jzDisable"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="附件："
            class="brief-case-content"
            prop="jzFile"
            v-show="formItemFlag === '0'"
          >
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="accessoryPlacrholder"
              v-model="instructForm.jzFile"
              disabled="disabled"
              style="display: none"
            ></el-input>
            <div class="origin-file-list">
              <span v-show="jzHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
              <ul v-show="jzHzUploadList.length !== 0">
                <li v-for="(item,index) in jzHzUploadList" :key="index">
                  <span :title="item">{{ item }}</span>
                  <i class="iconfont iconguanbi2"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="hcChange('jz')" :disabled="jzDisable" />
              <div>上传</div>
            </div>
          </el-form-item>

          <!-- 网侦 -->
          <el-form-item
            label="网侦侦查  查询类别"
            prop="wzQueryType"
            class="br-style"
            v-show="formItemFlag === '1'"
          >
            <el-select
              v-model="instructForm.wzQueryType"
              clearable
              placeholder="请选择网侦侦查查询类别"
              size="small"
              :disabled="wzDisable"
            >
              <el-option
                :value="item.name"
                :label="item.name"
                v-for="(item,index) in wzQueryTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" prop="wzQueryContent" v-show="formItemFlag === '1'">
            <el-input
              v-model="instructForm.wzQueryContent"
              placeholder="请输入查询内容"
              size="small"
              :disabled="wzDisable"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="附件："
            class="brief-case-content"
            prop="wzFile"
            v-show="formItemFlag === '1'"
          >
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="accessoryPlacrholder"
              v-model="instructForm.wzFile"
              disabled="disabled"
              style="display: none"
            ></el-input>
            <div class="origin-file-list">
              <span v-show="wzHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
              <ul v-show="wzHzUploadList.length !== 0">
                <li v-for="(item,index) in wzHzUploadList" :key="index">
                  <span :title="item">{{ item }}</span>
                  <i class="iconfont iconguanbi2"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="hcChange('wj')" :disabled="wzDisable" />
              <div>上传</div>
            </div>
          </el-form-item>

          <!-- 视频 -->
          <el-form-item
            label="视频侦查  查询类别"
            prop="spQueryType"
            class="br-style"
            v-show="formItemFlag === '2'"
          >
            <el-select
              v-model="instructForm.spQueryType"
              clearable
              placeholder="请选择视频侦查查询类别"
              size="small"
              :disabled="spDisable"
            >
              <el-option
                :value="item.name"
                :label="item.name"
                v-for="(item,index) in spQueryTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" prop="spQueryContent" v-show="formItemFlag === '2'">
            <el-input
              v-model="instructForm.spQueryContent"
              placeholder="请输入查询内容"
              size="small"
              :disabled="spDisable"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="附件："
            class="brief-case-content"
            prop="spFile"
            v-show="formItemFlag === '2'"
          >
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="accessoryPlacrholder"
              v-model="instructForm.spFile"
              disabled="disabled"
              style="display: none"
            ></el-input>
            <div class="origin-file-list">
              <span v-show="spHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
              <ul v-show="spHzUploadList.length !== 0">
                <li v-for="(item,index) in spHzUploadList" :key="index">
                  <span :title="item">{{ item }}</span>
                  <i class="iconfont iconguanbi2"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="hcChange('sp')" :disabled="spDisable" />
              <div>上传</div>
            </div>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">提交信息</div>
          <el-form-item label="申请说明：" prop="createConfirm" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="isDisable"
              placeholder="请输入申请说明"
              v-model="instructForm.createConfirm"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-btn-item" v-if="isOnlyRead">
          <el-form-item>
            <!-- <router-link
              tag="span"
              to="checkSynCom"
              style="display:inline-block;margin-right:10px;"
            >-->
            <el-button type="primary" size="small" @click="submit('instructForm')">提交审核</el-button>
            <!-- </router-link> -->
            <el-button type="primary" size="small" @click="keepDraft">保存草稿</el-button>
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
import UtilService from "../../service/UtilService.js";
import { connect } from "net";
import instructRules from '../../util/hczz/hczzManageMixinRule.js'; // 表单校验规则
export default {
  name: "applySynCom",
  data() {
    return {
      url: {
        getListSeriesUrl: "ssSeriesInfoController/listSeriesByNos",
        uploadUrl: "upload/batch", // 上传文件
        applyUrl: "hcfight/fightApply",
        getInformationUrl: "hcfight/cmdDetails",
        getCurDepUrl: "userApi/"
      },
      isDisable: false, // 退回禁用状态
      jzDisable: false, // 技侦退回禁用状态
      wzDisable: false, // 网侦退回禁用状态
      spDisable: false, // 视频退回禁用状态
      disabledFlag: false, // 案串名称，数量 默认可编辑
      disabledFlagA: false,
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",

      originUploadList: "", // 保存上传附件名称的数组
      attachments: [], // 案源信息附件
      params: {
        id: "",
        createBy: ""
      },
      token: "",
      userId: "",
      instructForm: {
        coprName: "", // 合战名称
        coprCode: "", // 合战编号
        createDepName: "", // 发起单位
        createName: "", // 发起人
        createBy: "",
        createTime: "", // 下发时间

        //  案源信息内容
        caseSourceCode: "", // 案串编号
        caseSourceName: "", // 案串名称
        meansOfCrime: "", // 作案手段
        caseAmount: "", // 案件数量
        judgmentName: "", // 研判人员
        caseTypeName: "", // 案件类别
        caseInfo: "", // 简要案情
        techEvide: [], // 串并依据
        clueFeature: "", // 线索特征
        originFile: "", // 附件

        //  合成信息
        deptType: [], // 合战部门

        jzQueryType: "", // 技术侦查类别
        jzQueryContent: "", // 查询内容
        jzFile: "", // 技侦附件

        wzQueryType: "", // 技术侦查类别
        wzQueryContent: "", // 查询内容
        wzFile: "",

        spQueryType: "", // 技术侦查类别
        spQueryContent: "", // 查询内容
        spFile: "",

        //  提交信息内容
        createConfirm: ""
      },
      formItemFlag: "0",
      coprDepts: [], // 合成信息
      jzUploadFile: [], // 技侦文件
      wzUploadFile: [], // 网侦文件
      spUploadFile: [], // 视频文件
      jzQueryTypeList: [
        { name: "话单(基站位置)查询" },
        { name: "电话名址查询" },
        { name: "电围数据查询" },
        { name: "伴随数据查询" },
        { name: "实时数据查询" }
      ],
      wzQueryTypeList: [
        { name: "QQ号码查询" },
        { name: "微信号码查询" },
        { name: "上网位置查询" },
        { name: "支付宝/微信关联查询" },
        { name: "实时位置查询" }
      ],
      spQueryTypeList: [{ name: "视频侦查查询" }],
      originFileList: [], // 案源信息附件列表
      jzHzUploadList: [], // 技侦附件列表
      wzHzUploadList: [], // 网侦附件列表
      spHzUploadList: [], // 视频附件列表
      coprStatus: 1,
      infos: {},
      jzId: "",
      wzId: "",
      spId: "",
      isOnlyRead: true, // 按钮隐藏
      taskId: "", // 退回id
      isCoprStatus: "1", // 1为正常提交 0为草稿
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
  mixins: [instructRules],
  computed: {
    deptType() {
      return this.instructForm.deptType;
    }
  },
  watch: {
    deptType(nv) {
      if (nv.includes("0")) {
        this.instructRules.jzQueryType[0].required = true;
        this.instructRules.jzQueryContent[0].required = true;
        this.instructRules.jzFile[0].required = true;
      } else {
        this.instructRules.jzQueryType[0].required = false;
        this.instructRules.jzQueryContent[0].required = false;
        this.instructRules.jzFile[0].required = false;
      }
      if (nv.includes("1")) {
        this.instructRules.wzQueryType[0].required = true;
        this.instructRules.wzQueryContent[0].required = true;
        this.instructRules.wzFile[0].required = true;
      } else {
        this.instructRules.wzQueryType[0].required = false;
        this.instructRules.wzQueryContent[0].required = false;
        this.instructRules.wzFile[0].required = false;
      }
      if (nv.includes("2")) {
        this.instructRules.spQueryType[0].required = true;
        this.instructRules.spQueryContent[0].required = true;
        this.instructRules.spFile[0].required = true;
      } else {
        this.instructRules.spQueryType[0].required = false;
        this.instructRules.spQueryContent[0].required = false;
        this.instructRules.spFile[0].required = false;
      }
    }
  },
  created() {
    this.taskId = this.$route.query.taskId ? this.$route.query.taskId : "";
    let nowTime = +new Date();
    this.instructForm.coprCode = "XC" + nowTime;
    this.instructForm.createTime = UtilService.formatDuring(
      nowTime,
      "yyyy-MM-dd HH:mm:ss"
    );
    if (localStorage.getItem("userName")) {
      this.params.createBy = localStorage.getItem("userName");
      this.instructForm.createBy = localStorage.getItem("userName");
    }
    if (
      this.$route.query.coprStatus == 0 ||
      this.$route.query.isback === "back"
    ) {
      this.params.id = this.$route.query.id;
      this.getInformationData();
    }
    if (
      (this.$route.query.isback === "back") &
      (this.$route.query.statusType === "0")
    ) {
      this.isDisable = true;
      if (this.$route.query.deptType === "hczzsqjz") {
        // 技侦可以修改 网侦、视频不可修改
        this.wzDisable = true;
        this.spDisable = true;
      } else if (this.$route.query.deptType === "hczzsqwz") {
        // 网侦可以修改 技侦、视频不可修改
        this.jzDisable = true;
        this.spDisable = true;
      } else if (this.$route.query.deptType === "hczzsqsp") {
        // 视频可以修改 技侦、网侦不可修改
        this.jzDisable = true;
        this.wzDisable = true;
      }
      this.isOnlyRead = true; // 我的待办进来显示按钮
    } else if (
      (this.$route.query.isback === "back") &
      (this.$route.query.statusType !== "0")
    ) {
      this.isDisable = true;
      this.jzDisable = true;
      this.wzDisable = true;
      this.spDisable = true;
      this.isOnlyRead = false; // 我的发起、已办进来 隐藏按钮
    }
    if (localStorage.getItem("realName")) {
      this.instructForm.createName = localStorage.getItem("realName");
    }
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    if (localStorage.getItem("userId")) {
      this.userId = localStorage.getItem("userId");
    }
    this.getCurDep();
  },
  mounted() {
    //  显示流程图
    const data = {
      //  节点
      nodes: this.nodesData,
      //  连接线
      edges: [
        {
          source: "node1",
          target: "node2",
          style: {
            endArrow: true
          }
        },
        {
          source: "node2",
          target: "node3",
          shape: "polyline", //  折线
          controlPoints: [{ x: 423, y: 67 }], //  折线转折处坐标
          style: {
            endArrow: true //  连接线结尾箭头
          }
        },
        {
          source: "node2",
          target: "node4",
          style: {
            endArrow: true
          }
        },
        {
          source: "node2",
          target: "node5",
          shape: "polyline",
          controlPoints: [{ x: 423, y: 357 }],
          style: {
            endArrow: true
          }
        },
        {
          source: "node3",
          target: "node6",
          style: {
            endArrow: true
          }
        },
        {
          source: "node4",
          target: "node7",
          style: {
            endArrow: true
          }
        },
        {
          source: "node5",
          target: "node8",
          style: {
            endArrow: true
          }
        },
        {
          source: "node6",
          target: "node9",
          style: {
            endArrow: true
          }
        },
        {
          source: "node7",
          target: "node10",
          style: {
            endArrow: true
          }
        },
        {
          source: "node8",
          target: "node11",
          style: {
            endArrow: true
          }
        }
      ]
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
    // 获取部门
    getCurDep() {
      let that = this;
      let params = {
        token: this.token
      };
      let url = that.url.getCurDepUrl + this.userId;
      this.$Ajax.get(url, params).then(data => {
        that.instructForm.createDepName = data.depName;
      });
    },
    // 获取信息数据
    getInformationData() {
      let that = this;
      this.$Ajax.get(that.url.getInformationUrl, that.params).then(data => {
        that.infos = data.data.cmdDetails;
        console.warn("是数据啊", data.data);
        that.instructForm.coprName = that.infos.coprName; // 名称
        that.instructForm.coprCode = that.infos.coprCode; // 编号
        that.instructForm.createDepName = that.infos.createDepName; // 发起单位
        that.instructForm.createName = that.infos.createName; // 发起人
        that.instructForm.createTime = that.infos.createTime; // 申请时间

        that.instructForm.caseSourceCode = that.infos.caseSourceCode;
        that.instructForm.caseSourceName = that.infos.caseSourceName;
        that.instructForm.meansOfCrime = that.infos.meansOfCrime;
        that.instructForm.caseAmount = that.infos.caseAmount;
        that.instructForm.judgmentName = that.infos.judgmentName;
        that.instructForm.caseTypeName = that.infos.caseTypeName;
        that.instructForm.caseInfo = that.infos.caseInfo;
        that.instructForm.techEvide = that.infos.techEvide.split(",");
        that.instructForm.clueFeature = that.infos.clueFeature;
        if (that.infos.attachments.length > 0) {
          that.instructForm.originFile = "案源信息附件已上传";
          that.infos.attachments.forEach(item => {
            that.originFileList.push(item.fileName);
            that.attachments.push(item);
          });
        }
        if (that.infos.coprDepts.length > 0) {
          console.warn('信息数据', data.data);
          that.infos.coprDepts.forEach(item => {
            that.instructForm.deptType.push(item.deptType.toString());
            if (item.deptType == 0) {
              that.instructForm.jzQueryType = item.queryType;
              that.instructForm.jzQueryContent = item.queryContent;
              that.jzId = item.id;
              if (item.attachments.length > 0) {
                that.instructForm.jzFile = "技侦附件已上传";
                item.attachments.forEach(item => {
                  that.jzHzUploadList.push(item.fileName);
                  that.jzUploadFile.push(item);
                });
              }
            } else if (item.deptType == 1) {
              that.instructForm.wzQueryType = item.queryType;
              that.instructForm.wzQueryContent = item.queryContent;
              that.wzId = item.id;
              if (item.attachments.length > 0) {
                that.instructForm.wzFile = "网侦附件已上传";
                item.attachments.forEach(item => {
                  that.wzHzUploadList.push(item.fileName);
                  that.wzUploadFile.push(item);
                });
              }
            } else if (item.deptType == 2) {
              that.instructForm.spQueryType = item.queryType;
              that.instructForm.spQueryContent = item.queryContent;
              that.spId = item.id;
              if (item.attachments.length > 0) {
                that.instructForm.spFile = "视频附件已上传";
                item.attachments.forEach(item => {
                  that.spHzUploadList.push(item.fileName);
                  that.spUploadFile.push(item);
                });
              }
            }
          });
        }
        that.instructForm.createConfirm = that.infos.createConfirm;
      }).catch(err => console.error(err));
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isCoprStatus = "1";
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交表单
    submitForm() {
      let that = this;
      that.coprDepts = [];
      that.instructForm.deptType.forEach(item => {
        if (item === "0") {
          that.coprDepts.push({
            deptType: item,
            id: that.jzId,
            queryType: that.instructForm.jzQueryType,
            queryContent: that.instructForm.jzQueryContent,
            attachments: that.jzUploadFile
          });
        } else if (item === "1") {
          that.coprDepts.push({
            deptType: item,
            id: that.wzId,
            queryType: that.instructForm.wzQueryType,
            queryContent: that.instructForm.wzQueryContent,
            attachments: that.wzUploadFile
          });
        } else if (item === "2") {
          that.coprDepts.push({
            deptType: item,
            id: that.spId,
            queryType: that.instructForm.spQueryType,
            queryContent: that.instructForm.spQueryContent,
            attachments: that.spUploadFile
          });
        }
      });
      let params = {
        taskId: that.taskId,
        id: that.params.id,
        coprStatus: that.coprStatus, // 提交 1 or 草稿 0
        // 合成信息
        coprName: that.instructForm.coprName,
        coprCode: that.instructForm.coprCode,
        createDepName: that.instructForm.createDepName,
        createName: that.instructForm.createName,
        createBy: that.instructForm.createBy,
        createTime: that.instructForm.createTime,

        // 案源信息
        caseSourceCode: that.instructForm.caseSourceCode,
        caseSourceName: that.instructForm.caseSourceName,
        meansOfCrime: that.instructForm.meansOfCrime,
        caseAmount: that.instructForm.caseAmount,
        judgmentName: that.instructForm.judgmentName,
        caseTypeName: that.instructForm.caseTypeName,
        caseInfo: that.instructForm.caseInfo,
        techEvide: that.instructForm.techEvide.join(","),
        clueFeature: that.instructForm.clueFeature,
        attachments: that.attachments,

        // 合成信息
        coprDepts: that.coprDepts,

        // 下发说明
        createConfirm: that.instructForm.createConfirm
      };
      let msg = "提交成功";
      let failMsg = "提交失败";
      if (that.isCoprStatus === "0") {
        msg = "保存草稿成功";
        failMsg = "保存草稿失败";
      }
      console.log("参数", params);
      this.$Ajax.post(that.url.applyUrl, params, true).then(data => {
        if (data.data === "success") {
          that.$message({
            message: msg,
            type: "success"
          });
          that.$router.push({
            name: "hczzManage"
          });
        } else {
          that.$message({
            message: failMsg,
            type: "warning"
          });
        }
      });
    },
    // 保存草稿
    keepDraft() {
      if (this.$route.query.statusType === "0") {
        this.coprStatus = null; // 待办进来时 保存草稿 参数为null
      }
      this.isCoprStatus = "0"; // 0 草稿
      this.submitForm();
    },
    // 案源信息附件
    originChange(e) {
      let fileList = e.currentTarget.files;
      let that = this;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
        this.originFileList.push(fileList[0].name);
      } else if (fileList.length > 1) {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
          this.originFileList.push(fileList[i].name);
        }
      }
      if (fileList !== "") {
        this.instructForm.originFile = "案源信息附件已上传";
      }
      this.$Ajax.form(that.url.uploadUrl, formData).then(data => {
        console.log("案源信息附件上传", data);
        if (data.data.length > 0) {
          data.data.forEach(item => {
            item.classify = "3";
            that.attachments.push(item);
          });
          // that.attachments = data.data
        }
      });
    },
    // 合成信息附件
    hcChange(p) {
      let event = window.event || arguments.callee.caller.arguments[0];
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
      this.$Ajax.form(that.url.uploadUrl, formData).then(data => {
        console.log("案源信息附件上传", data);
        if (data.data.length > 0) {
          if (p === "jz") {  // 4
            that.instructForm.jzFile = "技侦附件已上传";    
            that.jzHzUploadList = [];   // 清空需要展示的名字
            data.data.forEach(item => {
              item.classify = "4";
              that.jzUploadFile.push(item);  // 点击提交的时候需要的数据
              that.jzHzUploadList.push(item.fileName);// 展示名字
            });
          } 
          else if (p === "wj") {   // 5
            data.data.forEach(item => {
              item.classify = "5";
              that.wzUploadFile.push(item); // 点击提交的时候需要的数据
            });
            // that.wzUploadFile = data.data
            that.instructForm.wzFile = "网侦附件已上传";
            that.wzHzUploadList = [];
            that.wzUploadFile.forEach(item => {
              that.wzHzUploadList.push(item.fileName);// 展示名字
            });
          } 
          else if (p === "sp") {   // 6
            data.data.forEach(item => {
              item.classify = "6";
              that.spUploadFile.push(item);
            });
            // that.spUploadFile = data.data
            that.instructForm.spFile = "视频附件已上传";
            that.spHzUploadList = [];
            that.spUploadFile.forEach(item => {
              that.spHzUploadList.push(item.fileName);// 展示名字
            });
          }
        }
      });
    },
    // 串并编号查询
    getNumQuery() {
      let that = this;
      let caseNum = {
        seriesNos: that.instructForm.caseSourceCode
      };
      let params = {
        caseNos: that.instructForm.caseSourceCode
      };
      if (that.instructForm.caseSourceCode === "") {
        this.$message({
          message: "请输入案串编号！",
          type: "warning"
        });
      }
      this.$Ajax.post(that.url.getListSeriesUrl, caseNum, true).then(data => {
        console.log("aaaaaaaaaaa", data);
        if (data.data.length > 0) {
          that.instructForm.caseSourceName = data.data[0].seriesName;
          that.instructForm.caseAmount = data.data[0].caseNum;
          that.disabledFlag = true;
          that.$message({
            message: "案串编号引用成功！",
            type: "success"
          });
        } else {
          this.$Ajax
            .post("ssSeriesInfoController/listCaseInfoByNos", params, true)
            .then(res => {
              console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbb", res);
              this.instructForm.caseAmount = 1;
              this.instructForm.caseSourceName = res.data[0].case_title;
              this.instructForm.caseInfo = res.data[0].case_content;
              this.instructForm.meansOfCrime = res.data[0].crime_method_type;
              this.instructForm.caseTypeName = res.data[0].case_small_type;
              this.disabledFlagA = true;
              this.$message({
                message: "案串编号引用成功！",
                type: "success"
              });
            })
            .catch(err => {
              that.disabledFlag = false;
              this.disabledFlagA = false;
              this.instructForm.caseAmount = "";
              this.instructForm.caseSourceName = "";
              this.instructForm.caseInfo = "";
              this.instructForm.meansOfCrime = "";
              this.instructForm.caseTypeName = "";
              this.$message({
                message: "系统未找到对应的串案/案件编号，请手动输入",
                type: "warning"
              });
            });
        }
      });
    },
    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
      // console.log(this.instructForm)
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/AppIns.less";
</style>



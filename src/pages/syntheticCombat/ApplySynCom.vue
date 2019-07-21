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
            prop="name"
            class="instruct-name"
            style="width: 66%;margin-right: 4px;"
          >
            <el-input
              v-model.trim="instructForm.name"
              class="instruct-name-input form-ipt-style"
              size="small"
              :disabled="isDisable"
            ></el-input>
          </el-form-item>
          <el-form-item label="合战编号：" prop="code">
            <div>{{instructForm.code}}</div>
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
              @blur="getNumQuery"
            ></el-input>
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
                <li v-for="(item,index) in jzUploadFile" :key="index">
                  <span :title="item">{{ item.fileName }}</span>
                  <i class="iconfont iconguanbi2" @click="deleleFile(item, null, 4)"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="uploadFiles($event, 4)" :disabled="jzDisable" />
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
                <li v-for="(item,index) in wzUploadFile" :key="index">
                  <span :title="item">{{ item.fileName }}</span>
                  <i class="iconfont iconguanbi2" @click="deleleFile(item, null, 5)"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="uploadFiles($event, 5)" :disabled="wzDisable" />
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
                <li v-for="(item,index) in spUploadFile" :key="index">
                  <span :title="item">{{ item.fileName }}</span>
                  <i class="iconfont iconguanbi2" @click="deleleFile(item, null, 6)"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="uploadFiles($event, 6)" :disabled="spDisable" />
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
import mixinMethods from '../../util/hczz/hczzMixinMethods.js'; // 通用的方法
import hczzURL from '../../util/url/hczzURL';
export default {
  name: "applySynCom",
  mixins: [instructRules, mixinMethods],
  data() {
    return {
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
        name: "", // 合战名称
        code: "", // 合战编号
        createDepName: "", // 发起单位
        createName: "", // 发起人
        createBy: "",   // 当前登入人
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
    this.instructForm.code = "XC" + nowTime;
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
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/AppIns.less";
</style>



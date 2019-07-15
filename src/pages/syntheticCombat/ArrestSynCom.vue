<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">合成作战反馈</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <el-button type="primary" size="small" @click="submit('instructForm')" v-if="btnShowFlag & isOnlyRead">提交</el-button>
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
        <instructions :infos="infos"></instructions>

        <div class="form-item">
          <div class="form-title">审核信息</div>
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

        <div class="form-item" v-if="btnShowFlag & isOnlyRead">
          <div class="form-title">反馈信息</div>
          <el-form-item label="接收部门：">
            <div>{{ receiveDeptName }}</div>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item label="接收人员：">
            <div>{{ receivePeopleName }}</div>
          </el-form-item>
          <el-form-item label="接收时间：">
            <div>{{ receiveTime }}</div>
          </el-form-item>

          <el-form-item label="反馈内容：" prop="feedbackContent" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入反馈内容"
              v-model="instructForm.feedbackContent"
            ></el-input>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>
          <el-form-item label="附件：" class="brief-case-content">
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
                  <span>{{ item }}</span>
                  <i class="iconfont iconguanbi2"></i>
                </li>
              </ul>
            </div>
            <div class="origin-upload">
              <input type="file" multiple @change="originChange">
              <div>上传</div>
            </div>
          </el-form-item>
        </div>

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="btnShowFlag & isOnlyRead">
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              v-show="!isBack"
              @click="submit('instructForm')"
            >提交</el-button>
            <el-button type="warning" size="small" v-show="isBack">退回给审核人</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
      <div class="process-border" id="mountNode"></div>
    </div>
  </div>
</template>

<script>
//  引入流程图插件 AntV/g6
import G6 from "@antv/g6";
//  引入流程图节点图片
import processNodeDefault from "../../../static/image/processNodeDefault.png";
import processNodeSuccess from "../../../static/image/processNodeSuccess.png";

//  引入通用'指令'组件
import instructions from "../../components/SCInstructions.vue";

export default {
  name: "arrestSynCom",
  data() {
    return {
      url: {
        getInformationUrl: "/hcfight/cmdDetails",
        cooperationCheckUrl: "hcfight/fightCooperaeDeptReview",
        uploadUrl: "upload/batch", // 上传文件
        startFeedbackUrl: "/hcfight/fightFeedback"
      },
      params: {
        id: "",
        createBy: ""
      },
      infos: {},
      approveList: [],
      deptType: "",
      deptTypeId: "",
      deptTypeName: '', // 部门名称
      originFileList: [], // 上传文件数组
      attachments: [],
      receiveDeptName: "", // 接收部门
      receivePeopleName: "", // 接收人员
      receiveTime: "", // 接收时间
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      isBack: false, //  是否退回
      instructForm: {
        feedbackContent: "", // 反馈内容
        originFile: "" // 附件
      },
      instructRules: {
        feedbackContent: [
          { required: true, message: "请输入反馈内容", trigger: "blur" },
          { min: 1, max: 200, message: "请输入1-200个字符", trigger: "blur" }
        ],
        originFile: [{ required: true, message: "请上传附件", trigger: "blur" }]
      },
      btnShowFlag: false,
      isOnlyRead: false,
      createByName: '', // 建单人
      taskId: '', // 退回id
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
  components: {
    instructions
  },
  created() {
    this.taskId = this.$route.query.taskId;
    if (localStorage.getItem("userName")) {
      this.params.createBy = localStorage.getItem("userName");
    }
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
    }
    if (this.$route.query.deptType) {
      if (this.$route.query.deptType === "jzbmfk") {
        this.deptType = 0;
        this.deptTypeName = 'jizhen'
      } else if (this.$route.query.deptType === "wzbmfk") {
        this.deptType = 1;
        this.deptTypeName = 'wangzhen'
      } else if (this.$route.query.deptType === "spbmfk") {
        this.deptType = 2;
        this.deptTypeName = 'shipin'
      }
    }
    if (this.$route.query.statusType) {
        if (this.$route.query.statusType === '1' || this.$route.query.statusType === '2') {
          this.isOnlyRead = false
        } else {
          this.isOnlyRead = true
        }
    }
    this.getInformationData();
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
    // 获取信息数据
    getInformationData() {
      let that = this;
      let tempArr = [];
      this.$Ajax
        .get(that.url.getInformationUrl, that.params, true)
        .then(data => {
          that.infos = data.data.cmdDetails;
          that.infos.coprDepts.forEach((item, index) => {
            if (that.deptType === item.deptType) {
              that.$set(item, "showFlag", true);
              tempArr.push(item);
              that.deptTypeId = item.id;
              that.receiveDeptName = item.receiveDeptName;
              that.receivePeopleName = item.receivePeopleName;
              that.receiveTime = item.receiveTime;
              that.instructForm.feedbackContent = item.feedbackContent? item.feedbackContent:''
              if (item.feedbackAttachments.length > 0) {
                that.instructForm.originFile = "附件已上传";
                item.feedbackAttachments.forEach(ele => {
                  that.originFileList.push(ele.fileName)
                })
              }
              that.attachments = item.feedbackAttachments
            }
          });
          that.createByName = that.infos.createBy
          that.infos.coprDepts = tempArr;
          data.data.activitiInfoList.data.forEach(item => {
            if (item.endTime !== null) {
              if (item.hParam.deptTypeName === that.deptTypeName || item.hParam.deptTypeName === 'fqbmsh-main') {
                that.approveList.push(item)
              }
            }
          });
          if (data.data.btn.length > 0) {
            data.data.btn.forEach(item => {
              if (item.taskDefKey === that.$route.query.deptType) {
                that.btnShowFlag = true;
              }
            });
          }
        });
    },
    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
      // console.log(this.instructForm)
    },
    // 附件上传
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
      if (fileList.length > 0) {
        this.instructForm.originFile = "附件已上传";
      } else {
        this.instructForm.originFile = "";
      }
      this.$Ajax.form(that.url.uploadUrl, formData).then(data => {
        console.log("附件上传", data);
        if (data.data.length > 0) {
          data.data.forEach(item => {
            item.classify = "7";
          });
          that.attachments = data.data;
          console.log("附件附件附件", that.attachments);
        }
      });
    },
    // 表单验证提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.startFeedback();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交反馈
    startFeedback() {
      let that = this;
      let params = {
        taskId: that.taskId,
        createBy: that.params.createBy,
        id: that.params.id,
        statusId: that.$route.query.deptType,
        coprDepts: [
          {
            id: that.deptTypeId,
            deptType: that.deptType,
            feedbackContent: that.instructForm.feedbackContent,
            attachments: that.attachments
          }
        ],
        opinionInfo: {
            createBy: that.createByName,         
        }
      };
      this.$Ajax.post(that.url.startFeedbackUrl, params, true).then(data => {
        if (data.data === "success") {
          that.$message({
            message: "部门反馈成功",
            type: "success"
          });
          that.$router.push({
            name: "hczzManage"
          });
        } else {
          that.$message({
            message: "部门反馈失败",
            type: "warning"
          });
        }
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

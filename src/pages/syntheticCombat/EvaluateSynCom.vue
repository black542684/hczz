<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">合成作战确认</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <!-- <router-link tag="span" to style="display:inline-block;margin-right:10px;"> -->
              <el-button type="primary" size="small" v-show="!isBack & btnShowFlag & isOnlyRead" @click="submit('instructForm')">提交</el-button>
              <!-- </router-link> -->
              <el-button type="warning" size="small" v-show="isBack & btnShowFlag & isOnlyRead" @click="submit('instructForm')">退回给反馈人</el-button>
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

            <el-form-item label="审核意见：" class="check-brief-case-content">
              <div>{{ item.hParam.suggest }}</div>
            </el-form-item>
          </div>
        </div>

        <div class="form-item">
          <div class="form-title">反馈信息</div>
          <el-form-item label="接收部门：">
            <div>{{ feedbackObj.receiveDeptName }}</div>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item label="接收人员：">
              <div>{{ feedbackObj.receivePeopleName }}</div>
          </el-form-item>
          <el-form-item label="接收时间：">
              <div>{{ feedbackObj.receiveTime }}</div>
          </el-form-item>

          <el-form-item label="反馈内容：" class="high-check-content">
            <div>{{ feedbackObj.feedbackContent }}</div>
          </el-form-item>
          <el-form-item label="附件：" class="check-brief-case-content">
            <ul class="origin-files clearfix">
                <li v-for="(item,index) in feedbackObj.feedbackAttachments" :key="index">
                    <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
                </li>
            </ul>
          </el-form-item>
        </div>

        <div class="form-item" v-if="btnShowFlag & isOnlyRead">
          <div class="form-title">确认信息</div>
          <el-form-item label="确认结果：" prop="result">
            <el-radio-group v-model="instructForm.result">
              <el-radio label="通过" @change="resultRadio"></el-radio>
              <el-radio label="退回" @change="resultRadio"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 占位 -->
          <el-form-item></el-form-item>

          <el-form-item label="确认意见：" prop="suggest" class="brief-case-content">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入确认意见"
              v-model="instructForm.suggest"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="btnShowFlag & isOnlyRead">
          <el-form-item>
            <el-button type="primary" size="small" v-show="!isBack" @click="submit('instructForm')">确认</el-button>
            <el-button type="warning" size="small" v-show="isBack" @click="submit('instructForm')">退回给反馈人</el-button>
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
  name: "evaluateSynCom",
  data() {
    return {
      url: {
            getInformationUrl: '/hcfight/cmdDetails',
            submitUrl: '/hcfight/fightConfirm'
      },
      params: {
          id: '',
          createBy: ''
      },
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      isBack: false, //  是否退回

      instructForm: {
        //  审批部分
        createName: "",
        result: "通过",
        suggest: ""
      },
      instructRules: {
        result: [
            { required: true, message: "请选择审核结果", trigger: "blur" }
        ],
        suggest: [
          { required: true, message: "请输入审核意见", trigger: "blur" },
          { min: 1, max: 200, message: "请输入1-200个字符", trigger: "blur" }
        ]
      },
      infos: {},
      approveList: [], // 审批过程
      deptType: 0,
      deptTypeName: '', // 部门名称
      feedbackObj: {},
      btnShowFlag: false,
      isOnlyRead: false,
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
      if (localStorage.getItem("userName")) {
        this.params.createBy = localStorage.getItem("userName");
      }
      if (localStorage.getItem("realName")) {
        this.instructForm.createName = localStorage.getItem("realName");
      }
      if(this.$route.query.id) {
          this.params.id = this.$route.query.id
      }
      this.taskId = this.$route.query.taskId
      if (this.$route.query.deptType) {
          if (this.$route.query.deptType === 'jzbmqr') {
              this.deptType = 0
              this.deptTypeName = 'jizhen'
          } else if (this.$route.query.deptType === 'wzbmqr') {
              this.deptType = 1
              this.deptTypeName = 'wangzhen'
          } else if (this.$route.query.deptType === 'spbmqr') {
              this.deptType = 2
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
      this.getInformationData()
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
      let tempArr = []
      this.$Ajax
        .get(that.url.getInformationUrl, that.params, true)
        .then(data => {
          that.infos = data.data.cmdDetails;
          that.infos.coprDepts.forEach((item, index) => {
              if (that.deptType === item.deptType) {
                that.$set(item, "showFlag", true)
                tempArr.push(item)
                that.deptTypeId = item.id
                that.feedbackObj = item
              }
          });
          that.infos.coprDepts = tempArr
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
            console.log('aaaaaaaaa', that.btnShowFlag)
          }
        });
    },
    // 提交
    submit(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.affirm()
        } else {
          console.log('error submit!!')
          return false
        }
      }) 
    },
    // 提交表单
    affirm() {
        let that = this
        let params = {
            createBy: that.params.createBy,
            id: that.params.id,
            statusId: that.$route.query.deptType,
            taskId: that.taskId,
            opinionInfo: {
                deptTypeName: that.deptTypeName,
                createName: that.instructForm.createName,
                result: that.instructForm.result,
                suggest: that.instructForm.suggest
            }
        }
        let msg = '确认成功！'
        let failMsg = '确认失败！'
        if (that.isBack) {
          msg = '退回成功！'
          failMsg = '退回失败！'
        }
        this.$Ajax.post(that.url.submitUrl, params, true).then(data => {
        if (data.data === "success") {
          that.$message({
            message: msg,
            type: "success"
          });
          that.$router.push({
              name: 'hczzManage'
          })
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
      // console.log(this.instructForm)
    },
    // 结果切换
    resultRadio(e) {
      console.log(e);
      e == "退回" ? (this.isBack = true) : (this.isBack = false);
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

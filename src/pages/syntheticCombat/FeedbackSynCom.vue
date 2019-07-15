<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">合成作战接收</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <el-button type="primary" size="small" v-show="!isBack & btnShowFlag & isOnlyRead" @click="reception">接收</el-button>
              <el-button type="warning" size="small" v-show="isBack & btnShowFlag & isOnlyRead">退回给审核人</el-button>
              <el-button size="small" @click="checkProcess">查看流程</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-form
        :inline="true"
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

        <div class="form-btn-item" style="margin-bottom: 40px;" v-if="btnShowFlag & isOnlyRead">
          <el-form-item>
            <!-- <router-link tag="span" to='arrestSynCom' style="display:inline-block;" v-if="!isBack"> -->
            <el-button type="primary" size="small" v-show="!isBack" @click="reception">接收</el-button>
            <!-- </router-link> -->
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
import UtilService from '../../service/UtilService.js'
import { fail } from 'assert';

export default {
  name: "feedbackSynCom",
  data() {
    return {
      taskId: '', // 退回id
      url: {
        getInformationUrl: "/hcfight/cmdDetails",
        cooperationReceptionUrl: "/hcfight/fightAccept",
        getCurDepUrl: '/userApi/'
      },
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      isBack: false, //  是否退回
      params: {
        id: "",
        createBy: ""
      },
      deptType: "",
      deptTypeName: '', // 部门名称
      infos: {},
      approveList: [], // 审批过程
      deptTypeId: '',
      btnShowFlag: false,
      isOnlyRead: false,
      receiveDeptId: '',
      receiveDeptName: '',
      receivePeopleName: '',
      token: '',
      userId: '',
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
    if (localStorage.getItem('userName')) {
      this.params.createBy = localStorage.getItem('userName')
    }
    if (localStorage.getItem('realName')) {
      this.receivePeopleName = localStorage.getItem('realName')
    }
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')
    }
    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId')
    }
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
    }
    if (this.$route.query.deptType) {
      if (this.$route.query.deptType === "jzbmjs") {
        this.deptType = 0;
        this.deptTypeName = 'jizhen'
      } else if (this.$route.query.deptType === "wzbmjs") {
        this.deptType = 1;
        this.deptTypeName = 'wangzhen'
      } else if (this.$route.query.deptType === "spbmjs") {
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
    this.getCurDep()
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
      let that = this
      let params = {
        token: this.token
      }
      let url = that.url.getCurDepUrl + this.userId
      this.$Ajax.get(url, params).then(data => {
        that.receiveDeptId = data.depId
        that.receiveDeptName = data.depName
      })
    },
    // 获取信息数据
    getInformationData() {
      let that = this;
      let tempArr = []
      this.$Ajax
        .get(that.url.getInformationUrl, that.params)
        .then(data => {
          that.infos = data.data.cmdDetails;
          that.infos.coprDepts.forEach((item, index) => {
            if (that.deptType === item.deptType) {
              that.$set(item, "showFlag", true)
              tempArr.push(item)
              that.deptTypeId = item.id
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
                that.btnShowFlag = true
              }
            })
          }
        });
    },
    // 确定
    reception() {
      let that = this
      let params = {
          taskId: that.taskId,
          createBy: that.params.createBy,
          id: that.params.id,
          statusId: that.$route.query.deptType,
          coprDepts: [{
            id: that.deptTypeId,
            // deptType: that.deptType,
            receiveDeptId: that.receiveDeptId, // 接收部门id
            receiveDeptName: that.receiveDeptName, // 接收部门
            receivePeopleId: that.params.createBy, //接收人员id
            receivePeopleName: that.receivePeopleName, // 接收人员
            receiveTime: UtilService.formatDuring(+new Date(), 'yyyy-MM-dd HH:mm:ss') // 接收时间
          }]
      }
      console.log('参数', params)
      this.$Ajax.post(that.url.cooperationReceptionUrl, params, true).then(data => {
        if (data.data === "success") {
          that.$message({
            message: "接收成功",
            type: "success"
          });
          that.$router.push({
            name: "hczzManage"
          });
        } else {
          that.$message({
            message: "接收失败",
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
</style>

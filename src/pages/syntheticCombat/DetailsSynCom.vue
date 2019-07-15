<template>
  <div class="big-box">
    <div class="header-container">
      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">合成作战详情</span>
            <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
          </div>
        </el-col>
        <el-col :span="8" :offset="10">
          <div class="grid-content">
            <el-row class="el-row-right">
              <el-button size="small" @click="checkProcess">查看流程</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-form :inline="true" class="instruct-form form-style" label-width="100px">
        <div class="form-item">
          <div class="form-title">合战信息</div>
          <el-form-item label="合战名称：" prop="coprName" class="instruct-name">
            <div>{{infos.coprName}}</div>
          </el-form-item>
          <el-form-item label="合成编号：" prop="coprNode">
            <div>{{infos.coprNode}}</div>
          </el-form-item>
          <el-form-item label="发起人：" prop="createName">
            <div>{{infos.createName}}</div>
          </el-form-item>
          <el-form-item label="发起单位：" prop="createDepName">
            <div>{{infos.createDepName}}</div>
          </el-form-item>
          <el-form-item label="下发时间：" prop="createTime">
            <div>{{infos.createTime}}</div>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title">案源信息</div>
          <el-form-item label="案串编号：" prop="caseSourceCode">
            <div>{{infos.caseSourceCode}}</div>
          </el-form-item>
          <el-form-item label="案串名称：" prop="caseSourceName">
            <div>{{infos.caseSourceName}}</div>
          </el-form-item>
          <el-form-item label="作案手段：" prop="meansOfCrime">
            <div>{{infos.meansOfCrime}}</div>
          </el-form-item>
          <el-form-item label="案件数量：" prop="caseAmount">
            <div>{{infos.caseAmount}}</div>
          </el-form-item>
          <el-form-item label="研判人员：" prop="judgmentName">
            <div>{{infos.judgmentName}}</div>
          </el-form-item>
          <el-form-item label="案件类别：" prop="caseTypeName">
            <div>{{infos.caseTypeName}}</div>
          </el-form-item>

          <el-form-item
            label="简要案情："
            :title="infos.caseInfo"
            prop="caseInfo"
            class="check-brief-case-content"
          >
            <div>{{infos.caseInfo}}</div>
          </el-form-item>

          <el-form-item label="串并依据：" class="check-brief-case-content">
            <div>{{infos.techEvide}}</div>
          </el-form-item>

          <el-form-item
            label="线索特征："
            prop="clueFeature"
            :title="infos.clueFeature"
            class="check-brief-case-content"
          >
            <div>{{infos.clueFeature}}</div>
          </el-form-item>

          <el-form-item label="附件：" class="check-brief-case-content">
            <ul class="origin-files clearfix">
              <li v-for="(item,index) in infos.attachments" :key="index">
                <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="detail-tabs">
          <span v-for="(item,index) in deptList" 
                :key="index" 
                :class="{ 'active':deptType === item.deptType }"
                @click="changeTabs(item.deptType, item.deptTypeName)">
              {{ item.name }}
          </span>
        </div>
        <div>
          <div class="form-item">
            <div class="form-title mb">合成信息</div>
            <div class="tabs">
              <span>{{ sectionInfos.deptType | deptTypeName }}</span>
            </div>
            <div>
              <el-form-item label="查询类别：" prop="queryType">
                <div>{{ sectionInfos.queryType }}</div>
              </el-form-item>
              <el-form-item label="查询内容：" prop="queryContent">
                <div>{{ sectionInfos.queryContent }}</div>
              </el-form-item>
              <el-form-item label="附件：" class="check-brief-case-content">
                <ul class="origin-files clearfix">
                  <li v-for="(item,i) in sectionInfos.attachments" :key="i">
                    <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
                  </li>
                </ul>
              </el-form-item>
            </div>
          </div>
          <div class="form-item">
            <div class="form-title">审核信息</div>
            <div class="approve-list" v-for="(item,index) in approveList" :key="index">
              <el-form-item label="审核人：" prop="superiorAuditor">
                <div>{{ item.hParam.createName }}</div>
              </el-form-item>
              <el-form-item label="审核结果：" prop="auditorResult">
                <p :class="{ 'success-result': item.hParam.result === '通过' }">{{ item.hParam.result }}</p>
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
              <div>{{ sectionInfos.receiveDeptName }}</div>
            </el-form-item>
            <!-- 占位 -->
            <el-form-item label="接收人员：">
              <div>{{ sectionInfos.receivePeopleName }}</div>
            </el-form-item>
            <el-form-item label="接收时间：">
              <div>{{ sectionInfos.receiveTime }}</div>
            </el-form-item>

            <el-form-item label="反馈内容：" class="high-check-content">
              <div>{{ sectionInfos.feedbackContent }}</div>
            </el-form-item>
            <el-form-item label="附件：" class="check-brief-case-content">
              <ul class="origin-files clearfix">
                <li v-for="(item,index) in sectionInfos.feedbackAttachments" :key="index">
                  <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
                </li>
              </ul>
            </el-form-item>
          </div>
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
import { fail } from "assert";

export default {
  data() {
    return {
      params: {
        id: "",
        createBy: ""
      },
      infos: {},
      approveList: [], // 审批过程
      activitiInfoList: [],
      sectionInfos: {}, // 部门信息
      processIsShow: false, //  流程弹框显示与否
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      isBack: false, //  是否退回
      deptType: "",
      deptList: [], // 部门列表tab
      hcInfos: {},
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
  filters: {
    deptTypeName(value) {
      if (value === 0) {
        return "技侦";
      } else if (value === 1) {
        return "网侦";
      } else if (value === 2) {
        return "视频";
      }
    },
    dateFormat(value) {
      if (value) {
        return UtilService.formatDuring(value, "yyyy-MM-dd HH:mm:ss");
      } else {
        return "";
      }
    }
  },
  created() {
    if (localStorage.getItem("userName")) {
      this.params.createBy = localStorage.getItem("userName");
    }
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
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
      this.$Ajax.get("/hcfight/cmdDetails", that.params, true).then(data => {
        that.infos = data.data.cmdDetails;
        that.infos.coprDepts.forEach((item, index) => {
            if (item.deptType === 0) {
                that.deptList.push({ name: '技侦', deptType: item.deptType, deptTypeName: 'jizhen' })
            } else if (item.deptType === 1) {
                that.deptList.push({ name: '网侦', deptType: item.deptType, deptTypeName: 'wangzhen' })
            } else if (item.deptType === 2) {
                that.deptList.push({ name: '视频', deptType: item.deptType, deptTypeName: 'shipin' })
            }
        });
        let i =  that.deptList[0].deptType
        let v = that.deptList[0].deptTypeName
        that.deptType = i
        that.activitiInfoList = data.data.activitiInfoList.data
        that.changeTabs(i, v)
      });
    },
    // 部门信息tab切换
    changeTabs(deptType, deptTypeName) {
        this.deptType = deptType
        this.approveList = [] // 清空审核信息列表
        this.infos.coprDepts.forEach(item => {
            if (deptType === item.deptType) {
                this.sectionInfos = item
            }
        })
        this.activitiInfoList.forEach(item => {
            if (item.endTime !== null) {
                if (item.hParam.deptTypeName === deptTypeName || item.hParam.deptTypeName === 'fqbmsh-main') {
                    this.approveList.push(item)
                }
            }
        })
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
</style>

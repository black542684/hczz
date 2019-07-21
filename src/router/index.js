import Vue from 'vue'
import Router from 'vue-router'

// import synthesizeExpand from '@/components/serialCase/synthesizeExpand'
const synthesizeExpand = () => import('@/pages/serialCase/synthesizeExpand.vue')
const featureGuidance = () => import('@/pages/serialCase/featureGuidance.vue')

//  研判指令申请
import applyInstructions from '@/pages/militaryInstruction/ApplyInstructions.vue'
//  研判指令审核
import checkInstructions from '@/pages/militaryInstruction/CheckInstructions.vue'
//  研判指令审批
import approveInstructions from '@/pages/militaryInstruction/ApproveInstructions.vue'
//  研判指令接收
import receiveInstructions from '@/pages/militaryInstruction/ReceiveInstructions.vue'
//  研判指令反馈
import feedbackInstructions from '@/pages/militaryInstruction/FeedbackInstructions.vue'
//  研判指令落地抓捕
import arrestInstructions from '@/pages/militaryInstruction/ArrestInstructions.vue'
//  研判指令确认评价
import evaluateInstructions from '@/pages/militaryInstruction/EvaluateInstructions.vue'
//  研判指令详情
import detailsInstructions from '@/pages/militaryInstruction/DetailsInstructions.vue'
//  研判指令管理
import ypManagement from '@/pages/militaryInstruction/YPManagement.vue'
import fightManage from '@/pages/militaryInstruction/fightManage.vue'

// TODO:
// TODO:
//  合成作战管理
import hczzManage from '@/pages/syntheticCombat/hczzManage.vue';
// 合成作战详情页面
import hczzParticulars from '@/pages/syntheticCombat/hczzParticulars.vue';



//  新建预警规则
import newWarning from '@/pages/casesWarning/NewWarning.vue'
//  新建布控
import newMonitor from '@/pages/casesWarning/NewMonitor.vue'
//  布控编辑
import editMonitor from '@/pages/casesWarning/EditMonitor.vue'


// 话单
import modePage from '@/pages/modePage/modePage.vue'


import calllist from '@/pages/calldetail/calllist.vue'// 话单列表
import callrowdetail from '@/pages/calldetail/callrowdetail.vue'// 话单详情
import callfiledconfig from '@/pages/calldetail/callfiledconfig.vue'// 话单字段配置
import callConfederateCollision from '@/pages/calldetail/callConfederateCollision.vue'// 话单同伙碰撞
import oneAnalysis from '@/pages/calldetail/oneAnalysis.vue'// 话单单人分析
import moreAnalysis from '@/pages/calldetail/moreAnalysis.vue'// 话单多人分析callMutual
import callMutual from '@/pages/calldetail/callMutual.vue'// 话单相互通话
import lostOneAnalysis from '@/pages/calldetail/lostOneAnalysis.vue'// 消失号分析单人
import lostMoreAnalysis from '@/pages/calldetail/lostMoreAnalysis.vue'// 消失号分析多人
import callstatistics from '@/pages/calldetail/callstatistics.vue'// 话单统计
import basestationtrial from '@/pages/calldetail/basestationtrial.vue'// 基站轨迹
import calladdresslist from '@/pages/calldetail/calladdresslist.vue'// 通讯录
import basestationmanage from '@/pages/calldetail/basestationmanage.vue'// 基站管理
import basestationselect from '@/pages/calldetail/basestationselect.vue'// 基站分布查询
import importManage from '@/pages/calldetail/importManage.vue'// 导入管理


//案源管理
import caseSourceManage from '@/pages/caseSource/CaseSourceManage.vue'
import caseSource from '@/pages/caseSource/CaseSource.vue'

//线索协查
import clueAssistManage from '@/pages/clueAssistInvestigate/ClueAssistManage.vue';
import clueAssistInvestigate from '@/pages/clueAssistInvestigate/ClueAssistInvestigate';  //查看详情


Vue.use(Router)

export default new Router({
  routes: [
    {   //  案源管理
        path: '/caseSourceManage',
        name: 'caseSourceManage',
        component: caseSourceManage
    },
    {   //  案源流程
        path: '/caseSource',
        name: 'caseSource',
        component: caseSource
    },
    {   //  线索协查管理
        path: '/clueAssistManage',
        name: 'clueAssistManage',
        component: clueAssistManage
    },
    {   //  线索协查流程
        path: '/clueAssistInvestigate',
        name: 'clueAssistInvestigate',
        component: clueAssistInvestigate
    },



    {   //  新建预警规则
      path: '/newWarning',
      name: 'newWarning',
      component: newWarning
    },
    {   //  新建布控
      path: '/newMonitor',
      name: 'newMonitor',
      component: newMonitor
    },
    {   //  布控编辑
        path: '/editMonitor',
        name: 'editMonitor',
        component: editMonitor
    },
    // TODO:
    // TODO:
    {  //  合成作战管理
      path: '/hczzManage',
      name: 'hczzManage',
      component: hczzManage
    },
    { // 合成作战详情页面
      path: '/hczzParticulars',
      name: 'hczzParticulars',
      component: hczzParticulars
    },

    {
      path: '/synthesizeExpand',
      name: 'synthesizeExpand',
      component: synthesizeExpand
    },
    {
      path: '/featureGuidance',
      name: 'featureGuidance',
      component: featureGuidance
    },
    {
      path: '/modePage',
      name: 'modePage',
      component: modePage,
      children: [
        {
          path: '/calllist',
          name: 'calllist',
          component: calllist,
          meta: { page: 'calllist' }
        },
        {
          path: '/callrowdetail',
          name: 'callrowdetail',
          component: callrowdetail,
          meta: { page: 'calllist' }
        },
        {// 同伙碰撞
          path: '/callConfederateCollision',
          name: 'callConfederateCollision',
          component: callConfederateCollision,
          meta: { page: 'calllist' }
        },
        {// 单人分析
          path: '/oneAnalysis',
          name: 'oneAnalysis',
          component: oneAnalysis,
          meta: { page: 'calllist' }
        },
        {// 多人分析
          path: '/moreAnalysis',
          name: 'moreAnalysis',
          component: moreAnalysis,
          meta: { page: 'calllist' }
        },
        {// 消失号单人分析
          path: '/lostOneAnalysis',
          name: 'lostOneAnalysis',
          component: lostOneAnalysis,
          meta: { page: 'calllist' }
        },
        {// 消失号多人分析
          path: '/lostMoreAnalysis',
          name: 'lostMoreAnalysis',
          component: lostMoreAnalysis,
          meta: { page: 'calllist' }
        },
        {// 相互通话
          path: '/callMutual',
          name: 'callMutual',
          component: callMutual,
          meta: { page: 'calllist' }
        },
        {// 话单统计
          path: '/callstatistics',
          name: 'callstatistics',
          component: callstatistics,
          meta: { page: 'calllist' }
        },
        {// 基站轨迹
          path: '/basestationtrial',
          name: 'basestationtrial',
          component: basestationtrial,
          meta: { page: 'calllist' }
        },
        {// 基站管理
          path: '/basestationmanage',
          name: 'basestationmanage',
          component: basestationmanage,
          meta: { page: 'calllist' }
        },
        {// 基站分布查询
          path: '/basestationselect',
          name: 'basestationselect',
          component: basestationselect,
          meta: { page: 'calllist' }
        },
        {// 通讯录
          path: '/calladdresslist',
          name: 'calladdresslist',
          component: calladdresslist,
          meta: { page: 'calllist' }
        },
        {// 导入管理 callfiledconfig
          path: '/importManage',
          name: 'importManage',
          component: importManage,
          meta: { page: 'importManage' }
        },
        {// 导入管理
          path: '/callfiledconfig',
          name: 'callfiledconfig',
          component: callfiledconfig,
          meta: { page: 'callfiledconfig' }
        }
      ]
    },


    {   //  研判指令申请
        path: '/applyInstructions',
        name: 'applyInstructions',
        component: applyInstructions
    },
    {   //  研判指令审核
      path: '/checkInstructions',
      name: 'checkInstructions',
      component: checkInstructions
    },
    {   //  研判指令审批
      path: '/approveInstructions',
      name: 'approveInstructions',
      component: approveInstructions
    },
    {   //  研判指令接收
      path: '/receiveInstructions',
      name: 'receiveInstructions',
      component: receiveInstructions
    },
    {   //  研判指令反馈
      path: '/feedbackInstructions',
      name: 'feedbackInstructions',
      component: feedbackInstructions
    },
    {   //  研判指令落地抓捕
      path: '/arrestInstructions',
      name: 'arrestInstructions',
      component: arrestInstructions
    },
    {   //  研判指令确认评价
      path: '/evaluateInstructions',
      name: 'evaluateInstructions',
      component: evaluateInstructions
    },
    {   //  研判指令详情
      path: '/detailsInstructions',
      name: 'detailsInstructions',
      component: detailsInstructions
    },
    {
        //  研判指令管理
        path: '/ypManagement',
        name: 'ypManagement',
        component: ypManagement
    },
    {
      //  研判指令管理
      path: '/fightManage',
      name: 'fightManage',
      component: fightManage
    }
  ],
  //   mode: 'history'
})

export default {
  data() {
    return {
      //    线索协查数据
      ayData:{
        //   基本信息
        name:'',
        code:new Date().getTime(),
        createTime:'',
        createDepName:'',
        createName: localStorage.getItem("realName"), // 申请人
        //  中间固定信息
        caseSourceCode:'',
        caseSourceName:'',
        meansOfCrime:'',
        caseAmount:'',
        judgmentName:'',
        caseTypeName:'',
        caseInfo:'',
        techEvide:[],
        clueFeature:'',
        attachments: [],
        originFile:'',// 判定附件是否上传的数据
        //  提交审核
        level:'区县',
        cxdw:'',
        applyDesc:'',
        fileList:[],//保存回显的数据列表
        userList:'',    //  用户列表（下级审批人）
      },
      //  线索协查审核数据
      shData: {
        shr: localStorage.getItem("realName"),
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
      //  线索协查数据
      cxdwStatus: false,
      //  查询单位市局
      shiju: "",
      shijuID: "",
      quxianList: [],
      queryUnitBy: "",
      fkInfoList: [],
      fkFJInfoList: [],
      sjfkInfoList: [],
      sjfkFJInfoList: [],
      //  线索协查审核数据
      changeTitle: "线索协查申请", //..title
      processIsShow: false, //  流程弹框显示与否
      chartData: "", // 流程图数据
      isData: false, //  控制流程图只渲染一次
      //   申请提交需要上传的数据（从管理页面拿到的数据）
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
      originFileList: [], //  申请上传附件列表
    }
  }
}
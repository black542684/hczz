import moment from 'moment';
export default {
  data() {
    return {
      // 公共可以使用的数据
      createBy: localStorage.getItem("userName"),
      id: this.$route.query.id || null,
      modeType: "4",   // 4合战
      taskKey: "取详情接口中taskList对应的statusId",
      taskId: "取详情接口中taskList对应的taskId",
      procId: this.$route.query.procInstId || null,
      // 申请时候用的
      hczzData: {
        id: this.$route.query.id || null,
        createBy: localStorage.getItem("userName"),   // 当前登入人
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 下发时间
          // 基本信息
        name: "", // 合战名称
        code: new Date().getTime(), // 合战编号
        createDepName: "", // 发起单位
        createName: localStorage.getItem('realName'), // 发起人
        applyDesc: "",  // 提请需求
        //  案源信息内容
        caseSourceCode: "", // 案件编号
        caseSourceName: "", // 案件名称
        meansOfCrime: "", // 作案手段
        caseAmount: "", // 案件数量
        judgmentName: "", // 研判人员
        caseTypeName: "", // 案件类别
        caseInfo: "", // 简要案情
        techEvide: [], // 串并依据
        clueFeature: "", // 线索特征
        originFile: "", // 附件，用来进行表单校验
        attachments: [], // 案源信息的附件
        //  合成信息
        coprDepts: [ // 合战部门，6个部门的数据存放在这里
          {
            deptType: "0",
            queryType: "",
            queryContent: "",
            deptTypeName: '技侦',
            attachments: []
          },
          {
            deptType: "1",
            queryType: "",
            queryContent: "",
            deptTypeName: '网安',
            attachments: []
          },
          {
            deptType: "2",
            queryType: "",
            queryContent: "",
            deptTypeName: '刑侦',
            attachments: []
          },
          {
            deptType: "3",
            queryType: "",
            queryContent: "",
            deptTypeName: '经侦',
            attachments: []
          },
          {
            deptType: "4",
            queryType: "",
            queryContent: "",
            deptTypeName: '反恐',
            attachments: []
          },
          {
            deptType: "5",
            queryType: "",
            queryContent: "",
            deptTypeName: '治安',
            attachments: []
          }
        ], 


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
      // 审核时候用的
      auditData: {
        createName: localStorage.getItem('realName'),
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        createBy: localStorage.getItem("userName"),
        depName: "",
        back: '',
        suggest: "",
        result: "通过",
        returnType: 2,
        jizhen: "0", 
        wangzhen: "0",
        shipin: "0",
        fankong: "0",
        zhian: "0",
        jingzhen: "0",
      },
      // 取交集的时候使用
      controllerData: {
        hczz_waqr: {
          //合成作战-网安确认
          show: false,
          edit: false
        },
        hczz_xzjs: {
          //合成作战-刑侦接收
          show: false,
          edit: false
        },
        hczz_jizqr: {
          //合成作战-技侦确认
          show: false,
          edit: false
        },
        hczz_jizsh: {
          //合成作战-技侦审核
          show: false,
          edit: false
        },
        hczz_jingzsh: {
          //合成作战-经侦审核
          show: false,
          edit: false
        },
        hczz_zajs: {
          //合成作战-治安接收
          show: false,
          edit: false
        },
        hczz_xzsh: {
          //合成作战-刑侦审核
          show: false,
          edit: false
        },
        hczz_jingzfk: {
          //合成作战-经侦反馈
          show: false,
          edit: false
        },
        hczz_jingzjs: {
          //合成作战-经侦接收
          show: false,
          edit: false
        },
        hczz_zaqr: {
          //合成作战-治安确认
          show: false,
          edit: false
        },
        hczz_jingzqr: {
          //合成作战-经侦确认
          show: false,
          edit: false
        },
        hczz_zash: {
          //合成作战-治安审核
          show: false,
          edit: false
        },
        hczz_xzfk: {
          //合成作战-刑侦反馈
          show: false,
          edit: false
        },
        hczz_fkgbjs: {
          //合成作战-反恐国保审接收
          show: false,
          edit: false
        },
        hczz_jizjs: {
          //合成作战-技侦接收
          show: false,
          edit: false
        },
        hczz_zafk: {
          //合成作战-治安反馈
          show: false,
          edit: false
        },
        hczz_fkgbqr: {
          //合成作战-反恐国保确认
          show: false,
          edit: false
        },
        hczz_wash: {
          //合成作战-网安审核
          show: false,
          edit: false
        },
        hczz_fqbmsp: {
          //合成作战-发起部门审批
          show: false,
          edit: false
        },
        hczz_wafk: {
          //合成作战-网安反馈
          show: false,
          edit: false
        },
        hczz_fqsq: {
          //合成作战-发起申请
          show: false,
          edit: false
        },
        hczz_fkgbsh: {
          //合成作战-反恐国保审核
          show: false,
          edit: false
        },
        hczz_jizfk: {
          //合成作战-技侦反馈
          show: false,
          edit: false
        },
        hczz_wajs: {
          //合成作战-网安接收
          show: false,
          edit: false
        },
        hczz_fkgbfk: {
          //合成作战-反恐国保反馈
          show: false,
          edit: false
        },
        hczz_xzqr: {
          //合成作战-刑侦确认
          show: false,
          edit: false
        }
      },
      // 反馈时候使用
      feedbackData: {
        id: '', 
        deptType: "0",
        feedbackContent: "",
        attachments: [],
        originFile: '',
      },
      // 展示反馈数据
      showFeedbackData: []
    }
  }
}
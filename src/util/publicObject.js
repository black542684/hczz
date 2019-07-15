// applyData 需要的数据
const myData = {
  createDepId: null, //申请单位id
  isSeriesed: 0, //是否系列案
  caseTypeCode: null, //  案件类型编码
  judgmentBy: null, //  研判人员id
  reviewBy: null, //  上级审核人id
  reviewName: null, //  上级审核人姓名
  excute: null,
  unitType: 0,
  queryUnitBy: null, //查询单位id
  queryUnitName: null, //查询单位名称
};

//  线索协查审核数据
const shData = {
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
};

//  title名称动态数据 - 基本信息
const titleList01 = {
  formName: "基本信息",
  name: "协查名称：",
  number: "协查编号：",
  time: "下发时间：",
  unit: "申请单位：",
  person: "申请人："
};

//  title名称动态数据 - 线索协查信息
const titleList02 =  {
  formName: "协查信息",
  number: "案件编号：",
  name: "案件名称："
};

export { myData, shData, titleList01, titleList02 };
// 合成作战url
export default {
  getListSeries: 'ssSeriesInfoController/listSeriesByNos', // 案串编号查询
  upload: "upload/batch", // 上传文件
  apply: "hcfight/fightApply",  // 合战申请
  getInformation: "hcfight/cmdDetails",  // 获取详情信息
  getCurDep: "userApi/",  //  通过ID获取部门
  cooperationCheck: "hcfight/fightCooperaeDeptReview",   // 提交审核
  startFeedback: "/hcfight/fightFeedback",  // 反馈
  submitUrl: '/hcfight/fightConfirm',   // 确认提交表单
  getListData: "/hcfight/fightList",    // 获取列表数据
  getNum: "/hcfight/fightListTotal",    // 数量
  getUserInfos: '/userApi/getUserLoginInfoByToken',   // 获取登入人的信息
  getStatusList: '/hcfight/getStatusList',   //  获取侦办状态（草稿，待审核。。。）
}
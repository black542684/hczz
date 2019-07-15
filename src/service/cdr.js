import $ajax from './api'

/* --------------start话单设置---------------- */
// 模板
// 创建模板
export const createSingleTemplate = function (param) {
  return $ajax.postParams('singleAnalysisConnect/createSingleTemplate', param)
}
// 查询模板列表
export const checkSingleTemplate = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkSingleTemplate', param)
}
// 模板状态
export const singleTemplateSwitch = function (param) {
  return $ajax.postParams('singleAnalysisConnect/singleTemplateSwitch', param)
}

// 字段
// 添加字段
export const singleTemplateField = function (param) {
  return $ajax.postParams('singleAnalysisConnect/singleTemplateField', param)
}
// 查询字段列表
export const checkSingleTemplateList = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkSingleTemplateList', param)
}
// 字段列表排序
export const updateSingleFieldSort = function (param) {
  return $ajax.postParams('singleAnalysisConnect/updateSingleFieldSort', param)
}

// 获取可选字段
export const checkTemplateFieldPoolList = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkTemplateFieldPoolList', param)
}

// 通用控制开关
export const singleTemplateFieldSwitch = function (param) {
  return $ajax.postParams('singleAnalysisConnect/singleTemplateFieldSwitch', param)
}
// 字段是否排序
export const singleTemplateFieldSortSwitch = function (param) {
  return $ajax.postParams('singleAnalysisConnect/singleTemplateFieldSortSwitch', param)
}
// 默认排序列表获取
export const checkSortList = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkSortList', param)
}
// 默认排序
export const templateGlobalConfigurationSort = function (param) {
  return $ajax.postParams('singleAnalysisConnect/templateGlobalConfigurationSort', param)
}

// 查询合并字段接口
export const checkMergeField = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkMergeField', param)
}
// 合并字段
export const mergeField = function (param) {
  return $ajax.postParams('singleAnalysisConnect/mergeField', param)
}
// 删除合并字段 singleAnalysisConnect/deleteMergeFieldEntityByid
export const deleteMergeFieldEntityByid = function (param) {
  return $ajax.postParams('singleAnalysisConnect/deleteMergeFieldEntityByid', param)
}
// 查询时间类型列表
export const checkTimeType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkTimeType', param)
}
// 添加时间类型 singleAnalysisConnect/timeType
export const timeType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/timeType', param)
}
// 时间类型修改
export const updateTimeType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/updateTimeType', param)
}
// 删除时间类型
export const deleteTimeTypeByid = function (param) {
  return $ajax.postParams('singleAnalysisConnect/deleteTimeTypeByid', param)
}

// 查询时长类型列表
export const checkTimeLengthType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/checkTimeLengthType', param)
}
// 添加时长类型
export const timeLengthType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/timeLengthType', param)
}
// 时长类型修改
export const updateTimeLengthType = function (param) {
  return $ajax.postParams('singleAnalysisConnect/updateTimeLengthType', param)
}
// 删除时长类型
export const deleteTimeLengthTypeByid = function (param) {
  return $ajax.postParams('singleAnalysisConnect/deleteTimeLengthTypeByid', param)
}
// 删除字段
export const deleteSingleTemplateField = function (param) {
  return $ajax.postParams('singleAnalysisConnect/deleteSingleTemplateField', param)
}

/* --------------end话单设置---------------- */
/* --------------start话单分析---------------- */
// 话单分析列表查询
export const searchCallList = function (param) {
  return $ajax.postParams('callListAanlysis/searchCallList', param)
}
// 话单详情
export const callDetailList = function (param) {
  return $ajax.postParams('callListAanlysis/callDetailList', param)
}

// 话单上传提交回传接口
export const reloadFile = function (param) {
  return $ajax.postParams('callListAanlysis/reloadFile', param)
}
// 获取话单配置文件列表
export const getSingleConfigList = function (param) {
  return $ajax.postParams('SingleConfiguration/getSingleConfigList', param)
}
// 导入话单完成 callListAanlysis/saveTemplet
export const saveTemplet = function (param) {
  return $ajax.postParams('callListAanlysis/saveTemplet', param)
}
// 保存配置字段 SingleConfiguration/saveSingleConfig
export const saveSingleConfig = function (param) {
  return $ajax.postParams('SingleConfiguration/saveSingleConfig', param)
}
// 根据配置文件id获取配置文件内容 SingleConfigurationDetail/getSingleConfigDetailListByConfigId
export const getSingleConfigDetailListByConfigId = function (param) {
  return $ajax.postParams('SingleConfigurationDetail/getSingleConfigDetailListByConfigId', param)
}

// 同伙碰撞
export const callCollision = function (param) {
  return $ajax.postParams('callListAanlysis/callCollision', param)
}

// 相互通话
export const searchCallTalkList = function (param) {
  return $ajax.postParams('callTalkAanlysis/searchCallTalkList', param)
}

// 新号分析
// 单人分析
export const getNewNumberAnalysisList = function (param) {
  return $ajax.postParams('newNumberAnalysis/getNewNumberAnalysisList', param)
}
// 多人分析
export const getMoreNewNumberAnalysisList = function (param) {
  return $ajax.postParams('newNumberAnalysis/getMoreNewNumberAnalysisList', param)
}

// 消失号分析
// 单人分析
export const getLostNumberAnalysisList = function (param) {
  return $ajax.postParams('lostNumberAnalysis/getLostNumberAnalysisList', param)
}
// 多人分析
export const getMoreLostNumberAnalysisList = function (param) {
  return $ajax.postParams('lostNumberAnalysis/getMoreLostNumberAnalysisList', param)
}

// 相互通话次数详情
export const searchCallTalkDetail = function (param) {
  return $ajax.postParams('callTalkAanlysis/searchCallTalkDetail', param)
}

// 通话次数详情
export const getPartnerDetailList = function (param) {
  return $ajax.postParams('callListAanlysis/getPartnerDetailList', param)
}
// 删除单个话单
export const deleteCallListById = function (param) {
  return $ajax.postParams('callListAanlysis/deleteCallListById', param)
}

/* --------------end话单分析---------------- */
/* --------------start话单统计---------------- */
// 通话次数前10位
export const getCountCallList = function (param) {
  return $ajax.postParams('callListAanlysis/getCountCallList', param)
}
// 通话时长前10位
export const getCallLengthList = function (param) {
  return $ajax.postParams('callListAanlysis/getCallLengthList', param)
}
// 最后10次通话记录
export const getLastTenTimeCallList = function (param) {
  return $ajax.postParams('callListAanlysis/getLastTenTimeCallList', param)
}
// 首现尾现统计
export const getFirstOrLastCountList = function (param) {
  return $ajax.postParams('callListAanlysis/getFirstOrLastCountList', param)
}
// 获取通话时间分布数据接口
export const getCallTimeDistribution = function (param) {
  return $ajax.postParams('callListAanlysis/getCallTimeDistribution', param)
}
// 发案时间筛选数据接口
export const getCaseDataRangeData = function (param) {
  return $ajax.postParams('callListAanlysis/getCaseDataRangeData', param)
}
// 0-24时的通话记录 callListAanlysis/getCallRecords
export const getCallRecords = function (param) {
  return $ajax.postParams('callListAanlysis/getCallRecords', param)
}
// 互发短信前10位
export const getCountSMSList = function (param) {
  return $ajax.postParams('callListAanlysis/getCountSMSList', param)
}
// 基站统计
export const getBaseStationList = function (param) {
  return $ajax.postParams('callListAanlysis/getBaseStationList', param)
}
// 通话地点统计
export const getAddressList = function (param) {
  return $ajax.postParams('callListAanlysis/getAddressList', param)
}

/* --------------end话单统计---------------- */
/* --------------start基站轨迹---------------- */
// 时空分析打点接口
export const getSpaceTimeAnalysisData = function (param) {
  return $ajax.postParams('callListAanlysis/getSpaceTimeAnalysisData', param)
}
// 时空分析地图点指向下一个点
export const getPointDataList = function (param) {
  return $ajax.postParams('callListAanlysis/getPointDataList', param)
}
// 详情打点
export const getSingleDetailSpaceTimeAnalysisData = function (param) {
  return $ajax.postParams('callListAanlysis/getSingleDetailSpaceTimeAnalysisData', param)
}
// 详情点连接
export const getSingleDetailPointDataList = function (param) {
  return $ajax.postParams('callListAanlysis/getSingleDetailPointDataList', param)
}
// 基站管理
export const searchBaseStationList = function (param) {
  return $ajax.postParams('baseStationManager/searchBaseStationList', param)
}
// 基站管理修改
export const updateBaseStation = function (param) {
  return $ajax.postParams('baseStationManager/updateBaseStation', param)
}
// 自动更新
export const updateBaseStationByIdOrType = function (param) {
  return $ajax.postParams('baseStationManager/updateBaseStationByIdOrType', param)
}
// 基站分布查询接口
export const searchDistributionOfBaseStation = function (param) {
  return $ajax.postParams('baseStationManager/searchDistributionOfBaseStation', param)
}
/* --------------end基站轨迹---------------- */



// 导入管理页面
// 修改配置启用状态  SingleConfiguration/updateSingleConfigStatusById
export const updateSingleConfigStatusById = function (param) {
  return $ajax.postParams('SingleConfiguration/updateSingleConfigStatusById', param)
}

// 删除导入管理
export const deleteSingleConfigStatusById = function (param) {
  return $ajax.postParams('SingleConfiguration/deleteSingleConfigStatusById', param)
}
// 删除导入管理
export const getPermission = function (param) {
  return $ajax.get('/permissionApi/getButtons', param)
}

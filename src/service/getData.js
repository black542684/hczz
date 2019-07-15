import $ajax from './api'

// 节点关系查询 http://localhost:8080/judgement/dgraphOperateController/queryRelationByUKs
export const queryRelationByUKs = function (param) {
  return $ajax.post('dgraphOperateController/queryRelationByUKs', param)
}

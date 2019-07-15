import {jsplumbfuns} from './jsplumbApi'

// 本地绘制的画布数据 节点均有relationdata属性，存储相关节点信息
// 但画布保存时 没有存储节点的relationdata数据
// 处理 后台保存的画布数据为所需格式 b
function getCanvasNeedData (nodes, links) {
  let nodeObj = {}
  nodes.forEach(element => {
    nodeObj[element.uid] = Object.assign({}, element)
  })
  links.forEach(connect => {
    connect.sourceClass = nodeObj[connect['source']].nodeclassify
    connect.targetClass = nodeObj[connect['target']].nodeclassify
  })
  nodes.forEach(element => {
    element.relationdata = []
    let relationConnectarr
    relationConnectarr = links.filter(linkItem => element.uid === linkItem.source)
    relationConnectarr.forEach(linkItem => {
      let relationItem = nodeObj[linkItem['target']]
      relationItem.relationtype = linkItem.relationcode
      relationItem.relationname = linkItem.relationname
      element.relationdata.push(relationItem)
    })
  })
  return {
    nodes: nodes,
    links: links
  }
}

// 设置已存在节点可连线 可作为source target
function setNodeCanlink (nodeId) {
  jsplumbfuns.globalJsPlumb.setSourceEnabled(nodeId, true)
  jsplumbfuns.globalJsPlumb.setTargetEnabled(nodeId, true)
}
// 设置已存在节点不可连线 可作为source target
function setNodeNolink (nodeId) {
  jsplumbfuns.globalJsPlumb.setSourceEnabled(nodeId, false)
  jsplumbfuns.globalJsPlumb.setTargetEnabled(nodeId, false)
}

// 获取连线配置对象
function getoverlayConfig (connector) {
  // 连线配置
  return {
    anchor: 'Continuous',
    overlays: [
      // "Arrow",
      // [ 'Arrow', { width: 10, length: 10, location: 1, id: 'arrow' } ],
      // [ "Label", { location:80, id:elementId+labalVal } ],
      [ 'Label',
        {
          label: connector.relationaliasname || '自定义',
          location: 0.5,
          id: connector.source + '_Label'
        } ]
    ],
    paintStyle: {
      strokeWidth: 1,
      stroke: 'rgba(51,51,51,1)'
    },
    detachable: false
    // connector: ['Straight']
  }
}

//  处理items connectarr 为 保存画布所需格式
function getSavecanvasData (canvasId) {
  let itemsData = window.localStorage.getItem(canvasId + '_entityarr')
  let connectData = window.localStorage.getItem(canvasId + '_connectarr')

  itemsData = JSON.parse(itemsData) || []
  connectData = JSON.parse(connectData) || []
  let nodearr = itemsData.map(function (nodeItem) {
    let tmpObj = {
      canvasid: canvasId,
      uid: nodeItem.uid,
      showname: nodeItem.showname,
      uniquekey: nodeItem.uniquekey,
      nodeclassify: nodeItem.nodeclassify,
      nodetype: nodeItem.nodetype,
      x: nodeItem.x,
      y: nodeItem.y,
      img_id: nodeItem.img_id || '', // 图片id
      width: nodeItem.width, // 节点宽度
      height: nodeItem.height // 节点高度
    }
    return tmpObj
  })
  let linkarr = connectData.map(function (nodeItem) {
    return {
      canvasid: canvasId,
      source: nodeItem.source,
      relationcode: nodeItem.relationcode,
      relationname: nodeItem.relationname,
      relationaliasname: nodeItem.relationaliasname,
      target: nodeItem.target
    }
  })

  return {
    canvasid: canvasId,
    nodes: nodearr,
    links: linkarr
  }
}

function one () {
  console.log('one', this)
}

export {getCanvasNeedData, getSavecanvasData, one}

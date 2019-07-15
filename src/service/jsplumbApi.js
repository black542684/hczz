import jsPlumb from 'jsplumb'

// const globalJsPlumb = jsPlumb.jsPlumb
// const globalJsPlumb =
// const otherJsPlumb = jsPlumb.jsPlumb.getInstance()
export const jsplumbfuns = {
  globalJsPlumb: jsPlumb.jsPlumb.getInstance(),
  // otherJsPlumb: otherJsPlumb,
  init: function () {
    // globalJsPlumb.ready(function () {
    // this.globalJsPlumb.setContainer('drawcontainer')
    this.globalJsPlumb.importDefaults({
      DragOptions: { cursor: 'crosshair' },
      Endpoint: 'Dot',
      EndpointStyle: { fill: 'transparent', radius: 5 },
      EndpointHoverStyle: {fill: '#2D8CF0'},
      HoverPaintStyle: {strokeWidth: 1, stroke: '#2D8CF0'},
      Connector: 'Straight'
      // ConnectionsDetachable: false // 禁止拖动连线端点断开连线
    })
    // })
  },
  // 添加中心点 实现手动连线
  addCenterPoint: function (id) {
    this.globalJsPlumb.addEndpoint(id, {
      // filter: ".ep",
      anchor: 'Center',
      endpointHoverStyle: {fill: '#2D8CF0', radius: 8},
      endpointStyle: {fill: 'blue', radius: 8},
      connectorStyle: {stroke: 'rgba(51,51,51,1)', strokeWidth: 1},
      connectorOverlays: [
        [ 'Label',
          {
            label: '自定义',
            id: id + '_Label',
            location: 0.5
          }
        ]
      ],
      maxConnections: -1
    }, {
      isSource: true,
      isTarget: true
    })
  },
  // 连接dom
  drawline: function (obj, config, arr) {
    // 获取连线对象
    // console.log('fffff', globalJsPlumb.connect)
    // console.log('connectobj-----=-=--===-', obj)
    // console.log(new Date(), '连一条线开始')
    let connection = this.globalJsPlumb.connect({
      source: obj.source,
      target: obj.target
    }, config)
    // console.log(new Date(), '连一条线结束')
    // console.log('drawline connection', connection)
    return connection.id
    // arr.push(connectionObj)
  },
  // 删除dom所有连接
  removeAllConnect: function (id) {
    this.globalJsPlumb.deleteConnectionsForElement(id)
  },
  // 使dom可拖动
  draggable (id) {
    this.globalJsPlumb.draggable(id, {
      // containment:true
    })
  },
  // 监听连接事件
  listenconnect (vueObj) {
    this.globalJsPlumb.bind('connection', function (info) {
      // console.log('connect?', info.connection)
      let vm = vueObj
      let connection = info.connection // 链接 对象
      let sourceId = connection.sourceId
      let targetId = connection.targetId

      vm.connectionarr.push(connection)
      let label = connection.getOverlay(connection.sourceId + '_Label')
      // let labelVal
      let sourceItem = vm.items.find(function (item) {
        return item.uid === sourceId
      })
      let targetItem = vm.items.find(function (item) {
        return item.uid === targetId
      })
      // connectobj.sourceClass = sourceItem.nodeclassify || ''
      // connectobj.targetClass = targetItem.nodeclassify || ''
      if (!label) {
        let connectobj = {
          id: connection.id,
          source: sourceId,
          target: targetId
        }
        connection.addOverlay([
          'Label', {
            label: '自定义',
            location: 0.5,
            id: sourceId + '_Label'
          }
        ])
        connectobj.relationaliasname = '自定义'
        connectobj.relationcode = 'r_custom'
        connectobj.relationname = '自定义'
        let obj = {
          uid: targetItem.uid,
          showname: '自定义',
          uniquekey: targetItem.uniquekey,
          nodetype: targetItem.nodetype,
          nodeclassify: targetItem.nodeclassify,
          relationtype: 'r_custom',
          relationname: '自定义'
        }
        if ('relationdata' in sourceItem) {
          sourceItem['relationdata'].push(obj)
        } else {
          sourceItem['relationdata'] = []
          sourceItem['relationdata'].push(obj)
        }
        vm.connectarr.push(connectobj)
      }
      // else {
      //   labelVal = label.getLabel()
      //   // if (!labelVal) {
      //   //   label.setLabel('自定义')
      //   // }
      // }

      // console.log(label.getLabel(), 'label')
      // let sourceItem = vm.items.find(function (item) {
      //   return item.uid === sourceId
      // })
      // let targetItem = vm.items.find(function (item) {
      //   return item.uid === targetId
      // })
      // connectobj.sourceClass = sourceItem.nodeclassify
      // connectobj.targetClass = targetItem.nodeclassify

      // connectobj.relationaliasname = labelVal || '自定义'
      // if ('relationdata' in sourceItem) {
      //   let relationItem = sourceItem.relationdata.find(function (relation) {
      //     return relation.uid === targetId && relation.relationname === labelVal
      //   })
      //   if (relationItem) {
      //     connectobj.relationcode = relationItem.relationtype
      //     connectobj.relationname = relationItem.relationname || '自定义'
      //   } else {
      //     targetItem.relationname = '自定义'
      //     targetItem.relationtype = 'r_custom'
      //     connectobj.relationcode = targetItem.relationtype
      //     connectobj.relationname = targetItem.relationname
      //     sourceItem['relationdata'].push(targetItem)
      //   }
      // } else {
      //   targetItem.relationname = '自定义'
      //   targetItem.relationtype = 'r_custom'
      //   connectobj.relationcode = 'r_custom'
      //   connectobj.relationname = '自定义'
      //   sourceItem['relationdata'] = []
      //   sourceItem['relationdata'].push(targetItem)
      // }
      // vm.connectarr.push(connectobj)
    })
  },
  // 监听connect点击事件 连线点击事件
  listenConnectClick (obj) {
    let vm = obj
    this.globalJsPlumb.bind('click', function (connection, oriEvent) {
      vm.currentId = ''
      // 如果之前有高亮链接，先还原之前的高亮链接
      if (vm.currentConnectId) {
        let beforeHightlight = vm.connectionarr.find(function (connectItem) {
          return connectItem.id === vm.currentConnectId
        })
        if (beforeHightlight) {
          beforeHightlight.setPaintStyle({
            stroke: 'rgba(51,51,51,1)'
          })
        }
      }
      // 高亮当前链接
      connection.setPaintStyle({
        stroke: '#2D8CF0'
      })

      // console.log('connection', connection)
      // 点击连线 查询连线两端的所有关系 两端节点数据
      vm.currentType = 'connectItem'
      if (vm.currentConnectId !== connection.id) {
        vm.currentConnectId = connection.id
        if (vm.nodeIdOfCurrentConnect.indexOf(connection.sourceId) === -1 || vm.nodeIdOfCurrentConnect.indexOf(connection.targetId) === -1) {
          vm.nodeIdOfCurrentConnect = [connection.sourceId, connection.targetId]
          vm.nodeIdOfCurrentConnect.sort()
          vm.connectDataOfDetail.relation = []
          // 拿两端的所有关系
          for (let i = 0; i < vm.connectarr.length; i++) {
            const el = vm.connectarr[i]
            if (vm.nodeIdOfCurrentConnect.indexOf(el.source) !== -1 && vm.nodeIdOfCurrentConnect.indexOf(el.target) !== -1) {
              vm.connectDataOfDetail.relation.push(el.relationaliasname)
            }
          }
          // 拿两端的节点数据
          for (let i = 0; i < vm.items.length; i++) {
            const el = vm.items[i]
            if (el.uid === vm.nodeIdOfCurrentConnect[0]) {
              vm.connectDataOfDetail.left = el
            } else if (el.uid === vm.nodeIdOfCurrentConnect[1]) {
              vm.connectDataOfDetail.right = el
            }
          }
          vm.getEventData([vm.connectDataOfDetail.left.uniquekey, vm.connectDataOfDetail.right.uniquekey])
        }
      }
      // console.log('currentConnectIndex', vm.currentConnectIndex)
    })
  },
  // 监听断开连线
  listenConnectDeatched (vueObj) {
    this.globalJsPlumb.bind('connectionDetached', function (info) {
      let connection = info.connection
      // console.log('connection', connection)
      // let labelObj = connection.getOverlay(connection.sourceId + '_Label')
      // let relation = labelObj.getLabel()
      // console.log('relation', relation)
      let arr1 = vueObj.connectionarr// 连线对象数组
      let arr2 = vueObj.connectarr // 连线信息数组

      // let index = arr1.findIndex(function (connect) {
      //   return connect === info.connection
      // })
      let connectionIndex = arr1.findIndex(connect => connect === connection)
      let connectIndex = arr2.findIndex(connect => connect.id === connection.id)
      let connectdata = arr2[connectIndex]
      // if ((relation === '布控' && !arr1[index]['relationcode']) || (relation === '中命' && !arr1[index]['relationcode'])) {
      //   return
      // }
      if (!connectdata) {
        return
      }

      let arr3 = vueObj.items // vue节点数组

      let source = info.sourceId
      let target = info.targetId

      // console.log('indexx',index);

      let nodeItem = arr3.find(item => item.uid === source)
      // console.log('nodeitem', nodeItem)
      if ('relationdata' in nodeItem) {
        // console.log('nodeItem', nodeItem)
        // console.log('connectdata', connectdata)
        let relationItemIndex = nodeItem.relationdata.findIndex(data => data.relationname === connectdata.relationname && data.uid === target)
        nodeItem.relationdata.splice(relationItemIndex, 1)
        arr1.splice(connectionIndex, 1)
        arr2.splice(connectIndex, 1)
      };
    })
  },
  // 断开连线
  deleteconnect: function (connection) {
    this.globalJsPlumb.deleteConnection(connection)
  },
  // 删除元素endpoint
  deleteendpoint: function (id) {
    this.globalJsPlumb.selectEndpoints({source: id}).delete()
  },
  // 开始手动拖动新链接前
  befordrag: function (vueObj) {
    this.globalJsPlumb.bind('beforeDrag', function (params) {
      // let connector = {

      // }
      // vueObj.connectarr.push()
      // console.log('par', params)
      return {
        foo: 'bar'
      }
    })
  },

  // 时间格式化
  formatDuring (time, format) {
    var t = new Date(parseInt(time))
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
        break
      case 'MM':
        return tf(t.getMonth() + 1)
        break
      case 'mm':
        return tf(t.getMinutes())
        break
      case 'dd':
        return tf(t.getDate())
        break
      case 'HH':
        return tf(t.getHours())
        break
      case 'ss':
        return tf(t.getSeconds())
        break
      }
    })
  }
}

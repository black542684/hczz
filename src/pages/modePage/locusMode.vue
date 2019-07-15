<template>
  <div class="trackMode">
    <div class="trackModeMain">
      <div id="map"></div>
      <div class="checkBox">
        <div class="allcheck" @click="showCheckList">
          <el-checkbox :indeterminate="false" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox> 
          <span>全选</span>
          <i class="iconfont icon-danjiantou" :class="{rotate: isShowCheckList}"></i>
        </div>
        <div class="checkList" v-show="isShowCheckList">
          <el-checkbox-group class="listItems" v-model="checkedNodeList" @change="handleCheckedChange">
            <div class="listItem" v-for="(item, index) in sourceNodeList" :key="index">
              <el-checkbox class="itemcheckbox" :label="item"></el-checkbox>
              <span class="checkListText" :title="item.resource_showname">{{item.resource_showname}}</span>
            </div>
          </el-checkbox-group>
          <div class="btn">
            <span class="btnWhite" @click="filterData(checkedNodeList)">确定</span>
          </div>
        </div>
      </div>
    </div>
    <div class="trackModeRight">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="统计" name="statistics">
          <div class="timeDiv">
            <span>时间范围：</span>
            <span>{{dataTime.startTime}} - {{dataTime.endTime}}</span>
          </div>
          <div class="sessionMain">
            <p class="sessionTitle">活动时段</p>
            <div class="sessionCenter">
              <div class="sessionList" id="sessionList"></div>
            </div>
          </div>
          <div class="activityNumMain">
            <p class="sessionTitle">活动次数</p>
            <div class="activityNumCenter">
              <div class="activityNumPie" id="activityNumPie"></div>
            </div>
          </div>
          <div class="eventMain">
            <p class="sessionTitle">事件（{{allEventCount}}）</p>
            <div class="eventCenter">
              <div class="eventCenterLine" id="eventCenterLine"></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="详情" name="details">
          <div class="timeDiv">
            <span>时间范围：</span>
             <span>{{dataTime.startTime}} - {{dataTime.endTime}}</span>
          </div>
          <!-- 地点列表 -->
          <div class="locationList" v-show="detailsShowHide === 'location'">
            <p class="total">共{{pageTotal}}条</p>
            <div class="multiplayerDisplayMain" @click="goPeople(item)" v-for="(item, i) in locationData" :key="i">
              <div class="imdcRow">
                <span class="spanLeft">名称：</span>
                <div class="divRight">{{item.event_name}}</div>
              </div>
              <div class="imdcRow">
                <span class="spanLeft">地址：</span>
                <div class="divRight">{{item.address}}</div>
              </div>
            </div>
            <div class="pagination" v-show="pageTotal > 5">
              <el-pagination
                small
                @current-change="changeCurrentPage"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :pager-count="5"
                :total="pageTotal">
              </el-pagination>
            </div>
          </div>
          <!-- 多人信息 -->
          <div class="multiplayerDisplay" v-show="detailsShowHide === 'people'">
            <!-- <div class="informationDetailsIcon">
              <img src="../../../static/images/diannaoIcon.png"/>
            </div> -->
            <div class="multiplayerDisplayMain">
              <div class="imdcRow">
                <span class="spanLeft">名称：</span>
                <div class="divRight">{{eventDataOfDetail.event_name}}</div>
              </div>
              <div class="imdcRow">
                <span class="spanLeft">地址：</span>
                <div class="divRight">{{eventDataOfDetail.address}}</div>
              </div>
            </div>
            <div class="multiplayerDisplayCenter">
              <div class="mpdcList" v-for="(item, index) in nodeList" @click="showDetailForOne(item)" :key="index">
                <span class="mpdcSpanLeft">
                  <img src="../../../static/images/touxIcon.png"/>
                </span>
                <div class="mpdDivCenter">
                  <p>{{item.resource_showname}}</p>
                  <p>{{item.resource_uniquekey}}</p>
                </div>
                <span class="mpdcSpanRight">{{item.count}}次</span>
              </div>
            </div>
          </div>
          <!-- 单人信息详情 -->
          <div class="informationDetails" v-show="detailsShowHide === 'one'">
            <!-- <div class="informationDetailsIcon">
              <img src="../../../static/images/diannaoIcon.png"/>
            </div> -->
            <div class="informationDetailsCenter">
              <div class="imdcRow" v-for="(item, index) in attrData" :key="index">
                <span class="spanLeft" :title="item.key">{{item.key}}</span>
                <div class="divRight" :title="item.value">：{{item.value}}</div>
              </div>
            </div>
            <div class="detailsList" v-for="(item, index1) in eventData" :key="index1">
              <p class="detailsListTitle">{{item.event_name}}</p>
              <div class="detailsListMain">
                <div class="detailsListMainList" :class="{active: currentEvent === listItem.unique_key}" @click="getAttrData(listItem)" v-for="(listItem, index2) in item.event_list" :key="index1 + '-' + index2">
                  <span class="dlmlSpanLeft">{{index2 + 1}}</span>
                  <div class="dlmlDivRignt">
                    <span class="startingTime">{{listItem.start_time.split(' ')[0]}} <br/>{{listItem.start_time.split(' ')[1]}}</span>
                    <span class="zhi">至</span>
                    <span class="endTime">{{listItem.end_time.split(' ')[0]}} <br/>{{listItem.end_time.split(' ')[1]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// import '../../../static/offlinemap/map.js'
// import BMap from 'BMap'
import api from '../../service/api.js'
import ComplexCustomOverlay from '../../service/customOverlay.js'
export default {
  name: 'locusMode',
  data () {
    return {
      activeName2: 'statistics',
      detailsShowHide: 'location',
      dataTime: {},
      // 源分类列表
      sourceNodeList: [],
      // 选中的分类列表
      checkedNodeList: [],
      checkAll: false,
      isShowCheckList: false,
      // 地图点集合
      pointData: [],
      // 地图
      map: '',
      // 事件详情信息
      eventDataOfDetail: {
        event_name: '',
        address: ''
      },
      // 当前选中地点的源目标信息
      nodeList: [],
      // 单人详情属性信息
      attrData: [],
      eventData: [
        {
          event_name: '',
          start_time: '',
          end_time: ''
        }
      ],
      // 当前选中的坐标
      currentLocation: '',
      allEventCount: '',
      locationData: [],
      pageTotal: 0,
      pageSize: 5,
      currentPage: 1,
      pagerCount: 5,
      filter: ''
    }
  },
  computed: {
    judgementId () {
      return this.$store.getters.judgementId
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
      if (tab.name === 'details') {
        this.detailsShowHide = 'location'
        this.getMapPathForStatistics(this.filter)
      }
    },
    // 改变当前分页事件
    changeCurrentPage (val) {
      console.log(val, 11111)
      this.getMapPathForStatistics(this.filter, val)
    },
    goPeople (data) {
      this.detailsShowHide = 'people'
      this.eventDataOfDetail = data
      this.nodeList = data.nodeList
      this.currentLocation = data.location
      if (this.nodeList.length === 1) {
        this.showDetailForOne(data.nodeList[0])
      }
    },
    // 全选事件
    handleCheckAllChange (val) {
      this.checkedNodeList = val ? this.sourceNodeList : []
    },
    // 选中事件
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.sourceNodeList.length
    },
    // 显示选择框
    showCheckList () {
      this.isShowCheckList = !this.isShowCheckList
    },
    // 筛选事件
    filterData (data) {
      this.filter = data
      this.map.clearOverlays()
      this.getMapPath(data)
      this.timeLimit(data)
      this.activityPeriod(data)
      this.numberActivities(data)
      this.eventIfon(data)
      this.activeName2 = 'statistics'
      this.isShowCheckList = false
    },
    // 获取所有的源分类集合
    getMapPathNodes () {
      let param = {
        judgement_id: this.judgementId
      }
      api.post('mappath/getMapPathNodes', {paraStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        this.sourceNodeList = data
      }).catch(e => {
        console.error(e, '获取源分类集合信息失败')
      })
    },
    // 获取轨迹信息
    getMapPath (data) {
      let param = {
        judgement_id: this.judgementId,
        node_list: data
      }
      api.post('mappath/getMapPath', {paraStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        this.pointData = data
        this.setPointToMap(this.pointData)
      }).catch(e => {
        console.error(e, '获取轨迹信息失败')
      })
    },
    // 获取轨迹信息用于统计
    getMapPathForStatistics (data, page) {
      let param = {
        judgement_id: this.judgementId,
        node_list: data,
        pageNum: page || 1,
        pageSize: 5
      }
      api.post('mappath/getMapPath', {paraStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        this.locationData = data.data
        this.pageTotal = data.count
      }).catch(e => {
        console.error(e, '获取轨迹信息失败')
      })
    },
    // 初始化地图
    createOneMap () {
      // 百度地图API功能
      var map = new BMap.Map('map', {enableMapClick: false})
      this.map = map
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11) // 初始化地图,设置中心点坐标和地图级别
      // 添加地图类型控件
      // map.addControl(new BMap.MapTypeControl())
      map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true)
    },
    // 设置点到地图上
    setPointToMap (data) {
      let pointArray = []
      for (let i = 0; i < data.length; i++) {
        const el = data[i]
        let point = new BMap.Point(el.location.split(',')[0], el.location.split(',')[1])
        pointArray.push(point)
        let marker = new BMap.Marker(point)
        this.map.addOverlay(marker)
        let myCompOverlay = new ComplexCustomOverlay(point, el, this.addClickShowDetail)
        this.map.addOverlay(myCompOverlay)
        myCompOverlay.hide()
        this.addClickHandler(myCompOverlay, marker, el)
        this.addMouseoverHandler(myCompOverlay, marker)
        this.addMouseleaveHandler(myCompOverlay, marker)
      }
      this.map.setViewport(pointArray)
    },
    addMouseoverHandler (infoOverlay, marker) {
      marker.addEventListener('mouseover', function () {
        infoOverlay.show()
      })
    },
    addMouseleaveHandler (infoOverlay, marker) {
      marker.addEventListener('mouseout', function () {
        infoOverlay.hide()
      })
    },
    // 给点关联点击事件
    addClickHandler (infoOverlay, marker, data) {
      let that = this
      marker.addEventListener('click', function () {
        that.showInfo(infoOverlay, data)
      })
    },
    // 点击事件的回调
    showInfo (infoOverlay, data) {
      // infoOverlay.isVisible() ? infoOverlay.hide() : infoOverlay.show()
      this.detailsShowHide = 'people'
      this.activeName2 = 'details'
      this.eventDataOfDetail = data
      this.nodeList = data.nodeList
      this.currentLocation = data.location
      if (data.nodeList.length === 1) {
        this.showDetailForOne(data.nodeList[0])
      }
    },
    addClickShowDetail (p, eventData, nodeData) {
      let that = this
      p.addEventListener('click', function () {
        that.activeName2 = 'details'
        that.eventDataOfDetail = eventData
        that.currentLocation = eventData.location
        that.showDetailForOne(nodeData)
      })
    },
    // 显示某个人的详细信息
    showDetailForOne (item) {
      this.detailsShowHide = 'one'
      this.getMapPathNodeEvents(item)
    },
    // 获取个人属性信息
    getAttrData (item) {
      this.currentEvent = item.unique_key
      // console.log(item)
      // 获取属性的key值
      let param = {
        typeUid: item.classify_id,
        attributeType: 1
      }
      api.post('classification/getAttributesByTypeUid', {queryStr: JSON.stringify(param)}).then(data => {
        // console.log(data, 'attrdata')
        let attrKeyList = data
        // 获取属性的value值
        let param = {
          dataId: item.unique_key,
          typeId: item.classify_id
        }
        api.post('canvasManageController/queryEntity', {paraStr: JSON.stringify(param)}).then(data => {
          // console.log(data, 'value')
          if (data && data.length !== 0) {
            this.attrData = []
            for (let i = 0; i < attrKeyList.length; i++) {
              const el = attrKeyList[i]
              let obj = {key: el.attributeCnName, value: data[0][el.attributeName]}
              this.attrData.push(obj)
            }
          }
        }).catch(e => {
          console.error(e)
        })
      }).catch(e => {
        console.error(e)
      })
    },
    // 获取事件信息
    getMapPathNodeEvents (node) {
      let param = {
        judgement_id: this.judgementId,
        location: this.currentLocation,
        resource_node: node
      }
      return api.post('mappath/getMapPathNodeEvents', {paraStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        this.eventData = data
        this.getAttrData(data[0].event_list[0])
      }).catch(e => {
        console.error(e, '获取事件信息失败')
      })
    },
    // 时间范围
    timeLimit (data) {
      var that = this
      var param = {
        judgement_id: that.judgementId,
        node_list: data
      }
      console.log('dksdjs====', param)
      api.post('mappath/getMapPathTime', {paraStr: JSON.stringify(param)}).then(data => {
        console.log('时间范围', data)
        that.dataTime = data
      })
    },
    // 活动时段
    activityPeriod (data) {
      var that = this
      var param = {
        judgement_id: that.judgementId,
        node_list: data
      }
      api.post('mappath/getMapPathHourInfoCount', {paraStr: JSON.stringify(param)}).then(data => {
        var allData = data
        var yaxisData = []
        var xaxisData = []
        allData.forEach(xyaxisData => {
          var allYaxisData = xyaxisData.name
          yaxisData.push(allYaxisData)
          var allXaxisData = xyaxisData.num
          xaxisData.push(allXaxisData)
        })
        that.sessionIfon(yaxisData, xaxisData)
      })
    },
    sessionIfon (yaxisData, xaxisData) {
      var that = this
      let myChart = that.$echarts.init(document.getElementById('sessionList'))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: false,
         // data: ['直接访问']
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          // type: 'value',

          type: 'value',
          name: '',
          min: 0,
          max: 100,
          position: 'left',
          axisLabel: {
            formatter: '{value} %'
          }

        },
        yAxis: {
          type: 'category',
          // data: ['00-06时段', '07-12时段', '13-18时段', '19-23时段']
          data: yaxisData
        },
        series: [
          {
           // name: '',
            type: 'bar',
           // stack: '总量',
            barWidth: 16, // 柱图宽度
            label: {
              normal: {
                // show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: '#5cadff'
              }
            },
            // data: [ 25, 50, 55, 70]
            data: xaxisData
          }

        ]
      }
      myChart.setOption(option)
    },
    // 活动次数
    numberActivities (data) {
      var that = this
      var xAisdata = []
      var dataList = []
      var param = {
        judgement_id: that.judgementId,
        node_list: data
      }
      api.post('mappath/getMapPathEventNameCount', {paraStr: JSON.stringify(param)}).then(data => {
        var allnumact = data
        if (allnumact == null) {
          that.activityNumPie(dataList, xAisdata)
        } else {
          allnumact.forEach(allDatas => {
            var queryTypeobj = {}
            queryTypeobj.name = allDatas.name
            queryTypeobj.value = allDatas.num
            dataList.push(queryTypeobj)
          })
          that.activityNumPie(dataList, xAisdata)
        }
      })
    },
    activityNumPie (allnumact, xAisdata) {
      var that = this
      let myChart = that.$echarts.init(document.getElementById('activityNumPie'))
      var option = {
        title: {
        },
        tooltip: {
          trigger: 'item',
          //position: ['25%', '50%']
          //formatter: "{a} <br/>{b} : {c} ({d}%)"
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = {top: 60};
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
        }
          
        },
        legend: {
          show: false,
          orient: 'vertical',
          right: 20,
          top: 20,
          bottom: 20,
          data: xAisdata
        },
        grid: {
          top: '1%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['50%', '40%'],
            data: allnumact,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    // 事件
    eventIfon (data) {
      var that = this
      var param = {
        judgement_id: that.judgementId,
        node_list: data
      }
      api.post('mappath/getMapPathEventInfoCount', {paraStr: JSON.stringify(param)}).then(data => {
        console.log('事件', data)
        this.allEventCount = data.count
        var allEventData = data.data
        var eventYaxisData = []
        var eventXaxisData = []
        allEventData.forEach(allEvent => {
          var allEventYaxisData = allEvent.name
          eventYaxisData.push(allEventYaxisData)
          var allEventXaxisData = allEvent.num
          eventXaxisData.push(allEventXaxisData)
        })
        that.eventLine(eventYaxisData, eventXaxisData)
      })
    },
    eventLine (eventYaxisData, eventXaxisData) {
      var that = this
      let myChart = that.$echarts.init(document.getElementById('eventCenterLine'))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: false,
         // data: ['直接访问']
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          // type: 'value',
          show: false,
          type: 'value',
          name: '',
          min: 0,
          max: 100,
          position: 'left',
          axisLabel: {
            formatter: '{value} %'
          }

        },
        yAxis: {
          type: 'category',
          // data: ['网吧上网','旅店住宿']
          data: eventYaxisData
        },
        series: [
          {
            name: '',
            type: 'bar',
            //stack: '总量',
            barWidth: 16, // 柱图宽度
            label: {
              normal: {
                // show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: '#5cadff'
              }
            },
            // data: [ 25, 50]
            data: eventXaxisData
          }

        ]
      }
      myChart.setOption(option)
    }
  },
  mounted () {
    var that = this
    that.createOneMap()
    that.getMapPath()
    that.getMapPathNodes()
    that.timeLimit()// 时间范围
    // that.sessionIfon();//活动时段
    that.activityPeriod()
    // that.activityNumPie();//活动次数
    that.numberActivities()
    // that.eventLine();//事件
    that.eventIfon()
  }
}
</script>
<style lang="css" scoped src="../../../static/css/locusMode.css"></style>
<style src="../../../static/offlinemap/css/map.css"></style>
<style>
.trackMode .el-checkbox__label {
  font-size: 0;
}
.mapTipsItem {
  cursor: pointer;
}
.mapTipsItem:hover {
  color: #5cadff;
}
</style>


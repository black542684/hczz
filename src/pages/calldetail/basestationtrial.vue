<template>
  <!--话单统计-->
  <div class="cdrcontainer">
    <div class="callhead">
      <span @click="backbtn" class="backbtn">
        <i class="icon iconfont icon-fanhui callbackicon"></i>
      </span>
      <div class="thTitle">
        <span>
          机主：
          <span>{{rowownername}}-{{rowownercardid}}</span>
        </span>
        <span class="ownerphone">
          机主号码：
          <span>{{ownerphone}}</span>
        </span>
      </div>
    </div>
    <div class="statisticsbox" v-loading="loading">
      <div id="basestation_map"></div>
      <!--搜索-->
      <div class="maptrialsearch">
        <el-input
          style="width: 44%;vertical-align: top;"
          placeholder="对端号,多个用英文逗号隔开"
          v-model="oppsionnumstrsearch"
        >
          <template slot="append" style="background: linear-gradient(#ffffff, #d7d7d7d7);">
            <span @click="queryDotData">查询</span>
          </template>
        </el-input>
        <el-date-picker
          style="width: 52%;height: 30px;border-radius: 3px;border: 1px solid #dcdee2;"
          v-model="datetime"
          type="datetimerange"
          @change="timeChange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <!--<el-input style="width: 28%;margin-left: 10px;" placeholder="请输入对端机主号"></el-input>-->
        <!--<button class="mapsearchbtn">查询</button>-->
      </div>
      <!--详情-->
      <div
        class="detailifshowicon"
        :class="{hideStatus: !stationdetailshow}"
        @click="detailBoxShow"
      >
        <i v-show="stationdetailshow" style="font-size: 18px;" class="icon iconfont icon-zhankai1"></i>
        <i
          v-show="!stationdetailshow"
          style="font-size: 18px;"
          class="icon iconfont icon-tubiaozhizuomoban"
        ></i>
      </div>
      <div v-show="stationdetailshow" class="maptrialdetail">
        <div class="detailtitle">
          <img
            style="width: 13px;height: 20px;vertical-align: middle;"
            src="../../../static/offlinemap/images/stationicon2.png"
            alt
          >
          <span>详情</span>
        </div>
        <div class="detailinfo">
          <div class="detailstation">
            <table class="mapdetailtable">
              <tr>
                <td class="detaillabel">MNC</td>
                <td class="detailcon">{{currentstation.mncname?currentstation.mncname:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">LAC/TAC</td>
                <td class="detailcon">{{currentstation.AC?currentstation.AC:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">CI</td>
                <td class="detailcon">{{currentstation.CI?currentstation.CI:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">靠近地址</td>
                <td class="detailcon">{{currentstation.Address?currentstation.Address:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">靠近道路</td>
                <td class="detailcon">{{currentstation.Roads?currentstation.Roads:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">经纬度</td>
                <td
                  class="detailcon"
                >{{currentstation.Latb?currentstation.Latb:''}}，{{currentstation.Lngb?currentstation.Lngb:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">覆盖范围</td>
                <td class="detailcon">{{currentstation.Radius?currentstation.Radius:''}}</td>
              </tr>
              <tr>
                <td class="detaillabel">通话次数</td>
                <td class="detailcon">
                  <span>{{currentstation.callCount?currentstation.callCount:''}}</span>
                  <button
                    v-if="currentstation.callCount"
                    class="mapnumbtn"
                    @click="openCallNumList"
                  >查看</button>
                </td>
              </tr>
            </table>
          </div>
          <!--<div class="mapline"></div>-->
          <div class="stationbox">
            <table class="mapdetailtable">
              <thead>
                <tr>
                  <th class="stationtit">编号</th>
                  <th>基站靠近地址</th>
                </tr>
              </thead>
              <tbody class="stationtbody">
                <tr v-for="(item,index) in dotsdata" :key="item.CI">
                  <td class="stationnum">{{index+1}}</td>
                  <td>{{item.Address}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!--话单次数-->
      <div v-show="callnumlistshow" class="callnumlist">
        <div class="callnumtit">
          <span style="float: left">{{rowownername}}-{{ownerphone}} 的通话记录</span>
          <span class="callnumclose" @click="callNumListClose">
            <i style="color: #999999;" class="icon iconfont icon-guanbianniu"></i>
          </span>
        </div>
        <el-table :data="currentcalllist" height="265" border style="width: 100%">
          <el-table-column prop="calltype" label="通话类型" text-align="center"></el-table-column>
          <el-table-column prop="amount1" label="话单类型" width="120">
            <template slot-scope="scope">
              <img
                class="phoneimg"
                v-if="scope.row.PHONE_TYPE=='中国移动'"
                src="../../assets/images/mobile.png"
                alt
              >
              <img
                class="phoneimg"
                v-if="scope.row.PHONE_TYPE=='中国联通'"
                src="../../assets/images/unicom.png"
                alt
              >
              <img
                class="phoneimg"
                v-if="scope.row.PHONE_TYPE=='中国电信'"
                src="../../assets/images/telecommunications.png"
                alt
              >
              <span>{{scope.row.PHONE_TYPE}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="PHONE" label="对端号码" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.oppositenumber}}</div>
              <div>({{scope.row.bureaus}})</div>
            </template>
          </el-table-column>
          <el-table-column prop="PHONE" label="对端机主" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.oppositeowner}}</div>
              <div>{{scope.row.oppositeidcard}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="calltime" label="起始时间" sortable width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" sortable width="180"></el-table-column>
          <el-table-column prop="calltimelength" label="通话时长(秒)" width="130"></el-table-column>
          <el-table-column prop="basestationnumber" label="基站号码" width="120"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../static/offlinemap/map.js";

import {
  getSpaceTimeAnalysisData,
  getPointDataList,
  getSingleDetailSpaceTimeAnalysisData,
  getSingleDetailPointDataList
} from "@/service/cdr";
export default {
  name: "basestationtrial",
  data() {
    return {
      loading: true,
      userinfo: {},
      sjzuser: "",
      routerparams: {}, //路由参数
      callID: "",
      ownerphone: "",
      rowownername: "",
      rowownercardid: "",
      callperiod: "",
      starttime: "",
      endtime: "",
      datetime: [],
      operater: "", //运营商类型
      dotsdata: [],
      dotnextlinklist: [],
      oppsionnumstr: "",
      oppsionnumstrsearch: "",
      stationdetailshow: true,
      callnumlistshow: false,
      currentstation: {}, //当前点击的基站
      currentcalllist: [], //当前点击基站的话单列表
      tailtype: ""
    };
  },
  methods: {
    //返回主页面
    backbtn() {
      this.$router.push({ name: "calllist" });
    },
    //关闭通话次数弹框
    callNumListClose() {
      this.callnumlistshow = false;
    },
    //开启通话次数弹框
    openCallNumList() {
      this.callnumlistshow = true;
    },
    detailBoxShow() {
      this.stationdetailshow = !this.stationdetailshow;
    },
    timeChange(time) {
      this.queryDotData();
    },
    //获取打点数据
    queryDotData() {
      const params = {
        callid: this.callID,
        // ownerPhone: this.ownerphone,
        startDate: this.starttime,
        endDate: this.endtime,
        operater: this.operater //运营商类型：0：移动，1：联通，11电信
      };
      if (this.oppsionnumstrsearch && this.oppsionnumstrsearch != "") {
        params.oppositenumbers = this.oppsionnumstrsearch;
      } else {
        params.oppositenumbers = this.oppsionnumstr;
      }
      if (this.datetime) {
        if (
          this.datetime[0] &&
          this.datetime[0] != "" &&
          this.datetime[1] &&
          this.datetime[1] != ""
        ) {
          params.startDate = this.datetime[0];
          params.endDate = this.datetime[1];
        }
      } else {
        params.startDate = this.starttime;
        params.endDate = this.endtime;
      }
      this.loading = true;
      if (this.tailtype == "main") {
        getSpaceTimeAnalysisData(params)
          .then(res => {
            this.dotsdata = res.dataList;
            if (this.dotsdata.length) {
              this.dotsdata.forEach(item => {
                // item.mncname =
                if (item.MNC == 0) {
                  item.mncname = "移动";
                } else if (item.MNC == 1) {
                  item.mncname = "联通";
                } else if (item.MNC == 11) {
                  item.mncname = "电信";
                }
              });
              this.currentstation = this.dotsdata[0];
              this.currentcalllist = this.dotsdata[0].detailList;
            }
          })
          .then(() => {
            this.queryDotNextLinkData();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        getSingleDetailSpaceTimeAnalysisData(params)
          .then(res => {
            this.dotsdata = res.dataList;
            if (this.dotsdata.length) {
              this.dotsdata.forEach(item => {
                // item.mncname =
                if (item.MNC == 0) {
                  item.mncname = "移动";
                } else if (item.MNC == 1) {
                  item.mncname = "联通";
                } else if (item.MNC == 11) {
                  item.mncname = "电信";
                }
              });
              this.currentstation = this.dotsdata[0];
              this.currentcalllist = this.dotsdata[0].detailList;
            }
          })
          .then(() => {
            this.queryDotNextLinkData();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //获取点之间连接
    queryDotNextLinkData() {
      const params = {
        callid: this.callID,
        startDate: this.starttime,
        endDate: this.endtime,
        operater: this.operater //运营商类型：0：移动，1：联通，11电信
      };
      if (this.oppsionnumstrsearch && this.oppsionnumstrsearch != "") {
        params.oppositenumbers = this.oppsionnumstrsearch;
      } else {
        params.oppositenumbers = this.oppsionnumstr;
      }
      if (this.datetime) {
        if (
          this.datetime[0] &&
          this.datetime[0] != "" &&
          this.datetime[1] &&
          this.datetime[1] != ""
        ) {
          params.startDate = this.datetime[0];
          params.endDate = this.datetime[1];
        }
      } else {
        params.startDate = this.starttime;
        params.endDate = this.endtime;
      }
      if (this.tailtype == "main") {
        getPointDataList(params)
          .then(res => {
            if (res.dataList.length != 0) {
              this.loading = false;
              this.dotnextlinklist = res.dataList;
            } else {
              this.$message({
                message: "未查询出数据",
                type: "warning"
              });
              this.dotnextlinklist = [];
              this.loading = false;
              this.createOneMap();
            }
          })
          .then(() => {
            this.createOneMap();
          });
      } else {
        getSingleDetailPointDataList(params)
          .then(res => {
            if (res.dataList.length != 0) {
              this.loading = false;
              this.dotnextlinklist = res.dataList;
            } else {
              this.$message({
                message: "未查询出数据",
                type: "warning"
              });
              this.dotnextlinklist = [];
              this.loading = false;
              this.createOneMap();
            }
          })
          .then(() => {
            this.createOneMap();
          });
      }
    },

    //地图初始化
    createOneMap() {
      const _this = this;
      //116.404, 39.915
      var defaultJD = 116.404;
      var defaultWD = 39.915;
      // 百度地图API功能
      var map = new BMap.Map("basestation_map"); // 创建Map实例

      map.centerAndZoom(new BMap.Point(defaultJD, defaultWD), 11); // 初始化地图,设置中心点坐标和地图级别
      map.setCurrentCity("北京"); // 设置地图中心显示的城市 new！
      map.enableDragging();
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // map.addControl(new BMap.NavigationControl());   //缩放按钮
      map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP] })); //添加地图类型控件 离线只支持普通、卫星地图; 三维不支持
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
          anchor: BMAP_ANCHOR_BOTTOM_LEFT,
          offset: { width: 5, height: 50 }
        })
      ); //添加地图类型控件 离线只支持普通、卫星地图; 三维不支持
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      map.addControl(navigationControl);

      var callIcon = new BMap.Icon(
        "./static/offlinemap/images/stationicon3.png",
        new BMap.Size(26, 35),
        {
          anchor: new BMap.Size(13, 29)
        }
      );

      /*---------line-----------*/
      var lineList = new Array(); //记录要绘制的线
      var arrowLineList = new Array(); //记录绘制的箭头线
      var isFitstLoad = false; //是否是第一次加载，第一次加载不触发清除事件
      var arrowLineLengthRate = 15 / 10; //15是你初始时设置的地图显示范围，10是你初始时设置的箭头的长度，当地图放大缩小时保证箭头线长度一致
      if (this.dotnextlinklist.length) {
        this.dotnextlinklist.forEach(item => {
          if (item.nextPoint) {
            if (
              item.nextPoint.Lngb != undefined &&
              item.nextPoint.Latb != undefined
            ) {
              polylineFun(
                item.Lngb,
                item.Latb,
                item.nextPoint.Lngb,
                item.nextPoint.Latb
              );
            }
          }
        });
      }

      function polylineFun(first, second, third, four) {
        if (first != third && second != four) {
          var polyline = new BMap.Polyline(
            [new BMap.Point(first, second), new BMap.Point(third, four)],
            { strokeColor: "#f63c24", strokeWeight: 2, strokeOpacity: 1 }
          );
          map.addOverlay(polyline);
          lineList[lineList.length] = polyline; //记录要绘制的线
          arrowLineList[arrowLineList.length] = addArrow(
            polyline,
            10,
            Math.PI / 7
          ); //记录绘制的箭头线
        }
      }

      isFitstLoad = true; //第一次加载
      /*----------line----------*/

      /*---------------start绘制箭头------------------*/
      function addArrow(polyline, length, angleValue) {
        //绘制箭头的函数
        var linePoint = polyline.getPath(); //线的坐标串
        console.log(linePoint, "线的坐标串");
        var arrowCount = linePoint.length;
        for (var i = 1; i < arrowCount; i++) {
          //在拐点处绘制箭头
          var pixelStart = map.pointToPixel(linePoint[i - 1]);
          var pixelEnd = map.pointToPixel(linePoint[i]);
          var angle = angleValue; //箭头和主线的夹角
          var r = length; // r/Math.sin(angle)代表箭头长度
          var delta = 0; //主线斜率，垂直时无斜率
          var param = 0; //代码简洁考虑
          var pixelTemX, pixelTemY; //临时点坐标
          var pixelX, pixelY, pixelX1, pixelY1; //箭头两个点
          if (pixelEnd.x - pixelStart.x == 0) {
            //斜率不存在是时
            pixelTemX = pixelEnd.x;
            if (pixelEnd.y > pixelStart.y) {
              pixelTemY = pixelEnd.y - r;
            } else {
              pixelTemY = pixelEnd.y + r;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX - r * Math.tan(angle);
            pixelX1 = pixelTemX + r * Math.tan(angle);
            pixelY = pixelY1 = pixelTemY;
          } //斜率存在时
          else {
            delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
            param = Math.sqrt(delta * delta + 1);

            if (pixelEnd.x - pixelStart.x < 0) {
              //第二、三象限
              pixelTemX = pixelEnd.x + r / param;
              pixelTemY = pixelEnd.y + (delta * r) / param;
            } //第一、四象限
            else {
              pixelTemX = pixelEnd.x - r / param;
              pixelTemY = pixelEnd.y - (delta * r) / param;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX + (Math.tan(angle) * r * delta) / param;
            pixelY = pixelTemY - (Math.tan(angle) * r) / param;

            pixelX1 = pixelTemX - (Math.tan(angle) * r * delta) / param;
            pixelY1 = pixelTemY + (Math.tan(angle) * r) / param;
          }

          var pointArrow = map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
          var pointArrow1 = map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
          var Arrow = new BMap.Polyline(
            [pointArrow, linePoint[i], pointArrow1],
            { strokeColor: "#f63c24", strokeWeight: 2, strokeOpacity: 1 }
          );
          map.addOverlay(Arrow);
          return Arrow;
        }
      }
      /*---------------end绘制箭头------------------*/
      //地图加载完毕事件
      map.addEventListener("tilesloaded", function() {
        // alert(isFitstLoad);
        if (!isFitstLoad) {
          // map.clearOverlays();//清除所有的覆盖物
          //清除上一次绘制的箭头线，不清除上一次的箭头线，当地图放大时箭头线也会跟着放大
          for (var i = 0; i < arrowLineList.length; i++) {
            map.removeOverlay(arrowLineList[i]); //清除制定的覆盖物，可以是直线、标注等
          }
          arrowLineList.length = 0;
          //重新绘制箭头线
          for (var i = 0; i < lineList.length; i++) {
            arrowLineList[arrowLineList.length] = addArrow(
              lineList[i],
              15 / arrowLineLengthRate,
              Math.PI / 7
            ); //记录绘制的箭头线
          }
        }
        isFitstLoad = false;
      });

      //添加自定义覆盖物
      // 复杂的自定义覆盖物
      function ComplexCustomOverlay(point, text) {
        this._point = point;
        this._text = text;
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay();
      ComplexCustomOverlay.prototype.initialize = function(map) {
        this._map = map;
        var div = (this._div = document.createElement("div"));
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        // div.style.backgroundColor = "#2755A5";
        div.style.background = "rgba(39,85,165,.7)";
        // div.style.border = "1px solid #BC3B3A";
        div.style.borderRadius = "2px";
        div.style.color = "white";
        div.style.width = "80px";
        div.style.height = "25px";
        // div.style.padding = "2px";
        div.style.textAlign = "center";
        div.style.lineHeight = "25px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "14px";
        var span = (this._span = document.createElement("span"));
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        var that = this;
        var arrow = (this._arrow = document.createElement("div"));
        arrow.style.width = "0px";
        arrow.style.height = "0px";
        // arrow.style.borderRight = "10px solid #2755A5";
        arrow.style.borderRight = "10px solid rgba(39,85,165,.7)";
        arrow.style.borderTop = "5px solid transparent";
        arrow.style.borderBottom = "5px solid transparent";
        arrow.style.position = "absolute";
        arrow.style.top = "7px";
        arrow.style.left = "-10px";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);

        div.onclick = function() {};

        map.getPanes().labelPane.appendChild(div);

        return div;
      };
      ComplexCustomOverlay.prototype.draw = function() {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left =
          pixel.x - parseInt(this._arrow.style.left) + 15 + "px";
        this._div.style.top = pixel.y - 30 + "px";
      };

      /*---------------------------end添加自定义覆盖物----------------------------------*/

      // 编写自定义函数,创建标注
      function addMarker(point, item) {
        const myCompOverlay = new ComplexCustomOverlay(
          point,
          "话单次数" + item.callCount,
          item
        );
        var marker = new BMap.Marker(
          point,
          { icon: callIcon },
          { fillOpacity: 0.8 }
        );
        map.addOverlay(marker);
        map.addOverlay(myCompOverlay);
        marker.addEventListener("click", function(e) {
          _this.currentstation = item;
          _this.currentcalllist = item.detailList;
        });
      }

      if (this.dotsdata.length) {
        let pointArray = [];
        this.dotsdata.forEach(item => {
          const point = new BMap.Point(item.Lngb, item.Latb);
          pointArray.push(point);
          addMarker(point, item);
        });
        this.map.setViewport(pointArray);
        // map.panTo(new BMap.Point(this.dotsdata[0].Lngb,this.dotsdata[0].Latb));//定位到搜索结果区域
      }

      // this.dotsdata.forEach((item)=>{
      //   const point = new BMap.Point(item.Lngb,item.Latb);
      //   addMarker(point,item);
      // })
    }
  },
  watch: {},
  mounted() {
    this.userinfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.sjzuser = this.userinfo.loginName;
    this.routerparams = this.$route.params;
    this.callID = this.routerparams.ID;
    this.tailtype = this.routerparams.tailtype;
    this.ownerphone = this.routerparams.PHONE;
    this.rowownername = this.routerparams.OWNER_NAME;
    this.rowownercardid = this.routerparams.OWNER_CARDID;
    this.callperiod = this.routerparams.callperiod;
    this.starttime = this.routerparams.CALL_LIST_START;
    this.endtime = this.routerparams.CALL_LIST_END;
    this.oppsionnumstr = this.routerparams.oppsionnumstr;
    if (this.routerparams.PHONE_TYPE == "中国移动") {
      this.operater = "0";
    } else if (this.routerparams.PHONE_TYPE == "中国联通") {
      this.operater = "1";
    } else if (this.routerparams.PHONE_TYPE == "中国电信") {
      this.operater = "11";
    }
    this.createOneMap();
    this.queryDotData();
  }
};
</script>

<style scoped>
.cdrcontainer {
  width: 100%;
  font-size: 14px;
}
.callhead {
  width: 100%;
  height: 42px;
  line-height: 42px;
  padding-left: 10px;
  font-size: 14px;
  color: #515a6e;
}
.backbtn {
  cursor: pointer;
  float: left;
}
.thTitle {
  padding-left: 8px;
  float: left;
}
.ownerphone {
  margin-left: 10px;
}
.statisticsbox {
  width: 100%;
  height: 92%;
  border: 1px solid #dcdee2;
  position: relative;
  text-align: center;
}

#basestation_map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  position: absolute;
  left: 0;
  top: 0;
  font-family: "微软雅黑";
}
.maptrialsearch {
  /*background: rgba(0,0,0,.5);*/
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;
}
.mapsearchbtn {
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: #ffffff;
  font-size: 14px;
  border: 1px solid #1a6db8;
  border-radius: 5px;
  background: linear-gradient(#42abe0, #428ce6);
}

/*详情*/
.maptrialdetail {
  width: 20%;
  height: 100%;
  color: #515a6e;
  background: rgba(255, 255, 255, 0.8);
  border-left: 1px solid #bcbfc4;
  position: absolute;
  top: 0;
  right: 0;
}
.detailtitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: 700;
  background: #e8eaec;
}
.detailifshowicon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 20px;
  background: #cccccc;
  position: absolute;
  right: 17%;
  top: 0;
  z-index: 1;
}
.hideStatus {
  right: 0;
}
.mapdetailtable {
  width: 100%;
  border-collapse: collapse;
}
.mapdetailtable tr {
  height: 30px;
}
.mapdetailtable th {
  background: #e8eaec;
  border-top: 1px solid #bcbfc4;
}
.detaillabel {
  width: 32%;
  font-weight: 700;
  text-align: right;
}
.detailcon {
  padding-left: 10px;
  text-align: left;
}
/*.mapline {*/
/*width: 100%;*/
/*height: 1px;*/
/*background: #bcbfc4;*/
/*margin: 10px 0;*/
/*}*/
.detailinfo {
  height: calc(100% - 40px);
  overflow-y: auto;
}
.detailstation {
  /*height: 50%;*/
  /*overflow-y: auto;*/
}

.stationbox {
  margin-top: 5px;
  /*height: 50%;*/
  /*overflow-y: auto;*/
}
.stationbox tr {
  border-bottom: 1px solid #bcbfc4;
}
.stationtit {
  width: 50px;
  text-align: center;
  /*border-right: 1px solid #90c6e9;*/
  /*background: #ddf4ff;*/
}
.stationnum {
  width: 50px;
  text-align: center;
  /*border-right: 1px solid #90c6e9;*/
}

/*话单次数*/
.callnumlist {
  width: 80%;
  height: 310px;
  background: #ffffff;
  border-top: 1px solid #bcbfc4;
  position: absolute;
  left: 0;
  bottom: 0;
}
.callnumtit {
  width: 100%;
  height: 35px;
  color: #515a6e;
  line-height: 35px;
  text-align: left;
  font-weight: 700;
  padding-left: 15px;
}
.callnumclose {
  float: right;
  height: 100%;
  width: 35px;
  text-align: center;
  font-size: 18px;
}

.mapnumbtn {
  width: 60px;
  height: 26px;
  line-height: 26px;
  float: right;
  margin-right: 10px;
  border-radius: 3px;
  border: none;
  color: #ffffff;
  background: #2d8cf0;
}
</style>

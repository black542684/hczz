<template>
  <div class="basestationcon">
    <div class="toptit"><span>基站分布查询</span></div>
    <div class="basestaselectcon">
      <div id="mapselect"></div>
      <div class="searchbox">
        <ul>
          <li>
            <label class="labelname">类型</label>
            <el-radio-group v-model="nettype">
              <el-radio :label="0">GSM/UMTS/LTE</el-radio>
              <el-radio :label="1">CDMA</el-radio>
            </el-radio-group>
          </li>
          <li>
            <label v-show="nettype==0" class="labelname">MNC</label>
            <label v-show="nettype==1" class="labelname">SID</label>
            <el-select v-show="nettype==0" style="width: 70%;" clearable v-model="MNCdata" placeholder="请选择">
              <el-option
                v-for="item in MNCList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input v-show="nettype==1" style="width: 70%;" v-model="MNCdata" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <label v-show="nettype==0" class="labelname">LAC/TAC</label>
            <label v-show="nettype==1" class="labelname">NID</label>
            <el-input style="width: 70%;" v-model="lactac" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <label v-show="nettype==0" class="labelname">CI</label>
            <label v-show="nettype==1" class="labelname">BID</label>
            <el-input style="width: 70%;" v-model="ci" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <label class="labelname">进制</label>
            <el-radio-group v-model="hexadecimal">
              <el-radio :label="0">10进制</el-radio>
              <el-radio :label="1">16进制</el-radio>
            </el-radio-group>
          </li>
        </ul>
        <div class="mapsearchbtnbox">
          <button class="mapsearchbtn" @click="queryStationDistribution">查询</button>
        </div>

      </div>

      <!--详情-->
      <div class="detailifshowicon" :class="{hideStatus: !stationdetailshow}" @click="detailBoxShow">
        <i v-show="stationdetailshow" style="font-size: 18px;" class="icon iconfont icon-zhankai1"></i>
        <i v-show="!stationdetailshow" style="font-size: 18px;" class="icon iconfont icon-tubiaozhizuomoban"></i>
      </div>
      <div v-show="stationdetailshow" class="maptrialdetail">
        <div class="detailtitle">
          <img style="width: 13px;height: 20px;vertical-align: middle;" src="../../../static/offlinemap/images/stationicon2.png" alt="" />
          <span>详情</span>
        </div>
        <div class="detailinfo">
          <table class="mapdetailtable">
            <tr v-show="nettype==0">
              <td class="detaillabel">MNC</td>
              <td class="detailcon">{{currentstation.mncname}}</td>
            </tr>
            <tr v-show="nettype==0">
              <td class="detaillabel">LAC/TAC</td>
              <td class="detailcon">{{currentstation.AC}}</td>
            </tr>
            <tr v-show="nettype==0">
              <td class="detaillabel">CI</td>
              <td class="detailcon">{{currentstation.CI}}</td>
            </tr>

            <tr v-show="nettype==1">
              <td class="detaillabel">SID</td>
              <td class="detailcon">{{currentstation.SID}}</td>
            </tr>
            <tr v-show="nettype==1">
              <td class="detaillabel">NID</td>
              <td class="detailcon">{{currentstation.NID}}</td>
            </tr>
            <tr v-show="nettype==1">
              <td class="detaillabel">BID</td>
              <td class="detailcon">{{currentstation.BID}}</td>
            </tr>

            <tr>
              <td class="detaillabel">靠近地址</td>
              <td class="detailcon">{{currentstation.Address}}</td>
            </tr>
            <tr>
              <td class="detaillabel">靠近道路</td>
              <td class="detailcon">{{currentstation.Roads}}</td>
            </tr>
            <tr>
              <td class="detaillabel">经纬度</td>
              <td class="detailcon">{{currentstation.Latb}}，{{currentstation.Lngb}}</td>
            </tr>
            <tr>
              <td class="detaillabel">覆盖范围</td>
              <td class="detailcon">{{currentstation.Radius}}米</td>
            </tr>
          </table>
          <!--<div class="mapline"></div>-->
          <!--<div class="stationbox">-->
            <!--<table class="mapdetailtable">-->
              <!--<thead>-->
              <!--<tr>-->
                <!--<th class="stationtit">编号</th>-->
                <!--<th>基站靠近地址</th>-->
              <!--</tr>-->
              <!--</thead>-->
              <!--<tbody class="stationtbody">-->
              <!--<tr v-for="(item,index) in dotsdata" :key="item.CI">-->
                <!--<td class="stationnum">{{index+1}}</td>-->
                <!--<td>{{item.Address}}</td>-->
              <!--</tr>-->
              <!--</tbody>-->
            <!--</table>-->
          <!--</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../../static/offlinemap/map.js";
  import {searchDistributionOfBaseStation} from "@/service/cdr"

  export default {
    name: "basestationselect",
    data(){
      return {
        nettype: 0,//网络类型
        MNCList: [
          {
            id: 0,
            label: '移动'
          }, {
            id: 1,
            label: '联通'
          }, {
            id: 11,
            label: '电信'
          }
        ],
        MNCdata: '',
        lactac: '',
        ci: '',
        hexadecimal: 0,//进制
        mapdata: [],

        stationdetailshow: false,
        currentstation: {},//当前点击的基站
      }
    },
    methods: {
      detailBoxShow(){
        this.stationdetailshow = !this.stationdetailshow;
      },
      //地图初始化
      createOneMap () {
        var defaultJD = 116.900244;
        var defaultWD = 36.92556;
        // 百度地图API功能
        var map = new BMap.Map("mapselect");    // 创建Map实例
        var mPoint = new BMap.Point(defaultJD, defaultWD);
        // map.centerAndZoom(new BMap.Point(defaultJD, defaultWD), 12);  // 初始化地图,设置中心点坐标和地图级别
        map.centerAndZoom(mPoint, 12);  // 初始化地图,设置中心点坐标和地图级别
        map.setCurrentCity("石家庄");          // 设置地图中心显示的城市 new！
        // map.enableDragging();
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        // map.addControl(new BMap.NavigationControl());   //缩放按钮
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP]}));   //添加地图类型控件 离线只支持普通、卫星地图; 三维不支持
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));   //添加地图类型控件 离线只支持普通、卫星地图; 三维不支持
        var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        map.addControl(navigationControl);

        var callIcon = new BMap.Icon("./static/offlinemap/images/stationicon2.png", new BMap.Size(300,157), {
          anchor: new BMap.Size(13, 29)});

        var opts = {
          color : "#000000",
          fontSize : "14px",
          height : "20px",
          lineHeight : "20px",
          fontFamily:"微软雅黑",
          border: '1px solid #000000'
        }

        // 编写自定义函数,创建标注
        const _this = this;
        function addMarker(point,item){
          const label = new BMap.Label(item.Roads,{offset:new BMap.Size(-20,-22)});
          var marker = new BMap.Marker(point,{icon:callIcon});
          marker.setLabel(label);
          label.setStyle(opts);
          map.addOverlay(marker);
          map.panTo(point);//定位到搜索结果区域
          marker.addEventListener("click",function(e){
            console.log(item);
            _this.currentstation = item;
            _this.stationdetailshow = true;
          });
        }
        //画圆方法
        function circledraw(point,r) {
          var circle = new BMap.Circle(point,r,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
          map.addOverlay(circle);
          var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
          local.searchNearby(point,r);
        }

        this.mapdata.forEach((item)=>{
          const point = new BMap.Point(item.Lngb,item.Latb);
          addMarker(point,item);
          circledraw(point,item.Radius);
        })
      },

      //基站分布查询 searchDistributionOfBaseStation
      queryStationDistribution(){
        const validate = this.validateCondation();
        if(!validate){
          return;
        }
        const params = {
          baseType: this.nettype,//类型 0 GSM/UMTS/LTE 1 CDMA
          MNC: this.MNCdata,//移动设备国家代码 0 移动 1 联通 2 电信
          AC: this.lactac,//LAC/TAC
          CI: this.ci,//范围
          systemType: this.hexadecimal,//进制 0 10进制 1 16 进制
        }
        searchDistributionOfBaseStation(params).then((res)=> {
          if(res.data.length==0){
            this.$message({
              message: '未查询出数据',
              type: 'warning'
            });
          }else {
            this.mapdata = res.data;
            this.mapdata.forEach((item)=>{
              // item.mncname =
              if(item.MNC==0){
                item.mncname = '移动';
              }else if(item.MNC==1){
                item.mncname = '联通';
              }else if(item.MNC==11){
                item.mncname = '电信';
              }
            })
            this.currentstation = this.mapdata[0];
            this.stationdetailshow = true;
          }
        }).then((res)=>{
          this.createOneMap();
        })
      },
      //校验查询条件
      validateCondation(){
        if(this.nettype==0){
          if(this.MNCdata!='0' && this.MNCdata!='1' &&this.MNCdata!='11'){
            this.$message({
              message: 'MNC不能为空',
              type: 'warning'
            });
            return false;
          }
          if(this.lactac==''){
            this.$message({
              message: 'LAC/TAC不能为空',
              type: 'warning'
            });
            return false;
          }else{//不为空
            if(this.hexadecimal==0){//十进制只能是数字
              const lactacreg = /^[0-9]*$/;
              if(!lactacreg.test(this.lactac)){
                this.$message({
                  message: 'LAC/TAC必须为数字',
                  type: 'warning'
                });
                return false;
              }
            }else {//十六进制是数字和字母
              const lactacrego = /([0-9a-fA-F]{1})+/;
              if(!lactacrego.test(this.lactac)){
                this.$message({
                  message: 'LAC/TAC必须为十六进制数字',
                  type: 'warning'
                });
                return false;
              }
            }
          }

          if(this.ci==''){
            this.$message({
              message: 'CI不能为空',
              type: 'warning'
            });
            return false;
          }else{//不为空
            if(this.hexadecimal==0){//十进制只能是数字
              const cireg = /^[0-9]*$/;
              if(!cireg.test(this.ci)){
                this.$message({
                  message: 'CI必须为数字',
                  type: 'warning'
                });
                return false;
              }
            }else {//十六进制是数字和字母
              const cirego = /([0-9a-fA-F]{1})+/;
              if(!cirego.test(this.ci)){
                this.$message({
                  message: 'CI必须为十六进制数字',
                  type: 'warning'
                });
                return false;
              }
            }
          }

        }

        if(this.nettype==1){
          if(this.MNCdata==''){
            this.$message({
              message: 'SID不能为空',
              type: 'warning'
            });
            return false;
          }else{//不为空
            if(this.hexadecimal==0){//十进制只能是数字
              const MNCdatareg = /^[0-9]*$/;
              if(!MNCdatareg.test(this.MNCdata)){
                this.$message({
                  message: 'SID必须为数字',
                  type: 'warning'
                });
                return false;
              }
            }else {//十六进制是数字和字母
              const sidrego = /([0-9a-fA-F]{1})+/;
              if(!sidrego.test(this.MNCdata)){
                this.$message({
                  message: 'SID必须为十六进制数字',
                  type: 'warning'
                });
                return false;
              }
            }
          }
          if(this.lactac==''){
            this.$message({
              message: 'NID不能为空',
              type: 'warning'
            });
            return false;
          }else{//不为空
            if(this.hexadecimal==0){//十进制只能是数字
              const nidreg = /^[0-9]*$/;
              if(!nidreg.test(this.lactac)){
                this.$message({
                  message: 'NID必须为数字',
                  type: 'warning'
                });
                return false;
              }
            }else {//十六进制是数字和字母
              const nidrego = /([0-9a-fA-F]{1})+/;
              if(!nidrego.test(this.lactac)){
                this.$message({
                  message: 'NID必须为十六进制数字',
                  type: 'warning'
                });
                return false;
              }
            }
          }

          if(this.ci==''){
            this.$message({
              message: 'BID不能为空',
              type: 'warning'
            });
            return false;
          }else{//不为空
            if(this.hexadecimal==0){//十进制只能是数字
              const bidreg = /^[0-9]*$/;
              if(!bidreg.test(this.ci)){
                this.$message({
                  message: 'BID必须为数字',
                  type: 'warning'
                });
                return false;
              }
            }else {//十六进制是数字和字母
              const bidrego = /([0-9a-fA-F]{1})+/;
              if(!bidrego.test(this.ci)){
                this.$message({
                  message: 'BID必须为十六进制数字',
                  type: 'warning'
                });
                return false;
              }
            }
          }
        }
        return true;
      },

    },
    watch:{
      nettype(val){
        this.MNCdata = '';
        this.lactac = '';
        this.ci = '';
      }
    },
    mounted(){
      this.createOneMap();
    },
  }
</script>

<style scoped>
  .basestationcon {
    width: 100%;
    height: 100%;
    margin: 10px;
    border-radius: 5px;
  }
  .toptit {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(#42abe0, #428be6);
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    padding-left: 10px;
  }
  /*主体区域*/
  .basestaselectcon {
    width: 100%;
    height: 92%;
    border: 1px solid #317bdc;
    margin-top: 10px;
    position: relative;
  }
  #mapselect {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
    position: absolute;
    left: 0;top: 0;
    font-family:"微软雅黑";
  }
  .searchbox {
    width: 300px;
    height: 240px;
    background: rgba(0,0,0,.5);
    position: absolute;
    top: 0;
    left: 0;
  }
  .searchbox ul li {
    margin-top: 10px;
  }
  .searchbox .labelname {
    display: inline-block;
    width: 60px;
    color: #ffffff;
    text-align: right;
    margin-right: 15px;
  }
  .mapsearchbtnbox {
    width: 100%;
    margin-top: 15px;
    text-align: center;

  }
  .searchbox .mapsearchbtn {
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
    width: 260px;
    /*height: 70%;*/
    background: rgba(255,255,255,.8);
    border-left: 1px solid #bcbfc4;
    border-bottom: 1px solid #bcbfc4;
    position: absolute;
    top: 40px;
    right: 0;
  }
  .detailtitle {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 700;
    background: linear-gradient(#b3e6ff, #9dc9ff);
  }
  .detailifshowicon {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 20px;
    background: linear-gradient(#9dd4fe, #85bafd);
    position: absolute;
    right: 220px;
    top: 40px;
    z-index: 1;
  }
  .hideStatus {
    right: 0;
  }
  .mapdetailtable {
    width: 100%;

  }
  .mapdetailtable tr {
    border-bottom: 1px solid #90c6e9;
  }
  .mapdetailtable th {
    background: #ddf4ff;
  }
  .detaillabel {
    width: 40%;
    border-right: 1px solid #90c6e9;
    font-weight: 700;
    text-align: center;
    background: #ddf4ff;
  }
  .detailcon {
    text-align: left;
  }
  .mapline {
    width: 100%;
    height: 1px;
    background: #90c6e9;
    margin: 10px 0;
  }

  .stationbox {
    height: 310px;
    overflow-y: auto;
  }
  .stationtit {
    width: 50px;
    text-align: center;
    border-right: 1px solid #90c6e9;
    background: #ddf4ff;
  }
  .stationnum {
    width: 50px;
    text-align: center;
    border-right: 1px solid #90c6e9;
  }


</style>

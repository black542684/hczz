<template>
  <!--话单统计-->
  <div class="cdrcontainer">
    <div class="callhead">
      <!--<p class="titbaseinfo callbackbtn" @click="backbtn"><i class="icon iconfont icon-fanhui callbackicon"></i></p>-->

      <!--&lt;!&ndash;<span @click="backbtn" class="backbtn"><img src="../../assets2.0/hd-back.png" alt=""></span>&ndash;&gt;-->
      <!--<div class="thTitle">-->
      <!--<span>机主：<span>{{rowownername}}-{{rowownercardid}}</span></span>-->
      <!--<span class="ownerphone">机主号码：<span>{{ownerphone}}</span></span>-->
      <!--</div>-->
      <div class="callbaseinf">
        <!--返回-->
        <p class="titbaseinfo callbackbtn" @click="backbtn"><i class="icon iconfont icon-fanhui callbackicon"></i></p>
        <p class="titbaseinfo"><span>本机机主：</span><span>{{rowownername}}</span>-<span>{{rowownercardid}}</span></p>
        <p class="titbaseinfo"><span>本机号码：</span><span>{{ownerphone}}</span></p>
        <p class="titbaseinfo"><span>话单周期：</span><span>{{callperiod}}</span></p>
      </div>
    </div>
    <div class="statisticsbox clearfix">
      <!--左侧区域-->
      <div class="statcondbox">
        <div class="statisttit">
          统计维度
        </div>
        <div class="statistlistbox">
          <div class="statistlist">
            <el-checkbox-group v-model="statconchecked">
              <el-checkbox v-for="statistic in statistconditionlist" :key="statistic.id" :label="statistic.label"></el-checkbox>
              <el-checkbox :label="'在'+distributionstart+'-'+distributionend+'时的通话记录'">
                <span>在<input class="numsinp" v-model="distributionstart" type="text">-<input class="numsinp" v-model="distributionend" type="text">时的通话记录</span>
              </el-checkbox>
            </el-checkbox-group>
            <div class="initregion">
              <span style="margin-left: 10px;">发案时间：</span>
              <br/>
              <el-date-picker
                v-model="starttime"
                align="right"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 80%;margin-left: 10px;margin-top: 10px;"
                :picker-options="pickerOptions">
              </el-date-picker>
              <span>至</span>
              <br/>
              <el-date-picker
                v-model="endtime"
                align="right"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 80%;margin-left: 10px;margin-top: 10px;"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-checkbox-group v-model="statconchecked" :disabled="!initregionshow" style="margin-top: 10px;">
                <el-checkbox label="发案通话"></el-checkbox>
                <el-checkbox :label="'发案前'+initcasestartnum+'次通话'">
                  <span>发案前<input class="numsinp" v-model="initcasestartnum" type="text">次通话</span>
                </el-checkbox>
                <el-checkbox :label="'发案后'+initcaseendnum+'次通话'">
                  <span>发案后<input class="numsinp" v-model="initcaseendnum" type="text">次通话</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!--<div class="statistbtn">-->
          <!--<button class="startstatist">开始统计</button>-->
          <!--</div>-->
        </div>
      </div>
      <!--右边区域-->
      <div class="statconboxright">
        <div class="statisttit">
          <span>统计详情</span>
          <button class="statisticsbtn" @click="exportStatistic" v-show="!isDisable">导 出</button>
          <button class="statisticsbtn" v-show="isDisable">导 出</button>
        </div>
        <!--导出时隐藏的form表单 callid exportType-->
        <div style="display: none;">
          <form id="exportsubmit" method="POST" accept-charset="UTF-8" :action="httpUrl+'callListAanlysis/queryCallListStatisticsForExport'">
            <input type="text" id="callid" name="callid">
            <input type="text" id="exportType" name="exportType">
            <input type="text" id="MNC" name="MNC">
            <input type="text" id="start" name="start">
            <input type="text" id="end" name="end">
            <input type="text" id="startDate" name="startDate">
            <input type="text" id="endDate" name="endDate">
            <input type="text" id="pageSize" name="pageSize">

          </form>
        </div>
        <div class="tabbox">
          <el-tabs v-model="currenttab" @tab-click="tabHandle">
            <el-tab-pane v-loading="loading" v-for="tab in statconchecked" :key="tab" :name="tab" style="margin-bottom: 10px;">
              <span slot="label">{{tab}}</span>
              <!--通话次数前10位-->
              <el-table v-show="tab=='通话次数前10位'" :data="calllistdata" height="350" border style="width: 100%;">
                <el-table-column label="对端号码" text-align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="PHONE" label="对端机主">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="countNum" label="通话次数" width="120"></el-table-column>
                <el-table-column prop="sumLength" label="通话时长" width="180"></el-table-column>
              </el-table>
              <!--通话时长前10位-->
              <el-table v-show="tab=='通话时长前10位'" :data="calllistdata" height="350" style="width: 100%">
                <el-table-column label="对端号码" text-align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="PHONE" label="对端机主">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="sumLength" label="通话时长" width="180"></el-table-column>
                <el-table-column prop="countNum" label="通话次数" width="120"></el-table-column>
              </el-table>
              <!--互发短信前10位-->
              <el-table v-show="tab=='互发短信前10位'" :data="calllistdata" height="350" style="width: 100%">
                <el-table-column label="对端号码" text-align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="PHONE" label="对端机主">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="countSMSNum" label="互发数量" width="120"></el-table-column>
                <el-table-column prop="sumLength" label="通话时长" width="180"></el-table-column>
                <el-table-column prop="countNum" label="通话次数" width="120"></el-table-column>
              </el-table>
              <!--基站统计-->
              <el-table v-show="tab=='基站统计'" :data="calllistdata" height="350" style="width: 100%">
                <el-table-column label="基站坐标" text-align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.Latb}}</div>
                    <div>{{scope.row.Lngb}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="basestationnumber" label="基站号"></el-table-column>
                <el-table-column prop="logicalcellnumber" label="逻辑号" width="120"></el-table-column>
                <el-table-column prop="Address" label="基站地址" :show-overflow-tooltip="true" width="180"></el-table-column>
                <el-table-column prop="baseStationNum" label="出现次数" width="120"></el-table-column>
              </el-table>
              <!--通话地点统计-->
              <el-table v-show="tab=='通话地点统计'" :data="calllistdata" height="350" style="width: 100%">
                <!--<el-table-column prop="calltime" label="日期" width="180"></el-table-column>-->
                <el-table-column prop="Address" label="通话地点"></el-table-column>
                <el-table-column prop="addressNum" label="出现次数" width="120"></el-table-column>
              </el-table>
              <!--最后10次通话 在某时间段的通话记录-->
              <el-table v-show="tab=='最后10次通话'" tooltip-effect="dark" :data="calllistdata" height="350" style="width: 100%">
                <el-table-column prop="calltype" label="通话类型" text-align="center"></el-table-column>
                <el-table-column prop="roam" label="漫游地"></el-table-column>
                <el-table-column prop="sumLength" label="对端号码" width="180">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="countNum" label="对端机主" width="120">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="calltime" sortable label="起始时间" width="120"></el-table-column>
                <el-table-column prop="endTime" sortable label="结束时间" width="120"></el-table-column>
                <el-table-column prop="calltimelength" label="通话时长" width="120"></el-table-column>
                <el-table-column prop="bureaus" label="对端所在地" width="120"></el-table-column>
                <el-table-column prop="stationnumber" label="基站号码" width="120"></el-table-column>
                <el-table-column prop="Address" :show-overflow-tooltip="true" label="基站名称"></el-table-column>
              </el-table>
              <!--首现和尾现统计数据接口-->
              <el-table v-show="tab=='首现统计' || tab=='尾现统计' || tab=='在'+distributionstart+'-'+distributionend+'时的通话记录'" :data="calllistdata" height="350" style="width: 100%;overflow: auto;">
                <el-table-column label="对端号码" width="120" text-align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="PHONE" label="对端机主" width="160">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="calltime" sortable label="起始时间" width="120"></el-table-column>
                <el-table-column prop="endTime" sortable label="结束时间" width="120"></el-table-column>
                <!--<el-table-column prop="fewTimes" label="第几次通话" width="180"></el-table-column>-->
                <!--<el-table-column prop="countNum" label="通话次数" width="120"></el-table-column>-->
                <el-table-column prop="calltimelength" label="通话时长（秒）" width="120"></el-table-column>
                <el-table-column prop="bureaus" label="对端所在地" width="120"></el-table-column>
                <el-table-column prop="basestationnumber" label="基站号码" width="120"></el-table-column>
                <el-table-column prop="Address" label="基站地址"></el-table-column>
              </el-table>
              <!--分页-->
              <div class="pagination" v-show="tab=='首现统计' || tab=='尾现统计' || tab=='基站统计' || tab=='通话地点统计' || tab=='在'+distributionstart+'-'+distributionend+'时的通话记录'">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :page-size="pagesize"
                  :current-page="currentpage"
                  layout="prev, pager, next, jumper"
                  :total="totalnum">
                </el-pagination>
              </div>
              <!--通话时间分布-->
              <el-table v-show="tab=='通话时间分布'" height="350" :data="calllistdata" style="width: 50%;">
                <el-table-column prop="callTimeRange" label="时间段" text-align="center"></el-table-column>
                <el-table-column prop="countNum" label="出现次数"></el-table-column>
              </el-table>
              <!--发案时间筛选数据 发案前'+this.initcasestartnum+'次通话-->
              <el-table v-show="tab=='发案通话' || tab=='发案前'+initcasestartnum+'次通话' || tab=='发案后'+initcaseendnum+'次通话'" height="350" :data="calllistdata">
                <el-table-column prop="calltype" label="通话类型" text-align="center"></el-table-column>
                <el-table-column prop="roam" label="漫游地"></el-table-column>
                <el-table-column prop="sumLength" label="对端号码" width="180">
                  <template slot-scope="scope">
                    <div>{{scope.row.oppositenumber}}</div>
                    <div>({{scope.row.bureaus}})</div>
                  </template>
                </el-table-column>
                <el-table-column prop="countNum" label="对端机主" width="120">
                  <template slot-scope="scope">
                    <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                    <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                  </template>
                </el-table-column>
                <el-table-column prop="calltime" sortable label="起始时间" width="120"></el-table-column>
                <el-table-column prop="endTime" sortable label="结束时间" width="120"></el-table-column>
                <el-table-column prop="calltimelength" label="通话时长" width="120"></el-table-column>
                <el-table-column prop="bureaus" label="对端所在地" width="120"></el-table-column>
                <el-table-column prop="stationnumber" label="基站号码" width="120"></el-table-column>
                <el-table-column label="基站名称" width="120"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    checkSingleTemplate, getCountCallList, getCallLengthList, getLastTenTimeCallList, getFirstOrLastCountList,
    getCallTimeDistribution, getCaseDataRangeData, getCallRecords, getCountSMSList,
    getBaseStationList, getAddressList
  } from '@/service/cdr'

  const confighttpurl = window.g.apiUrl
  export default {
    name: 'callstatistics',
    data () {
      return {
        httpUrl: confighttpurl, // 服务
        userinfo: {},
        sjzuser: '',
        isDisable: false,
        templateid: '',
        loading: false,
        routerparams: {}, // 路由参数
        callID: '', // 话单id
        ownerphone: '',
        rowownername: '',
        rowownercardid: '',
        callperiod: '',
        // 筛选条件选中列表
        statistconditionlist: [
          {
            id: '通话次数前10位',
            label: '通话次数前10位',
          },
          {
            id: '通话时长前10位',
            label: '通话时长前10位',
          },
          {
            id: '互发短信前10位',
            label: '互发短信前10位',
          },
          {
            id: '最后10次通话',
            label: '最后10次通话',
          },
          // {
          //   id: '固话统计',
          //   label: '固话统计',
          // },
          {
            id: '基站统计',
            label: '基站统计',
          },
          {
            id: '首现统计',
            label: '首现统计',
          },
          {
            id: '尾现统计',
            label: '尾现统计',
          },
          {
            id: '通话地点统计',
            label: '通话地点统计',
          },
          {
            id: '通话时间分布',
            label: '通话时间分布',
          },
          // {
          //   id: '呼叫转移统计',
          //   label: '呼叫转移统计',
          // }
        ],
        // 选中数据列表 & tab切换显示
        statconchecked: ['通话次数前10位', '通话时长前10位'],
        currenttab: '', // 当前tabname
        calllistdata: [],
        sorttype: '', // 首现尾现统计标识
        distributionstart: '0',
        distributionend: '7',
        starttime: '',
        endtime: '',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        initregionshow: false,
        initcasestartnum: '10',
        initcaseendnum: '10',
        totalnum: 1,
        currentpage: 1,
        pagesize: 10,
        mnc: Number,
        exporttype: ''
      }
    },
    methods: {
      // 返回主页面
      backbtn () {
        this.$router.push({name: 'calllist'})
      },
      handleCurrentChange (currpage) {
        this.currentpage = currpage
        this.tabItemList(this.currenttab)
      },
      // 通话次数前10位
      queryCallCountTenList () {
        const params = {
          ownerPhone: this.callID
        }
        this.loading = true
        getCountCallList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 通话时长前10位
      querycallLengthTenList () {
        const params = {
          ownerPhone: this.callID
        }
        this.loading = true
        getCallLengthList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 最后10次通话记录
      queryEndCallTenList () {
        const params = {
          ownerPhone: this.callID
        }
        this.loading = true
        getLastTenTimeCallList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 首现尾现统计
      fristOrEndShowStatist () {
        const params = {
          ownerPhone: this.callID,
          sortType: this.sorttype
        }
        this.loading = true
        getFirstOrLastCountList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 通话时间分布统计
      getCallTimeDistributionList (type) {
        const params = {
          ownerPhone: this.callID
        }
        if (type == '1') {
          params.start = ''
          params.end = ''
        } else {
          params.start = this.distributionstart
          params.end = this.distributionend
        }
        this.loading = true
        getCallTimeDistribution(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      querySomeTimeCallList () {
        const params = {
          callid: this.callID,
          start: this.distributionstart,
          end: this.distributionend,
          pageNum: this.currentpage,
          pageSize: this.pagesize
        }
        this.loading = true
        getCallRecords(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      },
      // 发案时间筛选数据接口
      queryInitTimeFilterList (type) {
        const params = {
          ownerPhone: this.callID,
          startDate: this.starttime,
          endDate: this.endtime,
          caseDateType: type // 案发时间点筛选类型，0：案发时，1：案发前，2：案发后
        }
        if (type == '1') {
          params.pageSize = this.initcasestartnum
        } else if (type == '2') {
          params.pageSize = this.initcaseendnum
        } else {
          params.pageSize = this.pagesize
        }
        this.loading = true
        getCaseDataRangeData(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 互发短信前10
      querySendMessageList () {
        const params = {
          ownerPhone: this.callID
        }
        this.loading = true
        getCountSMSList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 基站统计 getBaseStationList
      queryBaseStationList () {
        const params = {
          callid: this.callID,
          MNC: this.mnc, // 0 移动 1 联通 11 电信
          pageNum: this.currentpage,
          pageSize: this.pagesize
        }
        this.loading = true
        getBaseStationList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.baseStationList
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      },
      // 通话地点统计
      queryCallAddressList () {
        const params = {
          callid: this.callID,
          pageNum: this.currentpage,
          pageSize: this.pagesize
        }
        this.loading = true
        getAddressList(params).then((res) => {
          if (res) {
            this.loading = false
          }
          this.calllistdata = res.dataList
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      },
      // tab切换
      tabHandle (tab) {
        this.currentpage = 1
        this.currenttab = tab.name
        if (this.currenttab == '首现统计') {
          this.sorttype = '0'
        } else if (this.currenttab == '尾现统计') {
          this.sorttype = '1'
        }
        this.currentType(tab.name)
        this.tabItemList(this.currenttab)
      },
      // 根据tab切换的类型调用不同的接口
      tabItemList (type) {
        this.isDisable = false
        const timelen = '在' + this.distributionstart + '-' + this.distributionend + '时的通话记录'
        if (type == '通话次数前10位') {
          this.queryCallCountTenList()
        } else if (type == '通话时长前10位') {
          this.querycallLengthTenList()
        } else if (type == '最后10次通话') {
          this.queryEndCallTenList()
        } else if (type == '首现统计' || type == '尾现统计') {
          if (type == '首现统计') {
          } else if (type == '尾现统计') {
          }
          this.fristOrEndShowStatist()
        } else if (type == '通话时间分布') {
          this.getCallTimeDistributionList('1')
        } else if (type == timelen) {
          this.querySomeTimeCallList()
        } else if (type == '发案通话') {
          this.queryInitTimeFilterList('0')
        } else if (type == '发案前' + this.initcasestartnum + '次通话') {
          this.queryInitTimeFilterList('1')
        } else if (type == '发案后' + this.initcaseendnum + '次通话') {
          this.queryInitTimeFilterList('2')
        } else if (type == '互发短信前10位') {
          this.querySendMessageList()
        } else if (type == '基站统计') {
          this.queryBaseStationList()
        } else if (type == '通话地点统计') {
          this.queryCallAddressList()
        }
      },
      // 获取当前模板id
      queryModelList () {
        checkSingleTemplate({loginName: this.sjzuser}).then((res) => {
          res.forEach((item) => {
            if (item.statue == 1) {
              this.templateid = item.id
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 导出
      exportStatistic () {
        this.isDisable = true;
        if (this.exporttype == '5') {
          $('#MNC').val(this.mnc)
        } else {
          $('#MNC').val('')
        }
        if (this.exporttype == '10') {
          $('#start').val(this.distributionstart)
          $('#end').val(this.distributionend)
        } else {
          $('#start').val('')
          $('#end').val('')
        }
        if (this.exporttype == '11' || this.exporttype == '12' || this.exporttype == '13') {
          $('#startDate').val(this.starttime)
          $('#endDate').val(this.endtime)
        } else {
          $('#startDate').val('')
          $('#endDate').val('')
        }
        if (this.exporttype == '12') {
          $('#pageSize').val(this.initcasestartnum)
        } else if (this.exporttype == '13') {
          $('#pageSize').val(this.initcaseendnum)
        } else {
          $('#pageSize').val('')
        }
        $('#callid').val(this.callID)
        $('#exportType').val(this.exporttype)
        var formexport = document.getElementById('exportsubmit')
        formexport.submit()
        setTimeout(() => {
          this.isDisable = false
        }, 3000)
      },
      // 判断当前纬度类型
      currentType (type) {
        if (type == '通话次数前10位') {
          this.exporttype = '1'
        } else if (type == '通话时长前10位') {
          this.exporttype = '2'
        } else if (type == '互发短信前10位') {
          this.exporttype = '3'
        } else if (type == '最后10次通话') {
          this.exporttype = '4'
        } else if (type == '基站统计') {
          this.exporttype = '5'
        } else if (type == '首现统计') {
          this.exporttype = '6'
        } else if (type == '尾现统计') {
          this.exporttype = '7'
        } else if (type == '通话地点统计') {
          this.exporttype = '8'
        } else if (type == '通话时间分布') {
          this.exporttype = '9'
        } else if (type == '在' + this.distributionstart + '-' + this.distributionend + '时的通话记录') {
          this.exporttype = '10'
        } else if (type == '发案通话') {
          this.exporttype = '11'
        } else if (type == '发案前' + this.initcasestartnum + '次通话') {
          this.exporttype = '12'
        } else if (type == '发案后' + this.initcaseendnum + '次通话') {
          this.exporttype = '13'
        }
      }

    },
    watch: {
      distributionstart (val) {
        if (val) {
          this.statconchecked = this.statconchecked.filter((item) => {
            return item.substring(item.length - 6) != '时的通话记录'
          })
        }
      },
      distributionend (val) {
        if (val) {
          this.statconchecked = this.statconchecked.filter((item) => {
            return item.substring(item.length - 6) != '时的通话记录'
          })
        }
      },
      starttime (val) {
        if (val && val != '') {
          if (this.endtime && this.endtime != '') {
            this.initregionshow = true
          } else {
            this.initregionshow = false
          }
        } else {
          this.initregionshow = false
        }
      },
      endtime (val) {
        if (val && val != '') {
          if (this.starttime && this.starttime != '') {
            this.initregionshow = true
          } else {
            this.initregionshow = false
          }
        } else {
          this.initregionshow = false
        }
      },
      initcasestartnum (val) {
        if (val) {
          this.statconchecked = this.statconchecked.filter((item) => {
            return item.substring(0, 3) != '发案前'
          })
        }
      },
      initcaseendnum (val) {
        if (val) {
          this.statconchecked = this.statconchecked.filter((item) => {
            return item.substring(0, 3) != '发案后'
          })
        }
      },
    },
    mounted () {
      this.userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.sjzuser = this.userinfo.loginName
      this.routerparams = this.$route.params
      this.ownerphone = this.routerparams.PHONE
      this.callID = this.routerparams.ID
      this.rowownername = this.routerparams.OWNER_NAME
      this.rowownercardid = this.routerparams.OWNER_CARDID
      this.callperiod = this.routerparams.callperiod
      if (this.routerparams.PHONE_TYPE == '中国移动') {
        this.mnc = 0
      } else if (this.routerparams.PHONE_TYPE == '中国联通') {
        this.mnc = 1
      } else if (this.routerparams.PHONE_TYPE == '中国电信') {
        this.mnc = 11
      }
      if (this.statconchecked) {
        this.currenttab = this.statconchecked[0]
        if (this.currenttab == '首现统计') {
          this.sorttype = '0'
        } else if (this.currenttab == '尾现统计') {
          this.sorttype = '1'
        }
        this.currentType(this.currenttab)
      }
      this.tabItemList(this.currenttab)
    }

  }
</script>

<style scoped>
  @import '../../../static/css/cdr/cdr.css';

  .titbaseinfo {
    float: left;
    color: #515a6e;
    padding-left: 16px;
    height: 42px;
  }

  .callbackbtn {
    padding-left: 12px;
    font-size: 16px;
  }

  .callbackbtn .callbackicon {
    font-size: 20px;
  }

  .statisticsbox {
    width: 100%;
    height: calc(100% - 42px);
  }

  /*左侧区域*/
  .statcondbox {
    float: left;
    width: 19%;
    height: 100%;
    border-right: 1px solid #dcdee2;
  }

  .statisttit {
    width: 100%;
    height: 40px;
    font-size: 14px;
    font-weight: 700;
    color: #333333;
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #dcdee2;
  }

  .statistlistbox {
    width: 100%;
    height: 94%;
  }

  .statistlist {
    height: 100%;
    overflow-y: auto;
    padding-top: 10px;
  }

  .statistlistbox .el-checkbox {
    display: block;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .initregion {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background: #DCF4FF;
  }

  .statistbtn {
    width: 100%;
    display: table;
    /*margin: 10px auto;*/
    text-align: center;
  }

  .startstatist {
    display: table-cell;
    width: 127px;
    height: 28px;
    line-height: 28px;
    color: #ffffff;
    background: linear-gradient(#42abe0, #428ce6);
    border: 1px solid #1a6db8;
    border-radius: 5px;
    margin: 15px auto;
  }

  /*右边区域*/
  .statconboxright {
    width: 80%;
    height: 100%;
    float: left;
  }

  .statisticsbtn {
    width: 60px;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    background: #2d8cf0;
    border: none;
    border-radius: 3px;
    margin-left: 10px;
  }

  .numsinp {
    width: 30px;
    padding-left: 5px;
    margin: 0 3px;
    border-radius: 3px;
    border: 1px solid #dcdee2;
    color: #515a6e;
  }
</style>

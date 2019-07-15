<template>
  <div class="cdrcontainer">
    <div class="callhead">
      <!--话单基本信息-->
      <div class="callbaseinf">
        <!--返回-->
        <p class="titbaseinfo callbackbtn" @click="backUpPage"><i class="icon iconfont icon-fanhui callbackicon"></i></p>
        <p class="titbaseinfo"><span>本机机主：</span><span>{{rowownername}}</span>-<span>{{rowownercardid}}</span></p>
        <p class="titbaseinfo"><span>本机号码：</span><span>{{onwerphone}}</span></p>
        <p class="titbaseinfo"><span>话单周期：</span><span>{{callperiod}}</span></p>
      </div>
      <!--话单列表操作区域-->
      <div class="callopr">
        <ul>
          <!--<li>-->
            <!--<i class="icon iconfont icon-shijian1"></i>-->
            <!--<span>时段分析</span>-->
          <!--</li>-->
          <li @click="exportCall" v-show="!isDisable">
            <i class="icon iconfont icon-daochu1"></i>
            <span>导出话单</span>
          </li>
          <li v-show="isDisable">
            <i class="icon iconfont icon-daochu1"></i>
            <span>导出话单</span>
          </li>
          <li @click="linkBaseStationTrail">
            <i class="icon iconfont icon-zonghezhenduan"></i>
            <span>时空轨迹</span>
          </li>
        </ul>
      </div>

    </div>
    <!--列表展示-->
    <div class="calllist">
      <!--搜索区域-->
      <table class="searchtlist" style="margin-bottom: 10px">
        <tr>
          <td class="labelbgc"><span class="inpname">对端姓名</span></td>
          <td class="">
            <input class="searchinput" v-model="oppositename" type="text">
          </td>
          <td class="labelbgc"><span class="inpname">对端身份证</span></td>
          <td class="">
            <input class="searchinput" v-model="oppositeidcard" type="text">
          </td>
          <td class="labelbgc"><span class="inpname">对端号码</span></td>
          <td class="">
            <input class="searchinput" v-model="oppositephone" type="text">
          </td>
          <td class="labelbgc">起始时间</td>
          <td class="timetd iviewtime">
            <el-date-picker
              class="starttime"
              v-model="starttime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
            <span class="starttoendtime">至</span>
            <el-date-picker
              class="starttime"
              v-model="endtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </td>
          <td style="width: 60px;">
            <button class="callsearchbtn" @click="searchCallDetail">搜索</button>
          </td>
        </tr>
      </table>
      <div class="tableboxdetail">
        <table class="searchtlist tablecont">
          <thead>
          <tr>
            <th style="width: 30px;padding-left: 10px;">
              <!--<input type="checkbox" v-model="checked" @click="allChecked" name="checkedrowdata">-->
              <el-checkbox @change="allChecked" v-model="checkedall"></el-checkbox>
            </th>
            <th v-for="item in headlist" :key="item.columnCode" v-show="item.columnCode!='id'">
              <span>{{item.columnName}}</span>
              <span v-if="item.columnSort"  style="margin-left: 5px;vertical-align: middle" @click="filedSort(item.columnCode)">
                <i v-show="upshow"><img src="../../assets/toup.png"></i>
                <i v-show="!upshow"><img src="../../assets/todown.png"></i>
              </span>
              <!--<i class="icon iconfont icon-jichutubiao-"></i>-->
            </th>
          </tr>
          </thead>
            <tbody>
            <tr v-for="(val,index) in callcontentlist">
              <td style="width: 30px;padding-left: 10px">
                <!--<input type="checkbox" :value="val" v-model="checkedlist" name="checkedrowdata">-->
                <el-checkbox @change="signlechecked(val.id,val.checked)" :id="val.id" v-model="val.checked"></el-checkbox>
              </td>
              <td v-for="(row) in headlist" v-show="row.columnCode!='id'">
                <span v-if="row.columnCode=='timeLengthType'" :style="{color: val.timeLengthTypecolor}">{{val[row.columnCode]}}</span>
                <span v-if="row.columnCode=='timeType'" :style="{color: val.timeTypecolor}">{{val[row.columnCode]}}</span>
                <span v-if="row.columnCode!='timeType' && row.columnCode!='timeLengthType'">{{val[row.columnCode]}}</span>
              </td>
            </tr>
            </tbody>
          <!--</div>-->
        </table>
      </div>
      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page="currentpage"
          layout="prev, pager, next, jumper"
          :total="totalnum">
        </el-pagination>
      </div>
      <!--导出时隐藏的form表单-->
      <div style="display: none;">
        <form id="exportsubmit" method="POST" accept-charset="UTF-8" :action="httpUrl+'callListAanlysis/querySingleDetailListForExport'">
          <input type="text" id="idList" name="idList">
          <input type="text" id="callid" name="callid">
          <input type="text" id="templateId" name="templateId">
        </form>
      </div>

    </div>
  </div>

</template>

<script>
  import {checkSingleTemplate, callDetailList} from '@/service/cdr'

  const confighttpurl = window.g.apiUrl

  export default {
    name: 'callrowdetail',
    data () {
      return {
        httpUrl: confighttpurl, // 服务
        userinfo: {},
        sjzuser: '', // 当前登陆用户
        isDisable: false,
        upshow: true,
        pagesize: 10,
        currentpage: 1,
        totalnum: 1,
        routerparams: {}, // 路由参数
        starttime: '',
        endtime: '',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        templateid: '', // 当前登陆用户模板id
        callID: '', // 话单id
        onwerphone: '', // 机主电话号码
        rowownername: '',
        rowownercardid: '',
        callperiod: '',
        calldetaillist: {},
        headlist: [],
        callcontentlist: [],
        sortfiledstr: '',

        oppositename: '', // 机主姓名
        oppositeidcard: '', // 机主身份证
        oppositephone: '', // 机主手机号
        stationnum: '', // 基站号
        checked: false,
        checkedlist: [],
        checkedall: false // 全选

      }
    },
    methods: {
      // 返回上一页
      backUpPage () {
        this.$router.push({name: 'calllist'});
      },
      // 当前页
      handleCurrentChange (val) {
        this.currentpage = val
        this.queryCallDetailList()
      },
      // 按某字段排序
      filedSort (filedcode) {
        this.upshow = !this.upshow
        const sortobj = {
          columnCode: filedcode,
          columnSort: 0
        }
        if (this.upshow == true) {
          sortobj.columnSort = 0
        } else {
          sortobj.columnSort = 1
        }
        const sortfiledarr = []
        sortfiledarr.push(sortobj)
        this.sortfiledstr = JSON.stringify(sortfiledarr)
        this.queryCallDetailList()
      },
      // 获取当前登陆用户模板id checkSingleTemplate statue
      queryModelId () {
        checkSingleTemplate({loginName: this.sjzuser}).then((res) => {
          res.forEach((item) => {
            if (item.statue == 1) {
              this.templateid = item.id
            }
          })
        }).then((val) => {
          this.queryCallDetailList()
        })
      },
      // 获取详情列表
      queryCallDetailList () {
        const params = {
          pageSize: this.pagesize,
          pageNum: this.currentpage,
          ownerPhone: this.onwerphone, // 机主电话号码
          templateId: this.templateid, // 模板Id
          callid: this.callID, // 话单id

          // 查询传递参数
          oppositeName: this.oppositename, // 对端机主姓名
          oppositeNumber: this.oppositephone, // 对端电话号码
          oppositeIdCard: this.oppositeidcard, // 对端机主身份证
          station: this.stationnum, // 基站号码
          startTime: this.starttime, // 开始时间
          endTime: this.endtime, // 结束时间
          sortColumnJson: this.sortfiledstr // json字符串 排序字段参数，以json字符串的形式传递 columnCode 字段代码 columnSort 排序类型(0 升序 1 降序)
        }
        callDetailList(params).then((res) => {
          this.headlist = res.columnList
          this.headlist.forEach((item) => {
            if (item.columnSort == 0) {
              item.sortstatus = false
            } else if (item.columnSort == 1) {
              item.sortstatus = true
            }
          })
          this.calldetaillist = res
          this.callcontentlist = res.data
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      },
      // 查询方法
      searchCallDetail () {
        this.queryCallDetailList()
      },
      allChecked () {
        this.checkedlist = []
        if (this.checkedall) { // true
          this.callcontentlist.forEach((item) => {
            item.checked = true
            this.checkedlist.push(item.id)
          })
        } else {
          this.checkedlist = []
          this.callcontentlist.forEach((item) => {
            item.checked = false
          })
        }
      },
      signlechecked (val, checked) {
        if (checked) {
          this.checkedlist.push(val)
        } else {
          this.checkedlist = this.checkedlist.filter((item) => {
            return item != val
          })
        }
        if (this.checkedlist.length == this.callcontentlist.length) {
          this.checkedall = true
        } else {
          this.checkedall = false
        }
      },
      // 跳转到基站轨迹
      linkBaseStationTrail () {
        if (this.checkedlist.length < 2) {
          this.$message({
            message: '请至少选择两条数据',
            type: 'warning'
          })
          return
        }
        this.routerparams.oppsionnumstr = this.checkedlist.join(',')
        this.routerparams.tailtype = 'detail'
        this.$router.push({name: 'basestationtrial', params: this.routerparams})
      },
      // 导出
      exportCall () {
        this.isDisable = true
        if (this.checkedlist.length < 1) {
          this.$message({
            message: '请至少选择一条数据',
            type: 'warning'
          })
          return
        }
        $('#templateId').val(this.templateid)
        $('#idList').val(this.checkedlist.join(','))
        $('#callid').val(this.callID)
        var formexport = document.getElementById('exportsubmit')
        formexport.submit();
        setTimeout(() => {
          this.isDisable = false
        }, 3000)
      },
    },
    watch: {

    },
    mounted(){
      this.userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.sjzuser = this.userinfo.loginName
      this.routerparams = this.$route.params
      this.callID = this.routerparams.ID
      this.onwerphone = this.routerparams.PHONE
      this.rowownername = this.routerparams.OWNER_NAME
      this.rowownercardid = this.routerparams.OWNER_CARDID
      this.callperiod = this.routerparams.callperiod
      this.queryModelId()
    }
  }
</script>

<style scoped>
  @import '../../../static/css/cdr/cdr.css';
  .callopr {
    /* margin-top: 5px; */
  }
  .titbaseinfo {
    float: left;
    color: #515a6e;
    padding-left: 16px;
  }
  .callbackbtn {
    padding-left: 12px;
    font-size: 16px;
  }
  .callbackbtn .callbackicon {
    font-size: 20px;
  }

  .tableboxdetail {
    width: 100%;
    height: 400px;
    overflow: auto;
  }
  .out{
    border-top:50px #c7edff solid;
    width:0px;
    height:0px;
    border-left:170px #a7c9ec solid;
    position:relative;
  }
  .out span:nth-child(1){
    font-style:normal;
    display:block;
    position:absolute;
    top:-40px;left:-72px;
  }
  .out span:nth-child(2){
    font-style:normal;
    display:block;
    position:absolute;
    top:-25px;
    left:-152px;
  }
  .calllist table{
    width:100%;
    border-collapse:collapse;
  }
  .calllist table thead tr th{
    background: #e8eaec;
    border-top: 1px solid #dcdee2;
    padding-left: 5px;
    height: 30px;
  }
  .calllist table thead tr th,.calllist table tbody tr td{
    border-bottom:1px solid #dcdee2;
    text-align: left;
  }
  .calllist table tbody tr td {
    height: 42px;
  }
  .calllist table thead tr th:nth-child(1){
    width:125px;
  }
  .calllist table thead tr th:nth-child(2){
    width:170px;
  }
  .calllist table thead tr th:nth-last-child,.calllist table tbody tr td:nth-last-child{
    border-right:none 0;
  }
  .thred{
    color:#fa2727;
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;

  }

  .arrow.asc {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #666464;
    position: absolute;
    right:5px;
    top:18px;
  }

  .arrow.dsc {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #aeafaf;
    position: absolute;
    right:5px;
    top:26px;
  }
  .phonenum{
    min-width:30px;
    display: inline-block;
    color:#3caaff;
  }
  .phonenumright{
    border-right:1px solid #333;
    margin-right:10px;
  }
  .firstth{
    position: relative;
  }

</style>

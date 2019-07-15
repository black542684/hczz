<template>
    <div class="diagcontain">
        <el-dialog :title="nameO +' 与 '+ nameT +' 通话记录'" width="70%" :visible.sync="talkwithshow"  :modal-append-to-body='false'>
          <div class="diacontbox calllist">
            <el-table ref="callListTable" :data="callloglist" border style="width: 100%">
              <el-table-column prop="lordiscalled" sortable label="通话类型" width="120"></el-table-column>
              <el-table-column prop="singleType" label="话单类型" width="100"></el-table-column>
              <el-table-column prop="oppositenumber" label="对端号码" width="120">
                <template slot-scope="scope">
                  <div>{{scope.row.oppositenumber}}</div>
                  <div>({{scope.row.bureaus}})</div>
                </template>
              </el-table-column>
              <el-table-column label="对端机主" width="120" text-align="center">
                <template slot-scope="scope">
                  <div><a href="javascript:;">{{scope.row.oppositeowner}}</a></div>
                  <div><a href="javascript:;">{{scope.row.oppositeidcard}}</a></div>
                </template>
              </el-table-column>
              <el-table-column prop="calltime" sortable label="起始时间" width="180"></el-table-column>
              <el-table-column prop="endTime" sortable label="结束时间" width="180"></el-table-column>
              <el-table-column prop="calltimelength" sortable label="通话时长（秒）" width="160"></el-table-column>
              <el-table-column prop="bureaus" label="对端所在地" width="120"></el-table-column>
              <el-table-column prop="basestationnumber" label="基站号" width="120"></el-table-column>
              <el-table-column prop="stationaddress" label="基站地址" width="120"></el-table-column>
            </el-table>
            <div class="pagination clearFix">
              <el-pagination
                @current-change="handleCurrentChange"
                :page-size="pagesize"
                :current-page="currentpage"
                layout="prev, pager, next, jumper"
                :total="totalnum">
              </el-pagination>
            </div>
          </div>
        </el-dialog>
      </div>
</template>
<script>
  import {searchCallTalkDetail,getPartnerDetailList} from '@/service/cdr'

  export default {
    name: 'callNumDetail',
    data () {
      return {
        nameO: '',
        nameT: '',
        starttime: '',
        endtime: '',
        callinfodia: '',
        talkwithshow: false,
        pagesize: 10,
        currentpage: 1,
        totalnum: 0,
        callloglist: [],
        typesigncom: '',
        callidone: '',
        callidtwo: ''
      }
    },
    props: {
      callboxshow: {
        type: Boolean,
        default: false
      },
      NUM: {
        type: Number,
        default: -5
      },
      callinfo: {
        type: Object,
        default: {}
      },
      typesign: {
        type: String,
        default: '1'
      }
    },
    watch: {
      NUM () {
        this.talkwithshow = this.callboxshow
        this.callinfodia = this.callinfo
        this.starttime = this.callinfodia.starttime
        this.endtime = this.callinfodia.endtime
        this.nameO = this.callinfodia.nameOne
        this.nameT = this.callinfodia.nameTwo
        this.callidone = this.callinfodia.callidOne
        this.callidtwo = this.callinfodia.callidTwo
        this.typesigncom = this.typesign
        if (this.typesigncom == '1') {
          this.queryCommonCallLogList()
        } else if (this.typesigncom == '2') {
          this.queryCallLogList()
        }
      }
    },
    methods: {
      // 当前页
      handleCurrentChange (val) {
        this.currentpage = val
        if (this.typesign == '1') {
          this.queryCommonCallLogList()
        } else {
          this.queryCallLogList()
        }
      },
      queryCallLogList (type) {
        const params = {
          owner_phone: this.callidone, // 本机号码
          oppositenumber: this.callidtwo, // 对端手机号
          startTime: this.starttime,
          endTime: this.endtime,
          pageNo: this.currentpage,
          perPageNo: this.pagesize,
          soret: 0,
          sortCloumn: 'calltime'
        }
        searchCallTalkDetail(params).then((res) => {
          this.callloglist = res.list
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      },
      queryCommonCallLogList(type){
        const params = {
          ownerPhone: this.callidone, // 本机号码
          oppositenumber: this.nameT, // 对端手机号
          startDate: this.starttime,
          endDate: this.endtime,
          pageNum: this.currentpage,
          pageSize: this.pagesize
        }
        getPartnerDetailList(params).then((res) => {
          this.callloglist = res.dataList
          this.totalnum = res.count
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    mounted () {

    }
  }
</script>
<style>
  @import '../../../static/css/componentcss/callconfig.css';
</style>
<style scoped>

</style>



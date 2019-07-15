<template>
     <div class="cdrcontainer">
       <div class="callhead">
         <span @click="backbtn" class="backbtn"><i class="icon iconfont icon-fanhui callbackicon"></i></span>
         <div class="thTitle">新号分析</div>
         <div class="thTime">
           <span class="ownerphone">机主号码：<span>{{ownerphone}}</span></span>
           <span>{{starttime}}</span>
           <span>起新增,</span>
         </div>
         <div class="thdet">至少通话<span>{{contactnum}}</span>次</div>
       </div>
       <div class="calllist">
         <!--<table>-->
         <!--<thead>-->
         <!--<tr>-->
         <!--<th v-for="(item,index) in headlist" :key="index">{{item.name}}</th>-->
         <!--</tr>-->
         <!--</thead>-->
         <!--<tbody>-->
         <!--<tr v-for="(item,index) in datalist" :key="index">-->
         <!--<td>{{item.type}}</td><td>{{item.call}}</td><td>{{item.call2}}</td><td>{{item.time}}</td>-->
         <!--<td>{{item.cs}}</td><td>{{item.sc}}</td><td>{{item.tole}}</td><td>{{item.jzxq}}</td>-->
         <!--<td>{{item.ljxq}}</td><td>{{item.name}}</td>-->
         <!--</tr>-->
         <!--</tbody>-->
         <!--</table>-->
         <el-table ref="callListTable" :data="datalist" border style="width: 100%">
           <el-table-column label="对端号码" text-align="center">
             <template slot-scope="scope">
               <div class="rowspecial"><a class="linkstyle" href="javascript:;">{{scope.row.oppositenumber}}</a></div>
               <div class="rowspecial"><a class="linkstyle" href="javascript:;">{{scope.row.bureaus}}</a></div>
             </template>
           </el-table-column>
           <el-table-column prop="PHONE" label="对端机主">
             <template slot-scope="scope">
               <div>{{scope.row.oppositeowner}}</div>
               <div>({{scope.row.oppositeidcard}})</div>
             </template>
           </el-table-column>
           <el-table-column prop="amount1" sortable label="通话类型" width="120">
             <template slot-scope="scope">
               <i class="el-icon-mobile-phone"></i>
               <span>{{scope.row.lordiscalled}}</span>
             </template>
           </el-table-column>
           <el-table-column prop="mincalltime" label="首次通话时间"></el-table-column>
           <el-table-column prop="timelenght" sortable label="通话总时长（秒）"></el-table-column>
           <el-table-column prop="opcount" sortable label="通话总数" width="120">
             <template slot-scope="scope">
               <span class="rowspecial" style="color: #45b2fb;" @click="toCalldetail(scope.row)"><a class="linkstyle" href="javascript:;">{{scope.row.opcount}}</a></span>
             </template>
           </el-table-column>
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
       <!-- 通话次数组件 -->
       <callNumDetail :callboxshow="callshow" :typesign="typesign" :NUM="callnum" :callinfo="callinfo"></callNumDetail>
     </div>
</template>
<script>
  import callNumDetail from '../../components/CDRcom/callNumDetail' // 次数详情
  import {getNewNumberAnalysisList} from '@/service/cdr'
export default {
    name: 'oneAnalysis',
    components: {
      callNumDetail
    },
    data () {
      return {
        currentpage: 1,
        pagesize: 10,
        totalnum: 0,
        routerparams: {}, // 接收路由参数
        ownerinfo: {}, // 机主信息
        ownerphone: '',
        starttime: '', // 新增时间开始
        endtime: '', // 新增时间结束
        contactnum: '', // 联系次数
        datalist: [], // 列表数据

        callshow: false, // 弹框显示
        callnum: 0, // 弹框
        callinfo: {}, // 通话参数
        typesign: '1'
      }
    },
    methods: {
      // 返回主页面
      backbtn () {
        this.$router.push({name: 'calllist'})
      },
      // 获取列表
      queryList () {
        const params = {
          callID: this.ownerinfo.ID, // 话单id
          ownerPhone: this.ownerinfo.PHONE, // 机主号码
          startTime: this.starttime, // 开始时间
          endTime: this.endtime, // 结束时间
          count: this.contactnum, // 联系次数
          pageNo: this.currentpage, // 当前页码
          pageSize: this.pagesize // 每页条数
        }
        getNewNumberAnalysisList(params).then((res) => {
          this.datalist = res.list
          this.totalnum = res.num
        }).catch((err) => {
          console.log(err)
        })
      },
      // 当前页
      handleCurrentChange (val) {
        this.currentpage = val
        this.queryList()
      },
      // 点击次数跳详情
      toCalldetail (row) {
        this.callinfo.callidOne = row.callid
        this.callinfo.nameOne = this.ownerinfo.PHONE // 主叫
        this.callinfo.nameTwo = row.oppositenumber // 被叫

        this.callinfo.starttime = this.starttime
        this.callinfo.endtime = this.endtime

        this.callnum++
        this.callshow = true
      }
    },
    mounted () {
      this.routerparams = this.$route.params
      console.log(this.routerparams)
      this.starttime = this.routerparams.starttime
      this.endtime = this.routerparams.endtime
      this.contactnum = this.routerparams.contactnum
      this.ownerinfo = this.routerparams.ownerinfo[0] // 机主信息
      this.ownerphone = this.ownerinfo.PHONE
      this.queryList()
    }
}
</script>
<style>
 @import '../../../static/css/componentcss/callconfig.css';
</style>
<style scoped>
  @import '../../../static/css/cdr/cdranaly.css';
</style>



<template>
    <div class="cdrcontainer">
        <div class="callhead">
          <span @click="backbtn" class="backbtn"><i class="icon iconfont icon-fanhui callbackicon"></i></span>
          <div class="thTitle">相互通话</div>
          <div class="thTime">
            <span>{{starttime}}</span><span class="regionzhi">至</span><span>{{endtime}}</span>
          </div>
        </div>
        <div class="calllist">
            <table>
              <thead>
                <tr>
                  <th>相互通话</th>
                  <th v-for="(item,index) in namelist" :key="namelist.ownerphone">{{item.ownername}}<br>{{item.ownerphone}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index1) in namelist" :key="namelist.ownerphone">
                  <td>{{item.ownername}}<br>{{item.ownerphone}}</td>
                  <td :class="{ownercall: itemcon.callNumber==0 && itemcon.talkTimeSum==0}" v-for="(itemcon,index) in item.list" :key="index" ><span v-if="itemcon.callNumber!=0 && itemcon.talkTimeSum!=0">通话<span @click="toCalldetail(index,index1)" class="colorfont">{{itemcon.callNumber}}</span>次<span class="colorfont">{{itemcon.talkTimeSum}}</span>秒</span></td>
                  <!--<span @click="toCalldetail(index,index1)" class="colorfont">-->
                </tr>
              </tbody>
            </table>
        </div>
        <!-- 通话次数组件 -->
        <callNumDetail :callboxshow="callshow" :typesign="typesign" :NUM="callnum" :callinfo="callinfo"></callNumDetail>
    </div>
</template>
<script>
  import {searchCallTalkList} from '@/service/cdr'
  import callNumDetail from '../../components/CDRcom/callNumDetail' // 次数详情
  export default {
    name: 'callMutual',
    components: {
      callNumDetail
    },
    data () {
      return {
        callshow: false,// 弹框显示
        callnum: 0, // 弹框
        callinfo: {}, // 通话参数
        namelist: [], // 相互通话列表数据
        routerparams: {}, // 路由参数
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        ownerinfo: [], // 主叫信息
        hang: 0, // 行
        lian: 0, // 列
        nameOne: '', // 通话人姓名
        nameTwo: '', // 通话人姓名
        typesign: '2'
      }
    },
    methods: {
      // 点击次数跳详情
      toCalldetail (val, val1) {
        var _this = this
        this.hang = val1
        this.lian = val
        this.namelist.forEach((item, index) => {
          if (_this.lian == index) {
            this.callinfo.nameOne = item.ownerphone
            this.callinfo.callidOne = item.ID
          }
          if (_this.hang == index) {
            this.callinfo.nameTwo = item.ownerphone
            this.callinfo.callidTwo = item.ID
          }
        })

        this.callinfo.starttime = this.starttime
        this.callinfo.endtime = this.endtime

        this.callnum++
        this.callshow = true
      },
      // 返回主页面
      backbtn () {
        this.$router.push({name: 'calllist'})
      },
      // 获取相互通话列表 searchCallTalkList
      queryMutualList () {
        const ownerphone = []
        const callids = []
        this.ownerinfo.forEach((item) => {
          ownerphone.push(item.PHONE)
          callids.push(item.ID)
        })
        const callidstr = callids.join(',')
        const params = {
          callid: callidstr, // 话单id  逗号隔开的字符串
          startTime: this.starttime,
          endTime: this.endtime
        }
        searchCallTalkList(params).then((res) => {
          this.namelist = res
        }).catch((err) => {
        })
      }
    },
    mounted () {
      this.routerparams = this.$route.params
      this.ownerinfo = this.routerparams.ownerphone
      this.starttime = this.routerparams.starttime
      this.endtime = this.routerparams.endtime
      this.queryMutualList()
    }
  }
</script>
<style>
 @import '../../../static/css/componentcss/callconfig.css';
</style>

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
    font-size:14px;
    color:#515a6e;
  }
  .backbtn{
    cursor: pointer;
    float:left;
  }
  .thTitle{
    width:85px;
    padding-left:8px;
    float:left;
  }
  .thTime{
    float:left;
  }
  .thTime span{
    display: inline-block;
    text-align:center;
  }
  .regionzhi {
    margin: 0 10px;
  }
  .thdet{
    float:left;
  }
  .thdet span{
      min-width: 22px;
      display: inline-block;
      text-align:center;
  }
  .calllist{
      width:100%;
      height: 90%;
      overflow-y:auto;
      overflow-x:hidden;
  }
  .calllist table{
    width:100%;
    border-collapse:collapse;
    color: #515a6e;
  }
  .calllist table thead tr th{
      height:50px;
      background: #e8eaec;
      font-weight: normal;
  }
  .calllist table thead tr th:nth-child(1){
      width:180px;
  }
  .calllist table tbody tr td{
      height:50px;
  }
  .calllist table tbody tr td:nth-child(1){
      background: #e8eaec;
  }
  .calllist table thead tr th,.calllist table tbody tr td{
    height: 50px;
    text-align:center;
    border-bottom:1px solid #dcdee2;
  }

  .ownercall {
    background: #f5f5f5;
  }
  .colorfont {
    color: #2da4ff;
    font-weight: 700;
    padding: 0 5px;
    cursor:pointer;
  }
</style>



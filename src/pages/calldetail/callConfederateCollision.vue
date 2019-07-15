<template>
    <div class="cdrcontainer">
      <div class="callhead">
          <span @click="backbtn" class="backbtn"><i class="icon iconfont icon-fanhui callbackicon"></i></span>
          <div class="thTitle">同伙碰撞</div>
          <div class="thTime">
              <span>{{starttime}}</span><span class="regionzhi">至</span><span>{{endtime}}</span>
          </div>
          <div class="thdet">至少 <span>{{commoncontact}}</span>个共同联系人</div>
      </div>
      <div class="calllist">
          <table>
              <thead>
                  <tr>
                      <th class="firstth">同伙碰撞（人）
                          <span class="arrow asc"></span>
                          <span class="arrow dsc"></span>
                      </th>
                      <th>
                          <div class="out">
                            <span>机主姓名</span>
                            <span>对端号码</span>
                          </div>
                      </th>
                      <th v-for="(item,key,index) in headlist" v-if="key!='callNumMap'">
                        <span>{{key}}</span><br><span>(河北)</span>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(val,key,index) in collisionlist">
                      <td><span class="thred">{{val.callNumMap.callNum}}</span></td>
                      <td><span>{{key}}</span><br><span>(河北石家庄)</span></td>
                      <td v-for="(itemval,itemkey,index) in val" v-if="itemkey!='callNumMap'">
                        <span>通话<span class="phonenum" @click="toCalldetail(itemkey,key,itemval)">{{Number(itemval.主叫)+Number(itemval.被叫)}}</span>次</span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <!-- 通话次数组件 -->
      <callNumDetail :callboxshow="callshow" :typesign="typesign" :NUM="callnum" :callinfo="callinfo"></callNumDetail>

    </div>
</template>
<script>
  import callNumDetail from '../../components/CDRcom/callNumDetail' // 次数详情
  import {callCollision} from '@/service/cdr'

  export default {
    name: 'callConfederateCollision',
    components: {
      callNumDetail
    },
    data () {
      return {
        currentpage: 1,
        pagesize: 10,
        totalnum: 0,
        collisionlist: {}, // 同伙碰撞列表数据
        headlist: [],
        routerparams: {}, // 路由参数
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        ownerinfo: [], // 主叫信息
        commoncontact: '', // 共同联系人
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
      // 当前页
      handleCurrentChange (val) {
        this.currentpage = val
      },
      // 获取同伙碰撞列表
      queryCollisionList () {
        const ownerids = [] // 话单id
        this.ownerinfo.forEach((item) => {
          ownerids.push(item.ID)
        })
        const owneridstr = ownerids.join(',')
        const params = {
          phone: owneridstr, // 传入电话号字符串，多个用英文“,”分隔
          startDate: this.starttime,
          endDate: this.endtime,
          manNum: this.commoncontact - 0 // 共同联系人
        }
        callCollision(params).then((res) => {
          this.collisionlist = res.data
          this.headlist = this.collisionlist[Object.keys(this.collisionlist)[0]]
        }).catch((err) => {
          console.log(err)
        })
      },
      // 点击次数跳详情
      toCalldetail (val, val1, itemval) {
        this.callinfo.callidOne = itemval.callid // 主叫话单id
        this.callinfo.nameOne = val // 主叫
        this.callinfo.nameTwo = val1 // 被叫

        this.callinfo.starttime = this.starttime
        this.callinfo.endtime = this.endtime

        this.callnum++
        this.callshow = true
      }
    },
    mounted () {
      this.routerparams = this.$route.params
      this.ownerinfo = this.routerparams.ownerphone
      this.starttime = this.routerparams.starttime
      this.endtime = this.routerparams.endtime
      this.commoncontact = this.routerparams.commoncontact
      this.queryCollisionList()
    }
  }
</script>
<style>
  @import '../../../static/css/componentcss/callconfig.css';
</style>

<style scoped>
  @import '../../../static/css/cdr/cdranaly.css';
</style>



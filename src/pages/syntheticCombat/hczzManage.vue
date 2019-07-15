<template>
  <div class="hczz-manage">
    <header>
      <div class="header-title">
        <span>合成作战</span>
      </div>
      <div class="header-btn" @click="goApply">发起</div>
    </header>
    <main>
      <div class="tabs">
        <div :class="{'active':params.statusType === '0'}" @click="changeStatusType('0')">
          <span>我的待办</span>
          <span>({{ total_0 }})</span>
        </div>
        <div :class="{'active':params.statusType === '1'}" @click="changeStatusType('1')">
          <span>我的发起</span>
          <span>({{ total_1 }})</span>
        </div>
        <div :class="{'active':params.statusType === '2'}" @click="changeStatusType('2')">
          <span>我的已办</span>
          <span>({{ total_2 }})</span>
        </div>
      </div>
      <div class="search-box">
        <div class="search">
          <input
            type="text"
            v-model="params.nameOrCode"
            placeholder="请输入合战名称/编号等"
            @keyup.enter="query"
          >
          <i class="iconfont icon-sousuo1" @click="query"></i>
        </div>
        <div class="date">
          <span>下发开始时间:</span>
          <el-date-picker v-model="createTime" type="date" placeholder="请选择开始时间"></el-date-picker>
        </div>
        <div class="date">
          <span>下发结束时间:</span>
          <el-date-picker v-model="finishTime" type="date" placeholder="请选择结束时间"></el-date-picker>
        </div>
        <div class="select">
            <span style="color: #6b757e;">合战状态: </span>
            <el-select v-model="params.taskId" clearable placeholder="请选择合成状态" class="select-height">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in statusList" :key="index"></el-option>
            </el-select>
        </div>
        <div class="query" @click="query">查询</div>
      </div>
      <div class="table-title pubTable">
        <ul class="clearfix">
          <li style="width: 5%">编号</li>
          <li>合战名称</li>
          <li>合战编号</li>
          <li style="width: 7%">案件类别</li>
          <li>合战部门</li>
          <li>申请时间</li>
          <li style="width: 10%">合战状态</li>
          <li style="width: 10%">操作</li>
        </ul>
      </div>
      <div class="table-content pubTable">
        <ul class="clearfix" v-for="(item,index) in listData" :key="index" v-show="!noData">
          <li style="width: 5%">{{ index + 1 }}</li>
          <li :title="item.coprName">{{ item.coprName }}</li>
          <li :title="item.coprCode">{{ item.coprCode }}</li>
          <li style="width: 7%" :title="item.caseTypeName">{{ item.caseTypeName }}</li>
          <li :title="item.coprDept">{{ item.coprDept }}</li>
          <li :title="item.createTime">{{ item.createTime }}</li>
          <li style="width: 10%" :title="item.statusStr">{{ item.statusStr }}</li>
          <li style="width: 10%" @click="goDetail(item)">查看详情</li>
        </ul>
        <div class="no-data" v-show="noData">未找相关数据</div>
      </div>
      <div class="pages">
        <div class="total">
          共&nbsp;
          <span>{{ total }}</span>&nbsp;条记录
        </div>
        <div class="elPage" v-show="isPage">
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="params.pageSize"
            :current-page.sync="params.pageNum"
            layout="prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import UtilService from '../../service/UtilService.js'
export default {
  name: "hczzManage",
  data() {
    return {
      url: {
        getListDataUrl: "/hcfight/fightList",
        getNumUrl: "/hcfight/fightListTotal",
        getUserInfosUrl: '/userApi/getUserLoginInfoByToken',
        getStatusListUrl: '/hcfight/getStatusList'
      },
      params: {
        createBy: '',
        pageSize: 10000,
        pageNum: 1,
        nameOrCode: "",
        statusType: "0",
        createTime: null,
        finishTime: null,
        taskId: ''
      },
      createTime: null,
      finishTime: null,
      total: 0,
      listData: [],
      isPage: false,
      noData: false,
      total_0: 0,
      total_1: 0,
      total_2: 0,
      statusList: []
    };
  },
  created() {
    this.getUserInfos()
    this.getStatusList()
  },
  methods: {
    // 获取合战状态
    getStatusList() {
      let that = this;
      this.$Ajax.get(that.url.getStatusListUrl, {}).then(data => {
        that.statusList = data.data
        that.statusList.unshift({ name: '草稿', id: '0' })
      });
    },
    // 获取用户信息
    getUserInfos() {
      let that = this;
      this.$Ajax.get(that.url.getUserInfosUrl, {}).then(data => {
        console.log('用户信息', data)
        if (data.account !== '') {
          localStorage.setItem('userName', data.account)
          localStorage.setItem('userId', data.userId)
          localStorage.setItem('realName', data.realName)
          localStorage.setItem('token', data.token)
          that.params.createBy = localStorage.getItem('userName')
          that.getListData();
          that.getNum()
        }
      });
    },
    // 获取列表数据
    getListData() {
      let that = this;
      if (this.createTime) {
        this.params.createTime = UtilService.formatDuring(this.createTime.getTime(), 'yyyy-MM-dd')
      } else {
        this.params.createTime = null
      }
      if (this.finishTime) {
        this.params.finishTime = UtilService.formatDuring(this.finishTime.getTime(), 'yyyy-MM-dd')
      } else {
        this.params.finishTime = null
      }
      this.$Ajax.get(that.url.getListDataUrl, that.params).then(data => {
        console.log('列表数据为： ', data);
        that.listData = data.data.result;
        console.log('aaaaaaa', that.listData)
        that.total = data.data.total;
        if (that.total === 0) {
          that.isPage = false;
          that.noData = true;
        } else {
          that.noData = false;
          if (that.total > that.params.pageSize) {
            that.isPage = true;
          } else {
            that.isPage = false;
          }
        }
      });
    },
    // 查看详情
    goDetail(item) {
      if (item.coprStatus === 0) { // 草稿状态
        this.$router.push({
          name: 'applySynCom',
          query: {
            id: item.id,
            coprStatus: item.coprStatus,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'hczzsq-main' || item.statusId === 'hczzsqjz' || item.statusId === 'hczzsqwz' || item.statusId === 'hczzsqsp') { // 退回到申请
        this.$router.push({
          name: 'applySynCom',
          query: {
            id: item.id,
            isback: 'back',
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
        // 发起部门审核
      } else if (item.statusId === 'fqbmsh-main' || item.statusId === 'fqbmshnjz' || item.statusId === 'fqbmshnwz' || item.statusId === 'hczzshsp') {
        this.$router.push({
          name: 'checkSynCom',
          query: {
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
        // 协作部门审核
      } else if (item.statusId === 'jzbmsh' || item.statusId === 'wzbmsh' || item.statusId === 'spbmsh' || item.statusId === 'jzbmshns' || item.statusId === 'wzbmshs' || item.statusId === 'spbmshs') {
        this.$router.push({
          name: 'receiveSynCom',
          query: {
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'jzbmjs' || item.statusId === 'wzbmjs' || item.statusId === 'spbmjs') {
        this.$router.push({
          name: 'feedbackSynCom',
          query: {
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'jzbmfk' || item.statusId === 'wzbmfk' || item.statusId === 'spbmfk') {
        this.$router.push({
          name: 'arrestSynCom',
          query: {
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'jzbmqr' || item.statusId === 'wzbmqr' || item.statusId === 'spbmqr') {
        this.$router.push({
          name: 'evaluateSynCom',
          query: {
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'end') {
        this.$router.push({
          name: 'detailsSynCom',
          query: {
            id: item.id
          }
        })
      }
    },
    // 查询状态总数
    getNum() {
      let that = this;
      let params = {
        createBy: this.params.createBy
      }
      this.$Ajax.get(that.url.getNumUrl, params).then(data => {
        console.log('data', data)
        that.total_0 = data.data.total_0
        that.total_1 = data.data.total_1
        that.total_2 = data.data.total_2
      });
    },
    // 改变状态查询
    changeStatusType(status) {
      this.params.nameOrCode = "";
      this.createTime = null;
      this.finishTime = null;
      this.params.statusType = status;
      this.params.taskId = ''
      this.getListData();
    },
    query() {
      if (
        (this.createTime !== null) &
        (this.finishTime !== null)
      ) {
        if (
          this.createTime.getTime() > this.finishTime.getTime()
        ) {
          this.$message({
            message: "开始时间不能大于结束时间",
            type: "warning"
          });
          return;
        }
      }
      this.getListData();
    },
    // 跳转到申请
    goApply() {
        this.$router.push({
            name: 'applySynCom'
        })
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getListData();
    }
  }
};
</script>
<style src="../../../static/css/hczz/hczzManage.css" scoped></style>
<style>
.date .el-date-editor input {
  height: 28px;
}
.date .el-date-editor .el-input__icon {
  line-height: 30px;
}
.el-select.select-height {
    width: 160px;
}
.select .el-input__inner {
    height: 28px;
    line-height: 28px;
}
.select .el-input__icon {
    line-height: 28px;
}
</style>




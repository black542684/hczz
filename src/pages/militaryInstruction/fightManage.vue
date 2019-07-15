<template>
  <div class="hczz-manage">
    <header>
      <div class="header-title">
        <span>作战指令</span>
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
            <span>侦办状态: </span>
            <el-select v-model="params.taskId" clearable placeholder="请选择侦办状态" class="select-height">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in statusList" :key="index"></el-option>
            </el-select>
        </div>
        <div class="query" @click="query">查询</div>
      </div>
      <div class="table-title pubTable">
        <ul class="clearfix">
          <li style="width: 5%">编号</li>
          <li>指令名称</li>
          <li>指令编号</li>
          <li style="width: 7%">案件类别</li>
          <li>侦办单位</li>
          <li>下发时间</li>
          <li style="width: 10%">侦办状态</li>
          <li style="width: 10%">操作</li>
        </ul>
      </div>
      <div class="table-content pubTable">
        <ul class="clearfix" v-for="(item,index) in listData" :key="index" v-show="!noData">
          <li style="width: 5%">{{ index + 1 }}</li>
          <li :title="item.insName">{{ item.insName }}</li>
          <li :title="item.insCode">{{ item.insCode }}</li>
          <li style="width: 7%" :title="item.caseTypeName">{{ item.caseTypeName }}</li>
          <li :title="item.mainSpyDepName + ',' + item.coSpyDepName">{{ item.mainSpyDepName + ',' + item.coSpyDepName }}</li>
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
  name: "fightManage",
  data() {
    return {
      url: {
        getListDataUrl: "fightcmd/cmdList",
        getNumUrl: "fightcmd/fightListTotal",
        getUserInfosUrl: '/userApi/getUserLoginInfoByToken',
        getStatusListUrl: '/fightcmd/getStatusList'
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
    // 获取状态
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
        that.listData = data.data.result;
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
      let queryData = {
        id: item.id,
        deptType: item.statusId,
        statusType: this.params.statusType,
        taskId: item.taskId
      }
      if (item.spyStatus === 0) {
        this.$router.push({
          name: 'applyInstructions',
          query: {
            spyStatus: item.spyStatus,
            id: item.id,
            deptType: item.statusId,
            statusType: this.params.statusType,
            taskId: item.taskId
          }
        })
      } else if (item.statusId === 'zzzlsq') {
        this.$router.push({
          name: 'applyInstructions',
          query: queryData
        })
      } else if (item.statusId === 'zzzlsh') {
        this.$router.push({
          name: 'checkInstructions',
          query: queryData
        })
      } else if (item.statusId === 'zzzlsp') {
        this.$router.push({
          name: 'approveInstructions',
          query: queryData
        })
      } else if (item.statusId === 'zzzljs' || item.statusId === 'peizhen') {
        this.$router.push({
          name: 'receiveInstructions',
          query: queryData
        })
      } else if (item.statusId === 'zzzlfk') {
        this.$router.push({
          name: 'feedbackInstructions',
          query: queryData
        })
      } else if (item.statusId === 'ldzb') {
        this.$router.push({
          name: 'arrestInstructions',
          query: queryData
        })
      } else if (item.statusId === 'qrpj') {
        this.$router.push({
          name: 'evaluateInstructions',
          query: queryData
        })
      } else if (item.statusId === 'end') {
        this.$router.push({
          name: 'detailsInstructions',
          query: queryData
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
            name: 'applyInstructions'
        })
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getListData();
    }
  }
};
</script>
<style src="../../../static/css/fightManage.css" scoped></style>
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




<template>
  <div class="cases-warning-list">
    <el-row :gutter="20" class="el-row-style">
      <el-col :span="6" class="el-col-style">
        <div class="grid-content title-style">作战指令</div>
      </el-col>
      <el-col :span="10" :offset="8">
        <div class="grid-content">
          <el-row class="el-row-right">
            <router-link
              tag="span"
              to="/applyInstructions"
              style="display:inline-block;"
              class="btn-set-height"
            >
              <el-button type="primary" size="small" class="btn-set-height">发起</el-button>
            </router-link>
            <span class="ipt-container">
              <el-input
                v-model="rulesNames"
                placeholder="请输入指令名称/编号等"
                class="ipt-set-height"
                @keydown.enter.native="searchRulesNames"
              ></el-input>
              <i class="el-icon-search btn-search" @click="searchRulesNames"></i>
            </span>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick" class="change-tab">
      <el-tab-pane :label="tabFirName" name="first">
        <!-- tab 01 -->
        <el-form :inline="true" :model="FirForm" class="demo-form-inline">
          <el-form-item label="下发时间：">
            <el-date-picker
              v-model="FirForm.startDate"
              value-format="yyyy-MM-dd"
              @change="chooseFirStartTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：">
            <el-date-picker
              v-model="FirForm.doneDate"
              value-format="yyyy-MM-dd"
              @change="chooseFirEndTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="侦办状态：">
            <el-select v-model="FirForm.select" placeholder="请选择侦办状态" class="select-height">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="dbzlTable" style="width: 100%">
          <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
          <el-table-column prop="insName" label="指令名称" width="300"></el-table-column>
          <el-table-column prop="insCode" label="指令编号" width></el-table-column>
          <el-table-column prop="caseTypeName" width="120" label="案件类别"></el-table-column>
          <el-table-column prop="coSpyDepName" label="侦办单位"></el-table-column>
          <el-table-column prop="createTime" align="center" label="下发时间"></el-table-column>
          <el-table-column prop="statusStr" width="120" label="侦办状态">
            <template slot-scope="scope">
              <el-button
                @click="zbStatus(scope.row)"
                type="text"
                size="small"
              >{{scope.row.statusStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <div style="padding: 10px 20px;">
            <span style="line-height: 26px;color: #6b757e;">
              共
              <i style="font-size: 14px;font-style: normal;color: #121e3d;">{{totalDataDB}}</i> 条记录
            </span>
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange01"
              :page-size="pageSizeDB"
              class="page-style"
              layout="prev, pager, next, jumper"
              :total="totalDB"
            ></el-pagination>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="tabSecName" name="second">
        <!-- tab 02 -->
        <el-form :inline="true" :model="SecForm" class="demo-form-inline">
          <el-form-item label="下发时间：">
            <el-date-picker
              v-model="SecForm.startDate"
              value-format="yyyy-MM-dd"
              @change="chooseSecStartTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：">
            <el-date-picker
              v-model="SecForm.doneDate"
              value-format="yyyy-MM-dd"
              @change="chooseSecEndTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="侦办状态：">
            <el-select v-model="SecForm.select" placeholder="请选择侦办状态" class="select-height">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="wdfqTable" style="width: 100%">
          <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
          <el-table-column prop="insName" label="指令名称" width="300"></el-table-column>
          <el-table-column prop="insCode" label="指令编号" width></el-table-column>
          <el-table-column prop="caseTypeName" width="120" label="案件类别"></el-table-column>
          <el-table-column prop="coSpyDepName" label="侦办单位"></el-table-column>
          <el-table-column prop="createTime" align="center" label="下发时间"></el-table-column>
          <el-table-column prop="statusStr" width="120" label="侦办状态">
            <template slot-scope="scope">
              <el-button
                @click="zbStatus02(scope.row)"
                type="text"
                size="small"
              >{{scope.row.statusStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <div style="padding: 10px 20px;">
            <span style="line-height: 26px;color: #6b757e;">
              共
              <i style="font-size: 14px;font-style: normal;color: #121e3d;">{{totalDataFQ}}</i> 条记录
            </span>
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange02"
              :page-size="pageSizeFQ"
              class="page-style"
              layout="prev, pager, next, jumper"
              :total="totalFQ"
            ></el-pagination>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="tabThiName" name="third">
        <!-- tab 03 -->
        <el-form :inline="true" :model="ThiForm" class="demo-form-inline">
          <el-form-item label="下发时间：">
            <el-date-picker
              v-model="ThiForm.startDate"
              value-format="yyyy-MM-dd"
              @change="chooseThiStartTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：">
            <el-date-picker
              v-model="ThiForm.doneDate"
              value-format="yyyy-MM-dd"
              @change="chooseThiEndTime"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="侦办状态：">
            <el-select v-model="ThiForm.select" placeholder="请选择侦办状态" class="select-height">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="wdybTable" style="width: 100%">
          <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
          <el-table-column prop="insName" label="指令名称" width="300"></el-table-column>
          <el-table-column prop="insCode" label="指令编号" width></el-table-column>
          <el-table-column prop="caseTypeName" width="120" label="案件类别"></el-table-column>
          <el-table-column prop="coSpyDepName" label="侦办单位"></el-table-column>
          <el-table-column prop="createTime" align="center" label="下发时间"></el-table-column>
          <el-table-column prop="statusStr" width="120" label="侦办状态">
            <template slot-scope="scope">
              <el-button
                @click="zbStatus03(scope.row)"
                type="text"
                size="small"
              >{{scope.row.statusStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <div style="padding: 10px 20px;">
            <span style="line-height: 26px;color: #6b757e;">
              共
              <i style="font-size: 14px;font-style: normal;color: #121e3d;">{{totalDataYB}}</i> 条记录
            </span>
            <el-pagination
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange03"
              :page-size="pageSizeYB"
              class="page-style"
              layout="prev, pager, next, jumper"
              :total="totalYB"
            ></el-pagination>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import getURL from "../../../config/index.js";

export default {
  components: {},
  data() {
    return {
      rulesNames: "", //..搜索内容
      activeName: "first", //..默认显示第一页
      tabIndex: 0, //  设置默认索引值
      params: {

      },
      //  通用数据
      tabFirName: "我的待办（0）",
      tabSecName: "我的发起（0）",
      tabThiName: "我的已办（0）",
      totalDataDB: 0,
      totalDataFQ: 0,
      totalDataYB: 0,

      //  待办指令部分数据
      FirForm: {
        startDate: null,
        doneDate: null,
        select: ""
      },
      dbzlTable: [],
      pageSizeDB: 0,
      totalDB: 0,

      //  我的发起部分数据
      SecForm: {
        startDate: null,
        doneDate: null,
        select: ""
      },
      wdfqTable: [],
      pageSizeFQ: 0,
      totalFQ: 0,

      //  我的已办部分数据
      ThiForm: {
        startDate: null,
        doneDate: null,
        select: ""
      },
      wdybTable: [],
      pageSizeYB: 0,
      totalYB: 0
    };
  },
  mounted() {
    //  获取数据条数
    this.$Ajax
      .get("fightcmd/fightListTotal", { createBy: "jiandan" })
      .then(res => {
        // console.log(res);
        //  3个tab每个总条数
        this.totalDataDB = res.data.total_0;
        this.totalDataFQ = res.data.total_1;
        this.totalDataYB = res.data.total_2;
        this.tabFirName = `我的待办（${res.data.total_0}）`;
        this.tabSecName = `我的发起（${res.data.total_1}）`;
        this.tabThiName = `我的已办（${res.data.total_2}）`;
      })
      .catch(error => {
        console.error(error);
      });

    //  默认加载tab - 01的数据
    this.getData();
  },
  methods: {
    // 获取用户信息
    getUserInfos() {
      let that = this;
      this.$Ajax.get('/userApi/getUserLoginInfoByToken', {}).then(data => {
        console.log("用户信息", data);
        if (data.account !== "") {
          localStorage.setItem("userName", data.account);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("realName", data.realName);
          localStorage.setItem("token", data.token);
          that.params.createBy = localStorage.getItem("userName");
          that.getListData();
          that.getNum();
        }
      });
    },
    //  搜索事件
    searchRulesNames() {},

    //  tab切换事件
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      this.getData();
    },

    //  分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange01(val) {
      console.log(`当前页: ${val}`);
      this.getData(val);
    },
    handleCurrentChange02(val) {
      console.log(`当前页: ${val}`);
      this.getData(val);
    },
    handleCurrentChange03(val) {
      console.log(`当前页: ${val}`);
      this.getData(val);
    },

    //  选择时间事件，调用接口
    getData(page) {
      //  审核-审批-接收-反馈-抓捕-评价
      const time = {
        nameOrCode: this.rulesNames,
        createBy: "shenhe",
        pageNum: page
      };

      if (this.tabIndex == 0) {
        //  待办指令
        time.createTime = this.FirForm.startDate;
        time.finishTime = this.FirForm.doneDate;
        time.coprStatus = this.FirForm.select;
        time.statusType = 0;
      } else if (this.tabIndex == 1) {
        //  我的发起
        time.createTime = this.SecForm.startDate;
        time.finishTime = this.SecForm.doneDate;
        time.coprStatus = this.SecForm.select;
        time.statusType = 1;
      } else if (this.tabIndex == 2) {
        //  我的已办
        time.createTime = this.ThiForm.startDate;
        time.finishTime = this.ThiForm.doneDate;
        time.coprStatus = this.ThiForm.select;
        time.statusType = 2;
      }

      this.$Ajax.get("fightcmd/cmdList", time).then(res => {
        console.log(res);

        if (this.tabIndex == 0) {
          //  待办指令
          this.pageSizeDB = res.data.pageSize; //  分页每页条数
          this.totalDB = res.data.total; //  分页总条数
          this.dbzlTable = res.data.result; //  table数据
        } else if (this.tabIndex == 1) {
          //  我的发起
          this.pageSizeFQ = res.data.pageSize; //  分页每页条数
          this.totalFQ = res.data.total; //  分页总条数
          this.wdfqTable = res.data.result; //  table数据
        } else if (this.tabIndex == 2) {
          //  我的已办
          this.pageSizeYB = res.data.pageSize; //  分页每页条数
          this.totalYB = res.data.total; //  分页总条数
          this.wdybTable = res.data.result; //  table数据
        }
      });
    },

    //  待办指令时间选择事件
    chooseFirStartTime(val) {
      // console.log(val);
      this.getData();
    },
    chooseFirEndTime(val) {
      // console.log(val);
      this.getData();
    },
    //  待办指令时间选择事件

    //  我的发起时间选择事件
    chooseSecStartTime(val) {
      // console.log(val);
      this.getData();
    },
    chooseSecEndTime(val) {
      // console.log(val);
      this.getData();
    },
    //  我的发起时间选择事件

    //  我的已办时间选择事件
    chooseThiStartTime(val) {
      // console.log(val);
      this.getData();
    },
    chooseThiEndTime(val) {
      // console.log(val);
      this.getData();
    },
    //  我的已办时间选择事件

    //  table - 01 侦办状态点击事件
    zbStatus(row) {
      // console.log(row.id)
      if (row.statusStr == "作战指令审核") {
        this.$router.push({ name: "checkInstructions", query: { id: row.id } });
      } else if (row.statusStr == "作战指令审批") {
        this.$router.push({
          name: "approveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令接收") {
        this.$router.push({
          name: "receiveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令反馈") {
        this.$router.push({
          name: "feedbackInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "落地抓捕") {
        this.$router.push({
          name: "arrestInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "确认评价") {
        this.$router.push({
          name: "evaluateInstructions",
          query: { id: row.id }
        });
      }
    },

    //  table - 02 侦办状态点击事件
    zbStatus02(row) {
      //console.log(row.statusStr)
      if (row.statusStr == "作战指令审核") {
        this.$router.push({ name: "checkInstructions", query: { id: row.id } });
      } else if (row.statusStr == "作战指令审批") {
        this.$router.push({
          name: "approveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令接收") {
        this.$router.push({
          name: "receiveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令反馈") {
        this.$router.push({
          name: "feedbackInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "落地抓捕") {
        this.$router.push({
          name: "arrestInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "确认评价") {
        this.$router.push({
          name: "evaluateInstructions",
          query: { id: row.id }
        });
      }
    },

    //  table - 03 侦办状态点击事件
    zbStatus03(row) {
      //console.log(row.statusStr)
      if (row.statusStr == "作战指令审核") {
        this.$router.push({
          name: "checkInstructions",
          query: { id: row.id, show: false }
        });
      } else if (row.statusStr == "作战指令审批") {
        this.$router.push({
          name: "approveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令接收") {
        this.$router.push({
          name: "receiveInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "作战指令反馈") {
        this.$router.push({
          name: "feedbackInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "落地抓捕") {
        this.$router.push({
          name: "arrestInstructions",
          query: { id: row.id }
        });
      } else if (row.statusStr == "确认评价") {
        this.$router.push({
          name: "evaluateInstructions",
          query: { id: row.id }
        });
      }
    }
  },
  watch: {}
};
</script>

<style scoped lang="less">
@import "../../../static/css/SCManagement.less";
.select-height {
  /deep/.el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  /deep/.el-input__icon {
    line-height: 28px;
  }
}
</style>

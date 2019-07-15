<template>
  <div class="cases-warning-list">
    <el-row :gutter="20" class="el-row-style">
      <el-col :span="6" class="el-col-style">
        <div class="grid-content title-style">作战指令（{{caseTotal}}）</div>
      </el-col>
      <el-col :span="10" :offset="8">
        <div class="grid-content">
          <el-row class="el-row-right">
            <el-button type="primary" size="small" class="btn-set-height">发起</el-button>
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
      <el-tab-pane :label="tabName[0]" name="first">
        <!-- tab 01 -->
        <el-form :inline="true" :model="firstForm" class="demo-form-inline">
          <el-form-item label="下发时间：">
            <el-date-picker
              v-model="firstForm.startDate"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：">
            <el-date-picker
              v-model="firstForm.doneDate"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-table :data="dbzlTable" style="width: 100%">
          <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="合战名称" width="300"></el-table-column>
          <el-table-column prop="number" label="合战编号" width></el-table-column>
          <el-table-column prop="type" width="120" label="案件类别"></el-table-column>
          <el-table-column prop="unit" label="合战部门"></el-table-column>
          <el-table-column prop="time" align="center" label="下发时间"></el-table-column>
          <el-table-column prop="state" width="120" label="合战状态"></el-table-column>
        </el-table>
        <template>
          <div style="padding: 10px 20px;">
            <span style="line-height: 26px;color: #6b757e;">
              共
              <i style="font-size: 14px;font-style: normal;color: #121e3d;">{{totalData}}</i> 条记录
            </span>
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="100"
              class="page-style"
              layout="prev, pager, next, jumper"
              :total="1000"
            ></el-pagination>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="tabName[1]" name="second">
        <!-- tab 02 -->
        <el-form :inline="true" :model="firstForm" class="demo-form-inline">
          <el-form-item label="下发时间：">
            <el-date-picker
              v-model="firstForm.startDate"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：">
            <el-date-picker
              v-model="firstForm.doneDate"
              class="date-picker-style"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-table :data="dbzlTable" style="width: 100%">
          <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="合战名称" width="300"></el-table-column>
          <el-table-column prop="number" label="合战编号" width></el-table-column>
          <el-table-column prop="type" width="120" label="案件类别"></el-table-column>
          <el-table-column prop="unit" label="合战部门"></el-table-column>
          <el-table-column prop="time" align="center" label="下发时间"></el-table-column>
          <el-table-column prop="state" width="120" label="合战状态"></el-table-column>
        </el-table>
        <template>
          <div style="padding: 10px 20px;">
            <span style="line-height: 26px;color: #6b757e;">
              共
              <i style="font-size: 14px;font-style: normal;color: #121e3d;">{{totalData}}</i> 条记录
            </span>
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="100"
              class="page-style"
              layout="prev, pager, next, jumper"
              :total="1000"
            ></el-pagination>
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane :label="tabName[2]" name="third">角色管理</el-tab-pane>
      <el-tab-pane :label="tabName[3]" name="four">草稿箱</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      caseTotal: 100,
      rulesNames: "",
      activeName: "first",
      tabName: [
        "待办指令（12）",
        "我的发起（20）",
        "我的已办（55）",
        "草稿箱（35）"
      ],

      //  待办指令  日期form
      firstForm: {
        startDate: "",
        doneDate: ""
      },

      //  待办指令  table
      dbzlTable: [
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        },
        {
          name: "幸福小区溜门盗窃串案",
          number: "ZL130997894872",
          type: "盗窃",
          unit: "网侦；技侦；图侦；",
          time: "2019-04-15 15:14:45",
          state: "指令申请"
        }
      ],
      totalData: "1231"
    };
  },
  mounted() {},
  methods: {
    searchRulesNames() {
      alert(`确定要搜索${this.rulesNames}嘛？`);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //  分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/SCManagement.less";
</style>

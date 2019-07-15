<template>
  <div id="synthesizeExpand">
    <div class="topBox">
      <div class="selectBox">
        <span>*</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="inpBox">
        <el-input placeholder="请输入内容" v-model="input4">
          <template slot="append">查找串案</template>
        </el-input>
      </div>
    </div>
    <div class="tableBox">
      <div class="optionBox">
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10]"
          :page-size="100"
          layout="slot,slot"
          :total="400"
        >
          <div class="customPageCom">
            <span>|&lt;</span>
            <span @click="prevClick">&lt;</span>
            <span>{{currentPage4}}/400</span>
            <span>&gt;</span>
            <span>&gt;|</span>
          </div>
        </el-pagination>-->
        <custom-pagination
          :firstPage="1"
          :lastPage="20"
          :currentPage="currentPage"
          :totalPage="50"
          @handleCurrentChangeSub="handleCurrentChange"
          @currentPageSub="currentPage--"
          @currentPageAdd="pageAdd"
        ></custom-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import customPagination from "../baseComponents/customPagination";
export default {
  name: "synthesizeExpand", //综合扩串
  data() {
    return {
      options: [
        {
          value: "seriesnum",
          label: "串案编号"
        },
        {
          value: "casenum",
          label: "案件编号"
        },
        {
          value: "seriesname",
          label: "串案名称"
        }
      ],
      value: "seriesnum",
      input4: "",
      currentPage4: 4,
      pageComObj: {
        firstPage: 1,
        lastPage: 20,
        currentPage: 1,
        total: 50
      },
      currentPage: 5
    };
  },
  components: {
    "custom-pagination": customPagination
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    pageAdd() {
      this.currentPage++;
      console.log("??", this.currentPage);
    }
  }
};
</script>

<style scoped lang="less">
</style>

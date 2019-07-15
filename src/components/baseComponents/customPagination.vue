<template>
  <div>
    <el-pagination :current-page="currentPage" layout="slot,pager" :total="totalPage">
      <div class="customPageCom">
        <button @click="toFirstPage">|&lt;</button>
        <button @click="prevClick">&lt;</button>
        <span>{{currentPage}}</span>
        <button @click="nextClick">&gt;</button>
        <button @click="toLastPage">&gt;|</button>
      </div>
    </el-pagination>
    <span>{{currentPage}}</span>
  </div>
</template>
<script>
export default {
  name: "customPagination",
  props: {
    firstPage: {
      type: Number,
      required: true
    },
    lastPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true,
      default: 1
    },
    totalPage: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPageNum: this.currentPage
    };
  },
  methods: {
    prevClick() {
      // this.currentPageNum++;
      // console.log("prev", this.currentPageNum);
      this.$emit("currentPageSub");
    },
    nextClick() {
      // this.currentPageNum--;
      this.$emit("currentPageAdd");
    },
    handleCurrentChange(val) {
      console.log("child", val);
      // this.currentPageNum = val;
      this.$emit("handleCurrentChangeSub", val);
    },
    toFirstPage() {
      // this.currentPageNum = this.firstPage;
    },
    toLastPage() {
      // this.currentPageNum = this.lastPage;
    }
  },
  watch: {
    currentPage(val) {
      this.currentPageNum = val;
      this.$emit("handleCurrentChangeSub", val);
    }
  }
};
</script>
<style scoped lang="less">
.customPageCom {
  button {
    // display: inline-block;
    // border: 1px solid #000;
    // background-color: blue;
  }
}
</style>

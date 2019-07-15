<template>
  <div style="margin-bottom:10px;">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item" v-if="sjfkInfoList.length>0">
        <div class="xsxc-form-title">市局反馈信息</div>
        <div class="approve-list" v-for="(item,index) in sjfkInfoList" :key="index">
          <el-form-item label="反馈人：">
            <div>{{ item.createName }}</div>
          </el-form-item>
          <el-form-item label="反馈单位：">
            <div>{{ item.depName }}</div>
          </el-form-item>
          <el-form-item label="反馈时间：">
            <div>{{ item.date }}</div>
          </el-form-item>
          <el-form-item label="反馈意见：" class="xsxc-width100">
            <p>{{ item.suggest }}</p>
          </el-form-item>
          <el-form-item label="反馈附件：" class="xsxc-width100">
            <div>
              <a
                :key="index"
                v-for="(item,index) in sjfkFJInfoList"
                style="margin-right:10px;color:#409EFF;"
                :href="item.fileVisitPath"
                target="_blank"
              >{{item.fileName}} ;</a>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["sjfkInfoList", "sjfkFJInfoList"],
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
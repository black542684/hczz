<template>
  <div style="margin-bottom:10px;">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item" v-if="fkInfoList.length>0">
        <template v-for="(item,index) in fkInfoList">
          <div v-if="item.explain" :key="index">
            <div class="xsxc-form-title">提请市局信息</div>
            <div class="approve-list">
              <el-form-item label="提请人：">
                <div>{{ item.createName }}</div>
              </el-form-item>
              <el-form-item label="提请单位：">
                <div>{{ item.depName }}</div>
              </el-form-item>
              <el-form-item label="提请时间：">
                <div>{{ item.date }}</div>
              </el-form-item>
              <el-form-item label="提请市局：" class="xsxc-width100">
                <div>{{ item.explain }}</div>
              </el-form-item>
            </div>
          </div>

          <div v-if="!item.explain" :key="index">
            <div class="xsxc-form-title">反馈信息</div>
            <div class="approve-list">
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
                <div>{{ item.suggest }}</div>
              </el-form-item>
              <el-form-item label="反馈附件：" class="xsxc-width100">
                <div>
                  <a
                    :key="index"
                    v-for="(item,index) in fkFJInfoList"
                    style="margin-right:10px;color:#409EFF;"
                    :href="item.fileVisitPath"
                    target="_blank"
                  >{{item.fileName}} ;</a>
                </div>
              </el-form-item>
            </div>
          </div>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["fkInfoList", "fkFJInfoList"],
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
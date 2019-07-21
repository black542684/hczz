<template>
  <div style="margin-bottom:10px;" v-if="showFeedbackData.length > 0">
    <el-form style="margin-top:10px;" :inline="true">
      <div class="xsxc-form-item">
        <div class="xsxc-form-title">市局反馈信息</div>
        <div class="approve-list" v-for="(item,index) in showFeedbackData" :key="index">
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
            <p>{{ item.feedbackObj.coprDepts[0].feedbackContent }}</p>
          </el-form-item>
          <el-form-item label="反馈附件：" class="xsxc-width100">
            <div>
              <a
                :key="index"
                v-for="(item2,index) in item.feedbackObj.coprDepts[0].attachments"
                style="margin-right:10px;color:#409EFF;"
                :href="item2.fileVisitPath"
                target="_blank"
              >{{item2.fileName}} ;</a>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["coprDepts",'showFeedback'],
    data() {
      return {
      fkFileList: [],
      showFeedbackData: []
    };
  },
  created() {
    // if(this.$route.query.isSQ === 1) return;
    
  },
  watch: {
    'showFeedback' : function (val) {
      this.showFeedbackData = val;
      console.log('反馈数据1111',val);
      // return;
      this.showFeedbackData.forEach(item => {
        item.feedbackObj = JSON.parse(item.feedbackObj);
      });

      console.warn('反馈数据222', this.showFeedbackData);
    }
  },
  mounted() {
    // console.warn('反馈附件', this.coprDepts);
    this.coprDepts.forEach(item=>{
      if(item.feedbackContent){
        item.attachments.forEach(atta=>{
          if(atta.classify==7){
            this.fkFileList.push(atta);
          }
        });
      }
      //this.showFeedbackData.push(item.feedbackContent);
    });
    console.log('反馈数据',this.showFeedbackData);
    console.log('反馈附件列表',this.fkFileList);
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
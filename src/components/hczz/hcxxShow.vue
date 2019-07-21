<template>
  <el-form
    ref="form"
    :model="hcxxFormShow"
    :inline="true"
    label-width="100px"
    class="instruct-form form-style"
  >
    <div class="xsxc-form-item">
      <div class="xsxc-form-title">合成信息</div>
      <el-form-item label="合战部门：" class="compound-info">
        <el-radio-group v-model="defaultSelectHzbm" class="radio-group-style">
          <template>
            <el-radio
              v-for="item in coprDepts"
              :label="item.deptTypeName"
              :key="item.deptType"
              @change="hzbmChange(item.deptType)"
            ></el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="查询类别：">
        <div>{{hcxxFormShow.queryType}}</div>
      </el-form-item>
      <el-form-item label="查询内容：">
        <div>{{hcxxFormShow.queryContent}}</div>
      </el-form-item>
      <!-- 占位 -->
      <el-form-item></el-form-item>
      <el-form-item label="附件：" class="compound-info">
        <template>
          <a
            v-for="(item,index) in hcxxFormShow.attachments"
            :key="index"
            style="margin-right:10px;color:#409EFF;"
            :href="item.fileVisitPath"
            target="_blank"
          >{{item.fileName}} ;</a>
        </template>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  props: ['coprDepts'],
  data() {
    return {
      defaultSelectHzbm: "", //..页面加载完毕之后，默认选中的合战部门
      //  后台返回给前端的合战部门数据
      /* coprDepts: [
        {
          deptType: "0",
          deptTypeName: "技侦",
          queryType: "01查询类别",
          queryContent: "01查询内容-技侦",
          attachments: [
            {
              fileName: "百度",
              fileVisitPath: "https://www.baidu.com"
            },
            {
              fileName: "京东",
              fileVisitPath: "https://www.jd.com"
            }
          ]
        },
        {
          deptType: "1",
          deptTypeName: "网安",
          queryType: "02查询类别",
          queryContent: "02查询内容-网安",
          attachments: [
            {
              fileName: "01百度",
              fileVisitPath: "https://www.baidu.com"
            },
            {
              fileName: "02京东",
              fileVisitPath: "https://www.jd.com"
            }
          ]
        }
      ], */
      //  保存当前选中的合战部门数据用来展示
      hcxxFormShow: {}
    };
  },
  created() {
    
  },
  mounted() {
    this.$nextTick(() => {
      this.coprDepts = this.coprDepts.filter(item => {
        return this.$route.query.statusStr.includes(item.deptTypeName);
      });
    })
  },
  watch: {
    coprDepts: function (value) {
      
      if (this.coprDepts.length > 0) {
        //  获取第一个部门的数据并渲染
        this.hcxxFormShow = this.coprDepts[0];
        //  页面加载完毕之后，默认选中的合战部门
        this.defaultSelectHzbm = this.coprDepts[0].deptTypeName;
      }
      console.log(value);
    }
  },
  methods: {
    //  合战部门切换事件
    hzbmChange(value) {
      this.coprDepts.forEach(item => {
        if (item.deptType === value) {
          this.hcxxFormShow = item;
        }
      });
    }
  }
};
</script>


<style>
.el-form-item {
  width: 33%;
  margin-right: 0 !important;
}
.compound-info {
  width: 100% !important;
}

/* 修改单选组样式 */
.radio-group-style .el-radio__input {
  display: none;
}
.radio-group-style .el-radio__input.is-checked + .el-radio__label {
  font-weight: bold;
}
</style>
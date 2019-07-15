<template>
  <div id="searchMode">
    <div class="search">
      <div class="title">
        <i class="iconfont icon-sousuomoshi"></i> 全息搜索
      </div>
      <div class="searchRow">
        <select-down
          class="typeInput"
          :defaultProps="{name: 'typeName'}"
          :width="125"
          :height="42"
          :val="typeName"
          @change="changeType"
          :data="typeData"      
        ></select-down>
        <input class="searchInput" @keyup.enter="goSearchList" v-model.trim="keyword" type="text">
        <span class="searchBtn" @click="goSearchList">搜索</span>
      </div>
    </div>
  </div>
</template>
<script>
import selectDown from '../../components/selectDown'
import api from '../../service/api.js'
export default {
  name: 'searchMode',
  components: {
    'select-down': selectDown
  },
  data () {
    return {
      // 查询分类Id
      typeUid: '',
      // 分类数据
      typeData: [],
      // 搜索关键字
      keyword: '',
      typeName: ''
    }
  },
  mounted () {
    this.getAllTypes()
  },
  methods: {
    // 选择分类
    changeType (item) {
      this.typeUid = item.uid
    },
    // 获取分类列表
    getAllTypes () {
      let param = {
        showType: 'tree'
      }
      api.post('classification/getAllTypes', param).then(data => {
        console.log(data)
        this.typeData = data
        this.typeData.unshift({typeName: '全部', uid: '0'})
        this.typeUid = '0'
        this.typeName = '全部'
      }).catch(e => {
        console.error(e, '获取分类列表失败')
      })
    },
    goSearchList () {
      if (this.keyword === '') {
        this.$message({message: '请输入关键字', type: 'warning'})
        return
      }
      sessionStorage.setItem('s_typeUid', this.typeUid)
      sessionStorage.setItem('s_keyword', this.keyword)
      this.$router.push({path: '/searchList'})
    }
  }
}
</script>
<style lang="css" scoped>
#searchMode {
  position: relative;
  width: 100%;
  background-color: #f8f8f9;
}
.search {
  position: absolute;
  top: 20%;
  width: 100%;
  text-align: center;
}
.title {
  font-size: 30px;
  color: #2d8cf0;
}
.title .icon-sousuomoshi {
  font-size: 30px;
}
.searchRow {
  display: inline-block;
  margin-top: 30px;
}
.typeInput {
  float: left;
}
.typeInput > input {
  border-radius: 4px 0 0 4px;
}
.searchInput {
  float: left;
  width: 350px;
	height: 42px;
	background-color: #ffffff;
  border: solid 1px #dcdee2;
  border-left: none;
  outline: none;
  padding-left: 10px;
}
.searchBtn {
  float: left;
  width: 100px;
  height: 42px;
  line-height: 42px;
  border-radius: 4px;
  border-radius: 0 4px 4px 0;
  background-color: #2d8cf0;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
<style>
#searchMode .box > input {
  border-radius: 4px 0 0 4px;
}
</style>

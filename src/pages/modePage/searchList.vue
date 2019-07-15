<template>
  <div id="searchList">
    <div class="mainBox" @scroll="floatSearchRow">
      <i @click="backTop" class="iconfont icon-fanhuidingbu"><span>返回顶部</span></i>
      <div class="searchRow">
        <select-down
          class="typeInput"
          :defaultProps="{name: 'typeName'}"
          :width="125"
          :height="35"
          :valId="typeUid"
          defaultId="uid"
          @change="changeType"
          :data="typeData"      
        ></select-down>
        <input class="searchInput" @keyup.enter="getResult" v-model="keyword" type="text">
        <span class="searchBtn" @click="getResult">搜索</span>
      </div>
      <div class="noData" v-show="searchData.length === 0 && noDataFlag">
        <p class="noDataText">很抱歉，没有找到“<span>{{noDataKeyword}}</span>”相关的结果。</p>
        <p class="noDataTip">温馨提示：</p>
        <p class="noDataTip">请检查您输入的是否正确</p>
        <p class="noDataTip">可尝试改变搜索类别</p>
      </div>
      <div class="list" v-show="searchData.length !== 0">
        <div class="listItem" v-for="(item, i1) in searchData" :key="i1">
          <div class="typeTitle">{{item.typeInfo[0].typeName}} <span class="typeCount">{{item.typeInfo[0].totleNum}}</span></div>
          <div class="tabList clearfix">
            <span 
              class="tabItem" 
              :class="{active: item.currentType === tabItem.typeId}"
              @click="getEntityData(item, tabItem)"
              v-for="(tabItem, i2) in item.subTypeInfo" 
              :key="i1 + '-' + i2">{{tabItem.typeName}} {{tabItem.num}}</span>
          </div>
          <div class="infoList">
            <div class="infoItem" v-for="(infoItem, i3) in item.attrData" :key="i1 + '-' + i3">
              <div class="infoTitle">{{item.currentTypeName}}
                <span class="goDetail" @click="goDetail(infoItem, item)">更多详情</span>
              </div>
              <div class="infoTable clearfix">
                <!-- <i class="iconfont icon-tuximoshi"></i> -->
                <span class="infoTableItem" v-for="(attrItem, i4) in infoItem.list" :key="i1 + '-' + i4" :title="attrItem.value"><span class="itemKey">{{attrItem.key}}：</span>{{attrItem.value}}</span>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                v-show="item.pageTotal > 3"
                @current-change="handleCurrentChange(item)"
                :current-page.sync="item.currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="item.pageTotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import selectDown from '../../components/selectDown'
import api from '../../service/api.js'
export default {
  name: 'searchList',
  components: {
    'select-down': selectDown
  },
  data () {
    return {
      searchRowTop: 0,
      // 查询分类Id
      typeUid: '',
      // 分类数据
      typeData: [],
      // 搜索关键字
      keyword: '',
      noDataKeyword: '',
      noDataFlag: false,
      searchData: [],
      pageSize: 3
    }
  },
  mounted () {
    this.getAllTypes().then(() => {
      this.typeUid = sessionStorage.getItem('s_typeUid')
      this.keyword = sessionStorage.getItem('s_keyword')
      this.noDataKeyword = this.keyword
      return this.getDataCountByType()
    }).then(() => {
      this.searchData.forEach(el => {
        this.getAttrData(el, el.subTypeInfo[0])
      })
    })
  },
  methods: {
    // 使搜索栏浮动
    floatSearchRow (e) {
      let searchRow = document.querySelector('.searchRow')
      searchRow.style.top = e.target.scrollTop + 'px'
    },
    // 返回顶部
    backTop () {
      let mainBox = document.querySelector('.mainBox')
      mainBox.scrollTop = 0
    },
    // 选择分类
    changeType (item) {
      this.typeUid = item.uid
    },
    handleCurrentChange (item) {
      console.log(item, 'dangqin')
      this.getAttrData(item, item.currentTab)
    },
    // 获取分类列表
    getAllTypes () {
      let param = {
        showType: 'tree'
      }
      return api.post('classification/getAllTypes', param).then(data => {
        console.log(data)
        this.typeData = data
        this.typeData.unshift({typeName: '全部', uid: '0'})
      }).catch(e => {
        console.error(e, '获取分类列表失败')
      })
    },
    // 获取查询分类数量及tab
    getDataCountByType () {
      let param = {
        typeId: this.typeUid,
        dataId: this.keyword
      }
      return api.post('searchModeController/getDataCountByType', {queryStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        data.forEach(el => {
          console.log(el)
          el.attrData = []
          el.currentTab = el.subTypeInfo[0]
          el.currentPage = 1
          el.pageTotal = el.subTypeInfo[0].num * 1
          el.currentType = el.subTypeInfo[0].typeId
          el.currentTypeName = el.subTypeInfo[0].typeName
        })
        this.searchData = data
        this.noDataFlag = true
        this.noDataKeyword = this.keyword
      }).catch(e => {
        console.error(e, '获取查询分类结果失败')
      })
    },
    // 获取tab的信息
    getEntityData (item, tab) {
      item.currentTab = tab
      item.currentType = tab.typeId
      item.currentPage = 1
      item.currentTypeName = tab.typeName
      item.pageTotal = tab.num * 1
      this.getAttrData(item, tab)
    },
    // 查询tab里的表格信息
    getAttrData (item, tab) {
      // 获取属性的key值
      let param = {
        typeUid: tab.typeId,
        attributeType: 1
      }
      api.post('classification/getAttributesByTypeUid', {queryStr: JSON.stringify(param)}).then(data => {
        // console.log(data, 'attrdata')
        let attrKeyList = data
        // 获取属性的value值
        let param = {
          dataId: this.keyword,
          typeId: tab.typeId,
          searchLevel: 1,
          pageNo: item.currentPage + '',
          pageSize: this.pageSize
        }
        api.post('canvasManageController/queryEntity', {paraStr: JSON.stringify(param)}).then(data => {
          // console.log(data, 'value')
          if (data && data.length !== 0) {
            item.attrData = []
            data.forEach(el => {
              let listItem = []
              for (let i = 0; i < attrKeyList.length; i++) {
                const key = attrKeyList[i]
                let obj = {key: key.attributeCnName, value: el[key.attributeName]}
                listItem.push(obj)
              }
              item.attrData.push({list: listItem, tableKey: el.table_key})
            })
          }
        }).catch(e => {
          console.error(e, '获取属性值失败')
        })
      }).catch(e => {
        console.error(e, '获取属性键失败')
      })
    },
    // 点击搜索事件
    getResult () {
      if (this.keyword === '') {
        // this.$message({message: '请输入关键字', type: 'warning'})
        this.$router.push('/searchMode')
        return
      }
      sessionStorage.setItem('s_typeUid', this.typeUid)
      sessionStorage.setItem('s_keyword', this.keyword)
      this.getDataCountByType().then(() => {
        this.searchData.forEach(el => {
          this.getAttrData(el, el.subTypeInfo[0])
        })
      })
    },
    goDetail (infoItem, item) {
      const {href} = this.$router.resolve({path: '/searchOfDetail', query: {typeId: item.currentType, tableKey: infoItem.tableKey, typeName: item.currentTypeName}})
      window.open(href, '_blank')
    }
  }
}
</script>
<style lang="css" scoped>
#searchList {
  width: 100%;
  background-color: #f8f8f9;
}
.mainBox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 68px 12% 0;
  overflow-y: auto;
}
.icon-fanhuidingbu {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 16px;
  cursor: pointer;
}
.icon-fanhuidingbu > span {
  display: inline-block;
  width: 16px;
  text-align: center;
  font-size: 12px;
}
.searchRow {
  position: absolute;
  top: 0;
  width: 87%;
  background-color: #f8f8f9;
  padding: 16px 0;
  z-index: 100;
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
  height: 35px;
  background-color: #fff;
  border: solid 1px #dcdee2;
  border-left: none;
  outline: none;
  padding-left: 10px;
}
.searchBtn {
  float: left;
  width: 80px;
  height: 35px;
  line-height: 35px;
  border-radius: 4px;
  border-radius: 0 4px 4px 0;
  background-color: #2d8cf0;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
.list {
  width: 100%;
  padding-right: 5px;
  height: calc(100% - 80px);
}
.listItem {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  background-color: #fff;
  margin-bottom: 20px;
}
.typeTitle {
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  color: #2d8cf0;
  padding-left: 10px;
}
.typeCount {
  height: 16px;
  background-color: #2d8cf0;
  color: #fff;
  border-radius: 4px;
  padding: 0 10px;
  margin-left: 3px;
}
.tabList {
  width: 100%;
  background: url("../../../static/images/listline.png") repeat;
}
.tabItem {
  float: left;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  cursor: pointer;
}
.tabItem:hover,
.goDetail:hover,
.icon-tuximoshi:hover,
.icon-fanhuidingbu:hover {
  color: #5cadff;
}
.tabItem.active {
  border-bottom: 2px solid #2d8cf0;
  color: #2d8cf0;
}
.infoItem {
  padding-top: 14px;
}
.icon-tuximoshi {
  position: absolute;
  bottom: 10px;
  right: 0;
  cursor: pointer;
}
.infoTitle {
  height: 16px;
  padding-left: 10px;
  font-weight: bold;
  color: #17233d;
}
.goDetail {
  font-weight: normal;
  float: right;
  color: #2d8cf0;
  cursor: pointer;
}

.infoTable {
  border-bottom: 1px solid #dcdee2;
  position: relative;
  padding-bottom: 10px;
}
.infoTableItem {
  float: left;
  width: 33.32%;
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  color: #808695;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.infoTableItem:last-of-type {
  width: calc(33.32% - 20px);
}
.itemKey {
  color: #17233d;
}
.pagination {
  text-align: center;
  padding-top: 5px;
}

.noDataText {
  font-size: 14px;
  height: 35px;
}
.noDataText > span {
  color: #d21c1c;
}
.noDataTip {
  height: 24px;
  font-size: 12px;
  color: #808695;
}
</style>
<style>
#searchList .box > input {
  border-radius: 4px 0 0 4px;
}
</style>
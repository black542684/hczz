<template>
  <div id="searchOfDetail">
    <div class="mainBox">
      <div class="title">{{typeName}}</div>
      <div class="infoItem">
        <div class="infoTitle">{{typeName}}</div>
        <div class="infoTable clearfix">
          <!-- <i class="iconfont icon-tuximoshi"></i> -->
          <span class="infoTableItem" v-for="(item, i) in attrData" :key="i"><span class="itemKey">{{item.key}}：</span>{{item.value}}</span>
        </div>
      </div>
      <div class="infoTableOfDetail">
        <div class="tabList clearfix">
          <span class="tabItem" :class="{active: currentTab === item.tableId}" @click="getDetailData(item)" v-for="(item, i) in tabData" :key="i">{{item.tableCnName}} {{item.num}}</span>
        </div>
        <div class="infoOfDetail clearfix">
          <!-- <div class="image">
            <img src="../../../static/images/entity.png" alt="">
          </div> -->
          <div class="info clearfix" v-for="(item, i1) in detailAttrData" :key="i1">
            <span class="infoText" v-for="(infoItem, i2) in item" :key="i1 + '-' + i2" :title="infoItem.value"><span class="infoKey">{{infoItem.key}}：</span>{{infoItem.value}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../service/api.js'
export default {
  name: 'searchOfDetail',
  data () {
    return {
      typeId: '',
      tableKey: '',
      typeName: '',
      tabData: [],
      currentTab: '',
      attrData: [],
      detailAttrData: []
    }
  },
  mounted () {
    this.typeId = this.$route.query.typeId
    this.tableKey = this.$route.query.tableKey
    this.typeName = this.$route.query.typeName
    this.getAttrData()
    this.getDetailTab().then(() => {
      for (let i = 0; i < this.tabData.length; i++) {
        const el = this.tabData[i]
        if (el.num && el.num !== '0') {
          this.getDetailData(el)
          break
        }
      }
    })
  },
  methods: {
    // 查询tab里的表格信息
    getAttrData () {
      // 获取属性的key值
      let param = {
        typeUid: this.typeId,
        attributeType: 1
      }
      api.post('classification/getAttributesByTypeUid', {queryStr: JSON.stringify(param)}).then(data => {
        // console.log(data, 'attrdata')
        let attrKeyList = data
        // 获取属性的value值
        let param = {
          dataId: this.tableKey,
          typeId: this.typeId,
          searchLevel: 1
          // pageNo: item.currentPage + '',
          // pageSize: this.pageSize + ''
        }
        api.post('canvasManageController/queryEntity', {paraStr: JSON.stringify(param)}).then(data => {
          console.log(data, 'value')
          if (data && data.length !== 0) {
            this.attrData = []
            for (let i = 0; i < attrKeyList.length; i++) {
              const el = attrKeyList[i]
              let obj = {key: el.attributeCnName, value: data[0][el.attributeName]}
              this.attrData.push(obj)
            }
          }
        }).catch(e => {
          console.error(e, '获取属性值失败')
        })
      }).catch(e => {
        console.error(e, '获取属性键失败')
      })
    },
    // 获取tab栏数据
    getDetailTab () {
      let param = {
        typeId: this.typeId,
        dataId: this.tableKey
      }
      return api.post('searchModeController/getDataCountByTable', {queryStr: JSON.stringify(param)}).then(data => {
        console.log(data)
        this.tabData = data
      }).catch(e => {
        console.error(e)
      })
    },
    getDetailData (item) {
      this.currentTab = item.tableId
      let param = {
        tableUid: item.tableId,
        attributeType: 8
      }
      api.post('classification/getTableAttributes', {queryStr: JSON.stringify(param)}).then(data => {
        // console.log(data, 'attrdata')
        let attrKeyList = data
        let param = {
          tableId: item.tableId,
          dataId: this.tableKey
        }
        api.post('searchModeController/getDataDetail', {queryStr: JSON.stringify(param)}).then(data => {
          console.log(data)
          if (data && data.length !== 0) {
            this.detailAttrData = []
            data.forEach(el => {
              let listItem = []
              for (let i = 0; i < attrKeyList.length; i++) {
                const key = attrKeyList[i]
                let obj = {key: key.attributeCnName, value: el[key.attributeName]}
                listItem.push(obj)
              }
              this.detailAttrData.push(listItem)
            })
          }
        }).catch(e => {
          console.error(e)
        })
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>
<style lang="css" scoped>
#searchOfDetail {
  width: 100%;
  background-color: #f8f8f9;
}
.mainBox {
  width: 100%;
  height: 100%;
  padding: 0 12%;
  overflow-y: auto;
}
.title {
  padding-top: 15px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
  height: 40px;
  color: #2d8cf0;
}
.infoItem {
  padding-top: 14px;
  background-color: #ffffff;
  border-radius: 4px;
  border: solid 1px #dcdee2;
}
.icon-tuximoshi {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
.infoTitle {
  height: 18px;
  padding-left: 20px;
  font-weight: bold;
  color: #17233d;
}
.infoTable {
  position: relative;
  padding-bottom: 10px;
}
.infoTableItem,
.infoText {
  float: left;
  width: 33.32%;
  height: 30px;
  line-height: 30px;
  padding-left: 30px;
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

.infoTableOfDetail {
  margin: 16px 0;
  padding: 0 10px;
  background-color: #fff;
  border: 1px solid #dcdee2;
  border-radius: 4px;
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
.icon-tuximoshi:hover {
  color: #5cadff;
}
.tabItem.active {
  border-bottom: 2px solid #2d8cf0;
  color: #2d8cf0;
}
/* .infoOfDetail {
  padding-top: 20px;
} */
.image {
  float: left;
  width: 150px;
  height: 100%;
  text-align: center;
}
.image > img {
  width: 89px;
  height: 124px;
}
.info {
  float: left;
  width: 100%;
  padding-top: 20px;
  border-bottom: 1px solid #dcdee2;
}
.info:last-of-type {
  border-bottom: none;
}
.infoText {
  padding-left: 20px;
}
.infoKey {
  color: #17233d;
}
</style>

<template>
  <div class="cdrcontainer">
    <div class="headNavigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/calllist' }">话单研判</el-breadcrumb-item>
        <el-breadcrumb-item>话单字段配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--配置字段区域-->
    <div class="cdrfiledconfig">
      <div class="fctab">
        <el-tabs v-model="modelidname" :tab-position="tabPosition" @tab-click="tabChange" type="card" closable>
          <el-tab-pane v-for="item in modelList" :key="item.id" :id="item.id" :name="item.templateName">
            <span slot="label">
              <span class="tabtitcon">
                <span @dblclick="editName(item.id)" v-show="!item.ifedit">{{item.templateName}}</span>
              </span>
              <span class="tabtitopr" v-show="!item.ifedit">
                <el-switch v-model="item.statue" @change="modelStatus(item.id,item.statue)"></el-switch>
              </span>
            </span>
            <callfiled v-if="modelid" :templateid="modelid"></callfiled>
          </el-tab-pane>
          <el-tab-pane v-if="addisedit">
            <span slot="label">
              <span class="tabtitcon">
                <input class="addinput" autofocus v-model="addtemplatername" />
              </span>
              <span class="tabtitopr tabtitedit">
                <el-button size="mini" @click="saveModel()">确定</el-button>
                <el-button size="mini" class="cancelbtn" @click="removeTab()">取消</el-button>
              </span>

            </span>
            <!--tab内容-->
            <callfiled v-if="modelid" :templateid="modelid"></callfiled>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="addmodelbtn" :style="{top: addTop+'px'}">
        <a @click="addTab(editableTabsValue2,'add')"><span class="el-icon-circle-plus-outline addmodelicon"></span>创建模板</a>
      </div>
    </div>
    <div class="callfooter">
      <p class="footercon">基站数据版本V1.0.0.2</p>
    </div>
  </div>
</template>

<script>
    import callfiled from '../../components/CDRcom/callfiled'

    import {createSingleTemplate, checkSingleTemplate, singleTemplateSwitch} from '@/service/cdr' // 创建,查询,switch模板
    import {singleTemplateField, checkSingleTemplateField} from '@/service/cdr' // 创建,查询字段

    export default {
      components: {callfiled},
      name: 'callfiledconfig',
      data () {
        return {
          userinfo: {},
          sjzuser: '', // 当前登陆用户
          tabPosition: 'left',
          editableTabsValue2: '2',
          modelList: [],
          modelid: '', // 模板id
          modelidname: '',
          tabIndex: 7,
          addTop: 0,
          addtemplatername: '',
          addisedit: false
        }
      },
      methods: {
        // 查询模板列表
        queryModelList () {
          checkSingleTemplate({ loginName: this.sjzuser }).then((res) => {
            if (res) {
              res.forEach((item) => {
                item.ifedit = false
                if (item.statue === 1) {
                  item.statue = true
                } else if (item.statue === 0) {
                  item.statue = false
                  this.modelidname = item.templateName
                  this.modelid = item.id
                }
              })
              this.modelList = res
            }
          }).catch((err) => {
            console.log(err)
          })
        },
        /* ---------tab操作功能------------ */
        // 添加模板
        addTab () {
          this.addisedit = true
        },
        // 删除模板
        removeTab () {
          this.addisedit = false
          // this.modelList = this.modelList.filter((item) => {
          //   return item.id != targetName
          // })
        },
        // 确定保存模板
        saveModel (target) {
          if (!this.addtemplatername) {
            this.$message({
              message: '模板名称不能为空',
              type: 'warning'
            })
            return
          }
            let params = {
              templateName: this.addtemplatername,
              createUser: this.sjzuser
            }
            createSingleTemplate(params).then((res) => {
              if (res.flag == 0) {
                this.queryModelList()
              } else if (res.flag == 2) {
                this.$message({
                  message: '模板名称已存在',
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: '服务器异常',
                  type: 'warning'
                })
              }
              this.modelList = res
              this.addisedit = false
            }).catch((err) => {
              console.log(err)
            })
        },
        // 双击编辑名称
        editName (targetName) {
          this.modelList.forEach((item) => {
            if (item.name == targetName) {
              item.ifedit = true
            }
          })
        },
        // 模板状态改变
        modelStatus (modelid, modelstatus) {
          let params = {
            id: modelid,
            statue: modelstatus ? 1 : 0,
            createUser: this.sjzuser
          }
          singleTemplateSwitch(params).then((res) => {
            if (res.flag == 0) {
              this.queryModelList()
            } else if (res.flag == 2) {
              this.$message({
                message: '只能开启一个模板',
                type: 'warning'
              })
              this.queryModelList()
            } else {
              this.$message({
                message: '服务器异常',
                type: 'warning'
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        },
        // tab切换
        tabChange (currenttab) {
          this.modelid = currenttab.$attrs.id // 模板id
        }
        /* ---------tab操作功能 end------------ */

      },
      watch: {
        // 动态定位添加模板按钮
        modelList (val) {
          if (val) {
            this.addTop = (this.modelList.length + 1) * 40
          }
        }
      },
      mounted () {
        this.addTop = this.modelList.length * 40 // 动态定位添加模板按钮
        this.userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.sjzuser = this.userinfo.loginName
        this.queryModelList()
      }
    }
</script>
<style>
  @import '../../../static/css/componentcss/callconfig.css';
 /* @import "../../../static/css/cdr/cdr.css"; */
  /* @import "../../../static/css/callDetail/importManage.less"; */
  @import "../../../static/css/base.css";
  @import "../../../static/css/btn.css";
  @import "../../../static/css/index.css";
  @import "../../../static/css/main.css";
  @import "../../../static/css/cdr/statistics.css";
  @import "../../../static/css/componentcss/searchtable.css";
</style>
<style scoped>
  .cdrcontainer {
    width: 1306px;
    font-size: 12px;
    margin: 0 auto;
    /* background: #ffffff; */
  }

  /*配置字段区域*/
  .cdrfiledconfig {
    width: 100%;
    height: 100%;
    position: relative;
  }

  /*tab切换*/
  .fctab {
    height: 100%;
  }
  .fctab .tabtitcon {
    /*float: left;*/
  }
  .fctab .tabtitopr {
    float: right;
  }

  .addmodelbtn {
    width: 216px;
    text-align: center;
    margin-top: 10px;
    position: absolute;
    left: 0;
    top: 120px;
  }
  .addmodelbtn a {
    color: #2d8cf0;
  }
  .addmodelbtn .addmodelicon {
    color: #2d8cf0!important;
    margin-right: 3px;
  }

  /*底部*/
  .footercon {
    float: right;
    margin-top: 6px;
    margin-right: 35px;
  }
  .addinput {
    width: 63%;
    display: inline-block;
    height: 28px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding-left: 10px;
    outline: none;
  }


</style>

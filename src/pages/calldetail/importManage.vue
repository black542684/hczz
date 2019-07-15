<template>
  <div class="cdrcontainer">
    <div class="headNavigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/calllist' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>话单配置管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--列表展示-->
    <div class="calllist">
      <!--搜索区域-->
      <div class="bigTitle">
        <h3>话单导入管理</h3>
        <!-- <div class="borderBox"></div> -->
        <router-link to="/calllist">返回</router-link>
        <el-button @click="exportCallShow">新建</el-button>
      </div>

      <div class="optHeader">
        <table class="searchtlist">
          <tr>
            <td class="labelbgc">
              <span class="inpname">创建时间：</span>
            </td>
            <td class>
              <el-date-picker
                v-model="selectDate"
                type="date"
                @change="dateChange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
            <td class="labelbgc">
              <span class="inpname">话单类型：</span>
            </td>
            <td class>
              <el-select v-model="callListType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td class="labelbgc">
              <span class="inpname">关键字：</span>
            </td>
            <td class>
              <el-input placeholder="请输入内容" v-model="keyWord">
                <i slot="suffix" @click="queryCallConfigList" class="el-input__icon el-icon-search"></i>
              </el-input>
            </td>
          </tr>
        </table>
        <div class="optRight">
          <div class="pageBox">
            <el-pagination @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next"
                           :total="totalNum"></el-pagination>
          </div>
        </div>
      </div>
      <el-table :data="configfilelist" style="width: 100%">
        <el-table-column prop="name" label="配置名称" min-width="10%" text-align="center"></el-table-column>
        <el-table-column prop="typeName" sortable label="话单类型" min-width="10%">
          <template slot-scope="scope">
            <img
              class="phoneimg"
              v-if="scope.row.typeName=='中国移动'"
              src="../../assets/images/mobile.png"
              alt
            >
            <img
              class="phoneimg"
              v-if="scope.row.typeName=='中国联通'"
              src="../../assets/images/unicom.png"
              alt
            >
            <img
              class="phoneimg"
              v-if="scope.row.typeName=='中国电信'"
              src="../../assets/images/telecommunications.png"
              alt
            >
            <span>{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="13%"></el-table-column>
        <el-table-column prop="LINKMAN_NUM" label="启用状态" min-width="10%">
          <template slot-scope="scope">
            <el-switch
              @change="openStatusChange(scope.row)"
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="22%">
          <template slot-scope="scope">
            <!--<el-button type="text" @click="seeAddressList(scope.row)">查看联系人</el-button>-->
            <el-button type="text" @click="deleteImport(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBoxBottom">
        共
        <span>{{totalNum}}</span> 条记录
        <div class="pageBox">
          <el-pagination @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next"
                         :total="totalNum"></el-pagination>
        </div>
      </div>
    </div>
    <div class="dialogbox">
      <!--导入弹框-->
      <el-dialog title="导入话单" width="50%" :visible.sync="exportshow" :modal-append-to-body="false">
        <div class="diacontbox" v-show="!thirdsetshow">
          <table class="distable" v-show="firstshow">
            <tr>
              <td class="labelexp">
                <span class="redstar">*</span>配置名称:
              </td>
              <td class colspan="5" style="padding-left:20px;">
                <el-input placeholder="请输入内容" v-model="newConfigName" clearable></el-input>
              </td>
            </tr>
            <tr>
              <td class="labelexp">
                <span class="redstar">*</span>话单类型:
              </td>
              <td class colspan="5" style="padding-left:20px;">
                <el-radio-group
                  :disabled="importifedit"
                  v-model="listtype"
                  @change="callTypeChange"
                >
                  <el-radio label="中国移动">
                    <img class="phoneimg" src="../../assets/images/mobile.png">中国移动
                  </el-radio>
                  <el-radio label="中国联通">
                    <img class="phoneimg" src="../../assets/images/unicom.png">中国联通
                  </el-radio>
                  <el-radio label="中国电信">
                    <img class="phoneimg" src="../../assets/images/telecommunications.png">中国电信
                  </el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr v-show="callyearshow">
              <td class="labelexp">话单年份:</td>
              <td>
                <el-date-picker
                  :disabled="importifedit"
                  v-model="callyear"
                  type="year"
                  value-format="yyyy"
                ></el-date-picker>
              </td>
            </tr>
            <tr>
              <td class="labelexp">上传附件:</td>
              <td class colspan="5">
                <p style="display: inline-block;position: relative;">
                  <el-form class="upload_file clearFix" enctype="multipart/form-data" method="post">
                    <!--<div class="updatebtn newupdatebtn" @click="updatebtnclick">选择文件</div>-->
                    <input class="upload_file_input" type="file" name="file" id="file">
                    <br>
                  </el-form>
                </p>
              </td>
            </tr>
          </table>
          <div class="next" v-show="exportnextshow">
            <span class="settitline" href="javascript:;">设置第{{tabletitnum}}行为标题行</span>
            <div class="callfilebox">
              <div style="height: 245px;" v-html="callfile"></div>
            </div>
          </div>
        </div>
        <div class="thirdstep fctab" v-show="thirdsetshow">
          <!-- <div class="configuretit clearFix">
            <span class="settit">配置文件</span>
            <ul style="height: 88%;overflow-y: auto;">
              <li
                class="setli"
                v-for="(item, index) in modelList"
                @click="configTab(item.id)"
                :key="item.id"
              >
                <input type="text" :class="{currentconfig: item.checked}" v-model="item.name">
              </li>
            </ul>
          </div>-->
          <div class="setcon">
            <div class="setconlist">
              <div
                class="fileddistance"
                v-for="(item,index) in tabletitlist"
                :key="item.columncode"
              >
                <!-- v-if="index<filedspreadcon" -->
                <label
                  style="display:inline-block;width: 120px;text-align: right;margin-bottom: 8px;"
                >
                  <span v-if="index<5" class="redstar">*</span>
                  {{item.columnname}}
                </label>
                <el-select
                  size="small"
                  v-model="item.excelname"
                  :disabled="item.ifdisabled"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="option in tabletithang"
                    :key="option.excelname"
                    :label="option.excelname"
                    :value="option.excelname"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <!-- <div class="filedspread">
              <button v-show="filedspreadbtnshow" class="filedspbtn" @click="filedSpreadList">
                展开
                <i class="icon iconfont icon-zhankai2" style="font-size: 12px;"></i>
              </button>
              <button v-show="!filedspreadbtnshow" class="filedspbtn" @click="filedRetractList">
                收起
                <i class="icon iconfont icon-shouqi" style="font-size: 12px;"></i>
              </button>
            </div>-->
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-show="firstshow && !finishbtnshow"
            id="callupfile"
            @click="exportSave"
            :disabled="isImportDisabled"
            type="primary"
          >下一步
          </el-button>
          <el-button
            v-show="firstshow && finishbtnshow"
            id="callupfilefinish"
            @click="importFirstFinish('first')"
            type="primary"
          >完成
          </el-button>
          <el-button v-if="exportnextshow" @click="setTitHang" type="primary">下一步</el-button>
          <el-button type="primary" v-show="thirdsetshow" @click="saveCurrentConfig">保存当前配置</el-button>
          <!-- <el-button
            v-show="thirdsetshow"
            id="endfinish"
            @click="endImportConfigFinish"
            :disabled="isImportDisabled"
            type="primary"
          >完 成</el-button>-->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // 该页面主体复制的calllist页面
  import {calluploadfile} from "@/service/calluploadfile"; // 渲染上传的数据
  import {calluploadfilefinish} from "@/service/calluploadfilefinish"; // 渲染上传的数据
  import {
    searchCallList,
    reloadFile,
    getSingleConfigList,
    saveTemplet,
    checkSingleTemplate,
    checkSingleTemplateList,
    saveSingleConfig,
    getSingleConfigDetailListByConfigId,
    checkTemplateFieldPoolList,
    deleteCallListById,
    updateSingleConfigStatusById,
    deleteSingleConfigStatusById
  } from "@/service/cdr"; // 查询话单列表

  const confighttpurl = window.g.apiUrl;

  export default {
    name: "importManage",
    data() {
      return {
        httpUrl: confighttpurl, // 服务
        userinfo: {}, // 缓存中的用户登陆信息
        sjzuser: "", // 当前登陆用户
        isDisable: false,
        isImportDisabled: false,
        templateid: "",
        pagesize: 10,
        currentpage: 1,
        totalnum: 1,
        // ------start 导入弹框数据
        exportshow: false, // 导入话单弹框展示
        firstshow: true,
        exportnextshow: false,
        thirdsetshow: false,
        // 搜索区域字段
        ownername: "", // 机主姓名
        ownercardid: "", // 机主身份证
        ownerphone: "", // 机主手机
        callID: "", // 话单id
        callingname: "", // 主叫姓名
        identitycard: "", // 身份证号
        phonenumber: "", // 手机号
        calladdress: "", // 机主所在地
        listtype: "", // 话单类型
        callfile: "", // 上传文件列表
        configfile: "", // 选择配置文件
        configfilelist: [], // 列表数据变量
        totalNum: 0,   // 列表数据总条数
        finishbtnshow: false, // 导入第一步完成按钮的显示
        importifedit: false, // 导入框内数据是否可修改
        configid: "",
        configname: "",
        // ------end 导入弹框数据
        newnumdownshow: false, // 新号分析下拉展示
        disappearnumdownshow: false, // 消失号分析下拉展示
        analysetype: [
          {
            id: "1",
            name: "单人分析",
            currentstatus: false
          },
          {
            id: "2",
            name: "多人分析",
            currentstatus: false
          }
        ],
        currentanalyse: false,
        starttime: "",
        endtime: "",
        commoncontact: 2, // 共同联系人
        contactnum: 1, // 联系次数
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        calllistdata: [],
        modelList: [],
        tabIndex: 0,
        setlist: [
          {
            ifedit: false,
            templateName: "Tab 2",
            id: "2",
            statue: "",
            content: "Tab 2 content"
          },
          {
            ifedit: false,
            templateName: "通用模板3",
            id: "3",
            statue: "",
            content: "Tab 3 content"
          }
        ],
        filedlist: [
          {
            id: "2",
            label: "时间类型"
          },
          {
            id: "3",
            label: "时长类型"
          },
          {
            id: "4",
            label: "通话类型"
          }
        ],

        partnershow: false, // 同伙碰撞弹框显示

        mutualcallshow: false, // 相互通话弹框显示

        callnumshow: false, // 号码分析弹框显示
        callnumtit: "", // 号码弹框标题
        ifmany: false,
        tabletitnum: -1, // 设置标题行
        tabletitlist: [],
        tabletitlisttemp: [],
        selectcalldata: [], // 话单选中数据列表
        callyear: "", // 话单年份，只有移动有
        callyearshow: false, // 选择中国移动时显示话单年份
        tabletithang: [],
        currentconfigmod: "",
        filedspreadcon: 6,
        filedspreadbtnshow: true,
        value3: true,
        value1: "",
        input4: "",
        options: [
          {
            value: "中国移动",
            label: "中国移动"
          },
          {
            value: "中国联通",
            label: "中国联通"
          },
          {
            value: "中国电信",
            label: "中国电信"
          }
        ],
        callListType: "", //话单类型值
        selectDate: "", //选择日期
        keyWord: "", //关键字
        newConfigName: "" // 新建配置名称
      };
    },
    methods: {
      // 删除单跳配置事件
      deleteConfig() {
      },
      // 改变启用状态事件
      openStatusChange(item) {
        console.log("status", item);
        updateSingleConfigStatusById({id: item.id, status: item.status})
          .then(res => {
            console.log("res", res);
          })
          .catch(err => {
            console.log("err", err);
          });
      },
      //返回主页面
      backbtn() {
        this.$router.push({name: "calllist"});
      },
      // 日期改变事件
      dateChange(val) {
        console.log("val", val);
      },
      // 当前页
      handleCurrentChange(val) {
        this.currentpage = val;
        this.queryCallConfigList();
      },

      // 获取配置文件列表 getSingleConfigList
      queryCallConfigList() {
        // console.log(this.callListType,'type');
        // console.log(this.selectDate,'date');
        // console.log(this.keyWord,'keyWord');
        let params = {
          searchtime: this.selectDate,
          searchtype: this.callListType,
          searchword: this.keyWord,
          searchstatus: "",
          pageSize: 10,
          pageNo: this.currentpage
        };
        getSingleConfigList({jsonStr: JSON.stringify(params)})
          .then(res => {
            console.log("all config", res);
            if (res) {
              this.configfilelist = res.list;
              this.modelList = res.list;
              this.totalNum = res.count;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 跳转统计页面
      linkStatistics(row) {
        this.$router.push({name: "callstatistics", params: row});
      },

      // *****************弹框start**************
      // 话单类型切换
      callTypeChange(val) {
        if (val == "中国联通") {
          this.callyearshow = true;
          this.callyear = "";
        } else {
          this.callyearshow = false;
          this.callyear = new Date().getFullYear() + "";
        }
      },
      // 导入选择配置文件改变
      configFileChange(configid) {
        if (configid) {
          this.finishbtnshow = true;
        } else {
          this.finishbtnshow = false;
        }
        let obj = {};
        obj = this.configfilelist.find(item => {
          return item.id === configid;
        });
        this.configid = configid;
        this.configname = obj.name;
      },
      // 控制配置字段展示条数 filedRetractList
      filedSpreadList() {
        this.filedspreadcon = this.tabletitlist.length + 1;
        this.filedspreadbtnshow = false;
      },
      filedRetractList() {
        this.filedspreadcon = 6;
        this.filedspreadbtnshow = true;
      },
      // 导入弹框下一步按钮
      exportSave() {
        const that = this;
        // 校验手机号必填
        // if (!this.phonenumber || this.phonenumber == "") {
        //   this.$message({
        //     message: "手机号为必填",
        //     type: "warning"
        //   });
        //   return;
        // }
        // const phonenumvalid = this.isPoneAvailable(this.phonenumber);
        // if (phonenumvalid !== true) {
        //   this.$message({
        //     message: "请填写正确的手机号格式",
        //     type: "warning"
        //   });
        //   return;
        // }
        if (!this.newConfigName) {
          this.$message({
            message: "请填写配置名称",
            type: "warning"
          });
          return;
        }
        if (!this.listtype || this.listtype == "") {
          this.$message({
            message: "请选择话单类型",
            type: "warning"
          });
          return;
        }

        const filevalue = document.getElementById("file").value;
        if (filevalue) {
          console.log(this.httpUrl);
          this.callfile = calluploadfile(
            "#callupfile",
            "file",
            this.httpUrl
          ).table;
        } else {
          this.$message({
            message: "请选择文件",
            type: "warning"
          });
          return;
        }

        this.firstshow = false;
        this.exportnextshow = true;
        this.$nextTick(() => {
          $(".callfilebox input").click(function () {
            that.tabletitnum = $(this).attr("value") - 0;
            var tabletits = $(this)
              .parent()
              .parent()
              .children("td");
            var tabletitnames = [];
            that.tabletithang = [];
            tabletits.each(function () {
              if ($(this).text() != "") {
                that.tabletithang.push({
                  excelname: $(this).text()
                });
              }
            });
          });
        });
        this.modelList = this.modelList.filter(item => {
          return item.id.charAt(item.id.length - 1) != "N";
        });
      },
      // 配置选项改变
      // importConfigFiledChange(code,itemobj){
      //   console.log(code, itemobj);
      //   let obj = {};
      //   obj = this.filedlist.find((item)=>{
      //     return item.columnCode === code;
      //   });
      //   itemobj.columncode = code;
      //   itemobj.columnname = obj.columnName;
      // },
      // 保存当前配置 saveSingleConfig
      saveCurrentConfig() {
        var configflag = true;
        this.tabletitlist.forEach(item => {
          delete item.ifdisabled;
          if (
            item.columnname == "对端号码" ||
            item.columnname == "呼叫时间" ||
            item.columnname == "对话时长" ||
            item.columnname == "基站小区号" ||
            item.columnname == "主被叫"
          ) {
            if (!item.excelname || item.excelname == "") {
              configflag = false;
            }
          }
        });
        if (!configflag) {
          this.$message({
            message: "对端号码,呼叫时间,对话时长,基站小区号,主被叫为必选字段",
            type: "warning"
          });
          return;
        }
        this.modelList[this.modelList.length - 1].name;
        const params = {
          // name: this.modelList[this.modelList.length - 1].name, // 配置文件名称
          name: this.newConfigName, // 配置文件名称
          startRow: this.tabletitnum,
          userid: this.sjzuser, // 当前登陆用户
          detail: JSON.stringify(this.tabletitlist), // 配置列表字段
          year: this.callyear,
          type: this.listtype
        };
        saveSingleConfig(params)
          .then(res => {
            if (res.success == "添加成功") {
              this.$message({
                message: "保存配置成功",
                type: "success"
              });
              this.queryCallConfigList()
              this.exportshow = false
            } else {
              this.$message({
                message: res.fail,
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 最后一步完成
      endImportConfigFinish() {
        var configflag = true;
        this.tabletitlist.forEach(item => {
          if (
            item.columnname == "对端号码" ||
            item.columnname == "呼叫时间" ||
            item.columnname == "对话时长" ||
            item.columnname == "基站小区号" ||
            item.columnname == "主被叫"
          ) {
            if (!item.excelname || item.excelname == "") {
              configflag = false;
            }
          }
        });
        if (!configflag) {
          this.$message({
            message: "对端号码,呼叫时间,对话时长,基站小区号,主被叫为必选字段",
            type: "warning"
          });
          return;
        }
        this.isImportDisabled = true;
        this.tabletitlist = this.tabletitlist.filter(item => {
          return item.columncode && item.columncode != "";
        });

        const params = {
          userid: this.sjzuser,
          callid: this.callID,
          phone: this.phonenumber, // 机主号
          owername: this.callingname, // 机主名称
          idcard: this.identitycard, // 机主身份证号
          phoneAddress: this.calladdress,
          phonetype: this.listtype, // 类型
          templetFile: this.callfile, // 文件
          configid: "", // 配置文件id
          detail: this.tabletitlist,
          startRow: this.tabletitnum,
          year: this.callyear
        };
        setTimeout(() => {
          this.isImportDisabled = false;
        }, 3000);
        calluploadfilefinish("#endfinish", "file", params, this.httpUrl);
        this.queryCallList();
        this.exportshow = false;
      },
      // 导入话单展示
      exportCallShow() {
        if (this.sjzuser !== "admin") {
          this.finishbtnshow = true;
        } else {
          this.finishbtnshow = false;
        }
        this.importifedit = false;
        this.exportshow = true;
        this.firstshow = true;

        this.exportnextshow = false;
        this.thirdsetshow = false;
        this.callyearshow = false;
        this.callID = "1";

        // 清空数据
        this.phonenumber = ""; // 机主号
        this.callingname = ""; // 机主名称
        this.identitycard = ""; // 机主身份证号
        this.calladdress = "";
        this.listtype = ""; // 类型
        this.configfile = ""; // 配置文件id
        this.configid = "";
        document.getElementById("file").value = "";
      },
      // 校验手机号的正则
      isPoneAvailable($poneInput) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test($poneInput)) {
          return false;
        } else {
          return true;
        }
      },
      // 设置标题行下一步
      setTitHang() {
        // this.$nextTick(()=>{
        //   this.tabletitlist = JSON.parse(sessionStorage.getItem('tabletitnames'));
        // })
        // this.queryCallConfigList();
        if (this.tabletitnum == -1) {
          this.$message({
            message: "请设置标题行",
            type: "warning"
          });
          return;
        }
        this.queryFiledList();
        this.modelList.push({
          ifedit: true,
          title: "New Tab",
          id: this.modelList.length + 1 + "N",
          isnew: true,
          modelstatus: true,
          checked: true,
          name: "新建配置" + (this.modelList.length + 1)
        });
        this.firstshow = false;
        this.exportnextshow = false;
        this.thirdsetshow = true;
      },
      // 获取字段列表
      queryFiledList() {
        checkTemplateFieldPoolList()
          .then(res => {
            this.filedlist = res.data;
            const tabtitlist = [];
            res.data.forEach(item => {
              tabtitlist.push({
                columncode: item.columnCode,
                columnname: item.columnName,
                excelname: "",
                ifdisabled: false
              });
            });
            this.tabletitlist = tabtitlist;
            sessionStorage.setItem(
              "tabletitnames",
              JSON.stringify(this.tabletitlist)
            );
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 删除导入管理 deleteSingleConfigStatusById
      deleteImport(importid) {
        console.log(importid);
        this.$confirm("此操作将删除该话单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteSingleConfigStatusById({id: importid}).then((res) => {
            if (!res.flag) {
              this.$message({
                message: res.msg,
                type: 'warning'
              });
            } else {
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.queryCallConfigList()
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        })
      }
    },
    watch: {},
    mounted() {
      this.userinfo = JSON.parse(sessionStorage.getItem("userInfo"));
      // this.sjzuser = this.userinfo.loginName || "admin";
      this.sjzuser = "admin";
      this.queryCallConfigList();
    }
  };
</script>
<style scoped lang="less">
  @import "../../../static/css/cdr/cdr.css";
  @import "../../../static/css/callDetail/importManage.less";
</style>

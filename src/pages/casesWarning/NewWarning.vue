<template>
  <div class="big-box">
    <div class="header-container">
      <div class="Breadcrumb">
        <span @click="yjlb">案件预警</span>
        <span>新建预警</span>
      </div>

      <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
          <div class="grid-content">
            <span class="header-title">新建预警规则</span>
            <a class="header-back" href="javascript:;" @click="backClick">返回</a>
          </div>
        </el-col>
      </el-row>

      <el-form
        :inline="true"
        :model="warningForm"
        :rules="warningRules"
        ref="warningForm"
        class="new-warning-form form-style"
        label-width="100px"
      >
        <div class="form-item">
          <div class="form-title">预警信息</div>
          <el-form-item label="预警名称：" prop="name" class="select-style">
            <el-input
              placeholder="请输入预警名称(不超过15个字符)"
              v-model="warningForm.name"
              class="form-ipt-style"
              size="small"
              type="text"
              maxlength="15"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="预警类型：" prop="type" class="select-style" v-show="yjlxIsShow">
            <el-select v-model="warningForm.type" placeholder="请选择预警类型">
              <el-option
                v-for="chooseOne in sjAndGr"
                :key="chooseOne.value"
                :label="chooseOne.lavel"
                :value="chooseOne.value"
              ></el-option>
              <!-- <el-option label="市级" value="市级"></el-option>
              <el-option label="个人" value="个人"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="预警时间：" prop="time" class="date-picker-style">
            <!-- <el-date-picker type="date" placeholder="开始日期" v-model="warningForm.time" value-format="yyyy-MM-dd"></el-date-picker>
                         &nbsp;至&nbsp;
            <el-date-picker type="date" placeholder="无限" v-model="warningForm.time2" value-format="yyyy-MM-dd"></el-date-picker>-->

            <el-date-picker
              v-model="warningForm.time"
              type="date"
              placeholder="开始日期"
              :picker-options="pickerOptions"
            ></el-date-picker>&nbsp;至&nbsp;
            <el-date-picker
              v-model="warningForm.time2"
              type="date"
              placeholder="无限"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预警区划：" prop="area" class="select-style">
            <el-select v-model="warningForm.area" placeholder="请选择活动区域" multiple>
              <el-option
                v-for="oneArea in areaList"
                :key="oneArea.dicCode"
                :label="oneArea.dicName"
                :value="oneArea.dicName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="案件类别：" prop="caseType" class="select-style">
            <el-select
              v-model="warningForm.caseTypeSelected"
              placeholder="请选择案件类别"
              @change="caseTypeSelect"
            >
              <el-option
                :key="item.dicCode"
                :label="item.dicName"
                :value="item.dicCode"
                v-for="item in warningForm.caseType"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="form-title" style="margin-bottom: 0;">预警规则</div>
          <div class style="padding: 20px 0 13px 33px;border-bottom:1px solid #d7dde5;">
            符合下列&nbsp;&nbsp;
            <el-select
              v-model="valueCondition"
              placeholder
              class="select-height"
              style="width:76px;"
            >
              <el-option
                v-for="condition in conditions"
                :key="condition.value"
                :label="condition.label"
                :value="condition.value"
              ></el-option>
            </el-select>&nbsp;&nbsp;条件
          </div>
          <el-table :data="ruleTableData" class="warning-table">
            <el-table-column type="index" label width="82" align="right"></el-table-column>
            <el-table-column prop="dicName" label width="160">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dicName"
                  placeholder="选择类型"
                  size="small"
                  @change="caseTypeSecSelect(scope)"
                  @visible-change="visiable(scope.row.dicName)"
                >
                  <el-option
                    v-for="type in dicName"
                    :key="type.value"
                    :label="type.label"
                    :value="type.label"
                    :disabled="type.disabled"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="details" label width="300">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.details"
                  placeholder="请选择阈值类型"
                  size="small"
                  style="width:100%;"
                >
                  <el-option
                    v-for="detail in details"
                    :key="detail.value"
                    :label="detail.label"
                    :value="detail.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="typeSecond" label="400">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.typeSecondUnit"
                  placeholder="请选择"
                  size="small"
                  style="width:100%;"
                  v-show="scope.row.putCode!=='input'"
                  multiple
                >
                  <el-option
                    v-for="equal in scope.row.typeSecond"
                    :key="equal.dicCode"
                    :label="equal.dicName"
                    :value="equal.dicName"
                  ></el-option>
                </el-select>

                <el-input
                  v-show="scope.row.putCode==='input'"
                  placeholder="多个号码请使用分号(；)隔开"
                  v-model="scope.row.typeSecondUnitStr"
                  size="small"
                  type="text"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="operation" width="60" label>
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, ruleTableData)"
                  icon="el-icon-delete"
                  class="change-delete-style"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" @click="addTableRow" style="margin: 20px 0 25px 92px;">添加</el-button>
        </div>

        <div class="form-item">
          <div class="form-title" style="margin-bottom: 0;">阈值设定</div>
          <div class style="padding: 20px 0 13px 33px;">
            阈值条件：案件数&nbsp;&nbsp;
            <el-select v-model="valuePeriod" placeholder class="select-height" style="width:262px;">
              <el-option
                v-for="period in periods"
                :key="period.value"
                :label="period.label"
                :value="period.value"
              ></el-option>
            </el-select>
            <el-input-number
              v-model="countNum"
              controls-position="right"
              @change="handleChange"
              :min="0"
              :max="1000"
              size="mini"
              style="width:510px;"
            ></el-input-number>
            <!-- <el-input v-model="piece" placeholder="" class="input-height" @keyup.native="onlyNumber"></el-input> -->
            <el-select v-model="pinlvStr" placeholder class="select-height" style="width:262px;">
              <el-option
                v-for="period in pinlv"
                :key="period.value"
                :label="period.label"
                :value="period.value"
              ></el-option>
            </el-select>&nbsp;&nbsp;触发预警
          </div>
        </div>

        <div class="form-btn-item">
          <el-form-item>
            <router-link tag="span" to>
              <el-button type="primary" size="small" @click="saveFn">保存</el-button>
            </router-link>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
//  引入流程图插件 AntV/g6
import G6 from "@antv/g6";
//  引入流程图节点图片
import processNodeDefault from "../../../static/image/processNodeDefault.png";
import processNodeSuccess from "../../../static/image/processNodeSuccess.png";

export default {
  data() {
    let notNull = (rule, value, callback) => {
      if (value.trim() == "") {
        callback(new Error("预警名称不可输入纯空格字符"));
      }
    };
    return {
      pickerOptions: {
        disabledDate: t => {
          let endDateVal = this.warningForm.time2;

          if (endDateVal) {
            return t.getTime() > endDateVal;
          }
        }
      },
      pickerOptions2: {
        disabledDate: t => {
          let beginDateVal = this.warningForm.time;

          if (beginDateVal) {
            return t.getTime() < beginDateVal;
          }
        }
      },
      warningForm: {
        //  表单内容
        //  预警信息内容
        name: "",
        type: "",
        time: new Date().getTime(),
        time2: "",
        area: [],

        caseType: [], //  案件类别
        caseTypeSelected: "" //..选择的案件类别
      },
      warningRules: {
        //  指令信息检查规则
        name: [
          { required: true, message: "请输入预警名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur"
          },
          { validator: notNull, trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        caseType: [
          { required: true, message: "请选择案件类别", trigger: "change" }
        ],
        area: [{ required: true, message: "请选择预警区划", trigger: "change" }]
      },
      areaList: [],
      sjAndGr: [
        // {
        //     value: '市级',
        //     label: '市级'
        // },
        // {
        //     value: '个人',
        //     label: '个人'
        // }
      ],
      yjlxIsShow: true,

      conditions: [
        {
          value: "全部",
          label: "全部"
        },
        {
          value: "任意",
          label: "任意"
        }
      ],
      valueCondition: "",
      periods: [
        {
          value: ">",
          label: "大于"
        },
        {
          value: "<",
          label: "小于"
        },
        {
          value: ">=",
          label: "大于等于"
        },
        {
          value: "<=",
          label: "小于等于"
        }
      ],
      pinlv: [
        {
          value: "个/天",
          label: "个/天"
        },
        {
          value: "个/7天",
          label: "个/7天"
        },
        {
          value: "个/30天",
          label: "个/30天"
        }
      ],
      valuePeriod: "",
      pinlvStr: "",
      piece: "22",
      countNum: 0,

      ruleTableData: [
        //  预警规则table数据
        {
          dicName: "",
          typeSecond: [],
          typeSecondUnit: "",
          details: "等于",

          putCode: "",
          typeSecondUnitStr: ""
        }
        // {
        //     types:'',
        //     equals:'',
        //     details:'',
        // },
        // {
        //     types:'',
        //     equals:'',
        //     details:'',
        // },
        // {
        //     types:'',
        //     equals:'',
        //     details:'',
        // },
      ],
      dicName: [
        // {
        //     value: 0,
        //     label: '地址类型'
        // },
        // {
        //     value: 1,
        //     label: '案件类别'
        // }
      ],
      typeSecond: [
        // {
        //     value: 0,
        //     label: '等于'
        // },
        // {
        //     value: 1,
        //     label: '不等于'
        // }
      ],
      details: [
        {
          value: "等于",
          label: "等于"
        },
        {
          value: "不等于",
          label: "不等于"
        }
      ],

      abc: [],
      selectedDicName: [],
      selectedNow: "",
      caseTypeSend: "",
      myArr: [],

      featureCode: "",
      userId: ""
    };
  },
  mounted() {
    //  获取userid
    this.userId = window.localStorage.userId;
    console.log(window.localStorage.userId);

    this.$Ajax
      .post("ssSeriesInfoController/getCaseType", {}, true)
      .then(res => {
        console.log(res);
        this.warningForm.caseType = res.data;
        // this.warningForm.caseTypeSelected = res.data[1].dicName;
      });

    this.$Ajax.post("alarmInfoController/queryQuHuaType", true).then(res => {
      this.areaList = res.list;
      // console.log(this.areaList);
    });

    this.$Ajax
      .get("permissionApi/getButtons", { appCode: "hczz" }, true)
      .then(res => {
        console.log(res);
        for (var i = 0; i < res.length; i++) {
          if (res.length != 0 && res[i].code == "hczz_ajyj_sjqx") {
            //  市级和个人
            this.sjAndGr = [
              {
                value: "市级",
                label: "市级"
              },
              {
                value: "个人",
                label: "个人"
              }
            ];
            this.warningForm.type = "个人";
          }
        }
        if (res.length == 0) {
          // || res[i].code != 'hczz_ajyj_sjqx'
          //  个人
          this.yjlxIsShow = false;
          this.warningForm.type = "个人";
          // this.sjAndGr = [
          //     {
          //         value: '个人',
          //         label: '个人'
          //     }
          // ]
        }
      });
  },
  methods: {
    yjlb() {
      window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/fd8cdbf4e1764572898d47f43e318f88.html?userId=${this.userId}`;
    },

    //  表格删除行
    deleteRow(index, rows) {
      //console.log(rows)
      if (rows.length != 1) {
        rows.splice(index, 1);
      } else {
        this.$message({
          message: "至少需保留一条预警规则数据",
          type: "warning"
        });
      }
    },
    //  表格添加行
    addTableRow() {
      const addRowData = {
        // types:'',
        // equals:'',
        // details:'等于',
        // putCode:''

        dicName: "",
        typeSecond: [],
        typeSecondUnit: "",
        details: "等于",

        putCode: "",
        typeSecondUnitStr: ""
      };
      this.ruleTableData.push(addRowData);
    },

    //  设置input只能输入数字
    onlyNumber() {
      this.piece = this.piece.replace(/[^\w]/g, "");
    },

    handleChange(value) {
      console.log(value);
    },

    saveFn() {
      const sDate = new Date(this.warningForm.time);
      const eDate = this.warningForm.time2;

      const saveData = {
        alarmName: this.warningForm.name.trim(), //  预警名称
        alarmType: this.warningForm.type, //  预警类型
        alarmBgTime:
          sDate.getFullYear() +
          "-" +
          (sDate.getMonth() + 1) +
          "-" +
          sDate.getDate(), //  预警时间
        alarmRange: this.warningForm.area
          ? this.warningForm.area.join(";")
          : "", //  预警区划
        matchType: this.valueCondition, //  符合条件
        alarmCaseType: this.caseTypeSend, //  案件类别
        alarmCaseTypeId: this.warningForm.caseTypeSelected, //  案件类别id
        rules: this.myArr,
        thresholdType: this.valuePeriod,
        thresholdUnit: this.pinlvStr,
        thresholdNum: this.countNum,
        alarmEndTime: eDate
          ? eDate.getFullYear() +
            "-" +
            (eDate.getMonth() + 1) +
            "-" +
            eDate.getDate()
          : ""
      };
      for (var n = 0; n < this.ruleTableData.length; n++) {
        const setObj = {
          featureCode: "", // 特征字典code
          featureTitle: "", //特征字典值
          matchType: "", //匹配类型
          matchValue: "" //匹配值
        };
        setObj.matchType = this.ruleTableData[n].details;
        setObj.featureTitle = this.ruleTableData[n].dicName;

        if (this.ruleTableData[n].typeSecondUnit.length > 0) {
          //  如果是select则保存数组转换成的字符串
          setObj.matchValue = this.ruleTableData[n].typeSecondUnit.join(";");
        } else if (this.ruleTableData[n].typeSecondUnitStr) {
          //  如果是input则保存字符串
          setObj.matchValue = this.ruleTableData[n].typeSecondUnitStr.replace(
            /；/g,
            ";"
          ); //..全部转成英文状态的分号隔开
        }

        setObj.featureCode = this.featureCode;
        this.myArr.push(setObj);
      }

      console.log(saveData);
      //  判断必填字段不为空之后，方可进行保存
      if (
        saveData.alarmName &&
        saveData.alarmType &&
        saveData.alarmRange &&
        saveData.alarmCaseType
      ) {
        this.$Ajax
          .post("alarmInfoController/insertAlarmInfo", saveData, true)
          .then(res => {
            console.log(res);
            console.log(saveData);
            if (res.status != 200) {
              this.$message({
                message: res.err,
                type: "warning"
              });
            } else {
              this.$message({
                message: res.data,
                type: "success"
              });
              window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/fd8cdbf4e1764572898d47f43e318f88.html`;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              message: "保存失败，请确认字段全部填写完整！",
              type: "warning"
            });
          });
      } else {
        this.$message({
          message: "请完善全部信息之后再进行保存！",
          type: "warning"
        });
      }
    },

    //  返回
    backClick() {
      window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/fd8cdbf4e1764572898d47f43e318f88.html?userId=${this.userId}`;
    },

    //  选择案件类别之后回显
    caseTypeSelect(sel) {
      const selected = { caseTypeCode: sel };

      this.dicName = [];
      for (var w = 0; w < this.ruleTableData.length; w++) {
        this.ruleTableData[w].dicName = ""; //..重选之后置空
        this.ruleTableData[w].typeSecond = []; //..重选之后置空
        this.ruleTableData[w].typeSecondUnit = []; //  第三个置空
        this.ruleTableData[w].typeSecondUnitStr = "";
      }

      this.$Ajax
        .post("alarmInfoController/getFeatureInfoAndHaoMaInfo", selected, true)
        .then(res => {
          this.ruleTableData.dicName = res.data;
          for (var i = 0; i < this.ruleTableData.dicName.length; i++) {
            const obj = {};
            obj.value = this.ruleTableData.dicName[i].dicCode;
            obj.label = this.ruleTableData.dicName[i].dicName;
            obj.putCode = this.ruleTableData.dicName[i].putCode;

            this.dicName.push(obj);
          }

          for (var ii = 0; ii < this.warningForm.caseType.length; ii++) {
            if (sel == this.warningForm.caseType[ii].dicCode) {
              this.caseTypeSend = this.warningForm.caseType[ii].dicName;
            }
          }
          this.abc = res.data;
        })
        .catch(err => {});
    },
    //  列表第一个select选择事件
    caseTypeSecSelect(scope) {
      scope.row.typeSecondUnit = []; //  重选之后置空当前行的最后一个select选中的数据
      scope.row.typeSecondUnitStr = "";
      this.selectedDicName.push(scope.row.dicName);
      // this.selectedNow = scope.row.dicName;
      console.log(scope.row);
      for (var w = 0; w < this.ruleTableData.dicName.length; w++) {
        if (this.dicName[w].value == scope.row.dicName) {
          this.dicName[w].disabled = true;
        }
      }

      const aObj = {};
      for (var ww = 0; ww < this.abc.length; ww++) {
        if (scope.row.dicName == this.abc[ww].dicCode) {
          console.log(this.abc[ww].dicName);
          aObj.featureTitle = this.abc[ww].dicName;
        }
      }

      for (var i = 0; i < this.abc.length; i++) {
        if (this.abc[i].dicName == scope.row.dicName) {
          scope.row.typeSecond = this.abc[i].featureValue;

          // console.log(this.abc[i].featureValue);
        }
      }
      // setTimeout(function(){ console.log(scope.row.typeSecond); }, 3000);

      for (var t = 0; t < this.abc.length; t++) {
        if (scope.row.dicName == this.abc[t].dicName) {
          this.featureCode = this.abc[t].remark;

          scope.row.putCode = this.abc[t].putCode;
        }
      }
      // console.log(this.abc);
    },
    visiable(dic) {
      // console.log(dic)
      // if(dic){
      //     console.log(this.dicName);
      //     // for(var aa=0;aa<this.selectedDicName.length;aa++){
      //     //     if(scope.row.dicName == this.selectedDicName[aa]){
      //     //         this.selectedDicName.splice(aa,1);
      //     //         console.log(this.selectedDicName)
      //     //     }
      //     // }
      //     for(var aa=0;aa<this.dicName.length;aa++){
      //         if(dic == this.dicName[aa].value){
      //             //this.dicName[aa].disabled = false;
      //             // this.dicName.splice(aa,1);
      //             console.log(this.dicName)
      //         }
      //     }
      // }
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/AppIns.less";

.new-warning-form {
  .el-form-item {
    width: 49.8%;
    margin-right: 0;

    /deep/.el-form-item__label {
      line-height: 33px;
    }
  }
  .warning-name {
    width: 100%;
    /deep/input {
      width: 1120px;
    }
  }

  //  日期选择器样式
  .date-picker-style {
    /deep/.el-input__inner {
      height: 28px;
      line-height: 28px;
      width: 220px;
    }
    /deep/.el-input__icon {
      line-height: 28px;
    }
  }
  //  select样式
  .select-style {
    /deep/.el-input__inner {
      width: 466px !important;
    }
    /deep/.el-input__icon {
      line-height: 28px;
    }
  }
  .select-height {
    /deep/.el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    /deep/.el-input__icon {
      line-height: 28px;
    }
  }
  .input-height {
    width: 56px;
    /deep/input {
      height: 28px;
      line-height: 28px;
    }
  }

  //  table
  .warning-table {
    /deep/th {
      display: none;
    }

    //  删除图标修改
    .change-delete-style {
      border: 0;
      padding: 6px;
      background: transparent;
    }
  }
}

/deep/.el-input-number {
  input {
    height: 28px;
    @{lh}: 28px;
  }
}
/deep/.el-button--small {
  float: none !important;
}
</style>

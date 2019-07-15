<template>
  <div id="featureGuidance">
    <div class="headNavigation">
      <a :href="htmlurl+'/VisualizePlatform/file/45fb7efde4704b2d9a99406d0155ff26.html'">案件串并</a> >
      <a>特征引导串</a>
    </div>
    <div class="activePanl">
      <div class="panlHeader">
        <ul>
          <li
            :class="{activeLi:activeLiIndex===index}"
            v-for="(item,index) in caseTypeList"
            :key="index"
            @click="caseTypeClick(item,index)"
          >{{item.dicName}}</li>
        </ul>
        <div class="selectFilter">
          选择保存筛选：
          <el-select @change="filterChange" v-model="selectFilterId" placeholder="请选择">
            <el-option
              v-for="item in filterList"
              :key="item.id"
              :label="item.searchName"
              :value="item.id"
            >
              <span style="float: left">{{ item.searchName }}</span>
              <span @click="deleteDialogVisible=true" style="float: right;font-size: 13px">
                <i class="el-icon-error"></i>
              </span>
            </el-option>
          </el-select>
        </div>
        <div class="rightOpt">
          <el-button @click="saveFilterDialogVisible=true">保存筛选</el-button>
          <span @click="collapseClick" class="collapse">
            收起
            <i
              :class="{'el-icon-caret-bottom':collapseStatus,'el-icon-caret-top':!collapseStatus}"
            ></i>
          </span>
        </div>
      </div>
      <!-- 小案类别 -->
      <!-- <div class="smallCaseBox" v-show="!collapseStatus">
        <el-checkbox>不限</el-checkbox>
        <el-checkbox v-for="(item,index) in smallCaseList" :key="index">{{item.name}}</el-checkbox>
      </div> -->
      <div class="caseFeatureBox" v-show="!collapseStatus">
        <div class="featureBox" v-for="(featureObj) in features" :key="featureObj.dicCode">
          <div
            class="featureTitle"
            :style="{height:Math.ceil(featureObj.featureValue.length/10)*40+'px','line-height':Math.ceil(featureObj.featureValue.length/10)*40+'px'}"
          >{{featureObj.dicName}}</div>
          <ul class="featureList">
            <!-- v-for="(item,index) in Math.ceil(featureList.length/10)*10" -->
            <li
              class="featureItem"
              :class="{activeFeature:item.select}"
              @click="featureClick(item,featureObj)"
              v-for="(item,ind) in featureObj.featureValue"
              :key="ind"
            >{{item.dicName}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="featureGuidanceTableBox">
      <div class="optHeader">
        <!-- <span>已选择({{allSelectArr.length}})</span> -->
        <!-- <a @click="toggleAllSelection">{{toggleAllText}}</a> -->
        <div class="optRight">
          <el-button @click="addToWaitingInfo">添加到待串列表</el-button>
          <el-button @click="newSeriesClick">新建串案</el-button>
          <el-button @click="exportdata()" class="exportBtn">导出</el-button>
          <!-- <div class="pageBox">
            <el-pagination :current-page.sync="pageNo" @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next" :total="totalNum"></el-pagination>
          </div> -->
        </div>
      </div>
      <div class="optMiddle">
        <!-- <div class="suitability">
          <label>匹配度：</label>
          <el-select v-model="value">
            <el-option
              v-for="item in percentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div> -->
        <div class="incidentTime">
          <label>发案时间：</label>
          <!-- <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker> -->
          <el-date-picker
      v-model="timeRangeValue"
      type="daterange"
      @change="timeChange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd">
    </el-date-picker>
        </div>
        <div class="caseDivision">
          <label>案发区划：</label>
          <el-select   @change="timeChange" v-model="happenAreaValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
             
            ></el-option>
          </el-select>
        </div>
        <div class="keyWord">
          <label>关键字：</label>
          <div class="searchBox">
            <el-input placeholder="请输入案件名称/编号" v-model="keyWordValue">
              <i slot="suffix" @click="getCaseList" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
      </div>
      <div class="tableMainBox">
        <el-table ref="multipleTable" @row-click="openDetails" @select-all="selectAll" @select="rowSelectChange" :reserve-selection="true" :data="tableData" tooltip-effect="dark">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :class-name="'blackClass'" prop="case_title" label="案件名称">
          </el-table-column>
          <el-table-column :class-name="'blackClass'" prop="case_no" label="案件编号"></el-table-column>
          <el-table-column
            :class-name="'blackClass'"
            prop="case_type"
            label="案件类别"
            :show-overflow-tooltip="false"
          ></el-table-column>
          <el-table-column prop="happen_time" label="案发时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deal_dept" label="受理单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="happen_area" label="案发区域" show-overflow-tooltip></el-table-column>
          <el-table-column prop="case_content" label="简要案情">
            <template slot-scope="scope">
              <span style="margin-left: 10px" :title="scope.row.case_content">{{ scope.row.case_content.length>30?scope.row.case_content.slice(0,30)+'...':scope.row.case_content}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tableBoxBottom">
        共
        <span>{{totalNum}}</span> 条记录
        <div class="pageBox">
          <el-pagination :current-page.sync="pageNo" @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next" :total="totalNum"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 新建串案弹框 -->
    <el-dialog class="confirmSeriesDialog" title="新建串案" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="串案名称" prop="seriesName">
          <el-input  v-model.trim="ruleForm.seriesName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="串案类别" prop="seriesType">
          <el-select v-model="ruleForm.seriesType">
            <el-option label="盗窃" value="shanghai"></el-option>
            <el-option label="抢劫" value="beijing"></el-option>
            <el-option label="诈骗" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="串案描述" prop="markInfo">
          <el-input type="textarea" v-model="ruleForm.markInfo"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createNewSeries">确定</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="保存筛选"
      :visible.sync="saveFilterDialogVisible"
      width="30%">
      <span>保存筛选项名称</span>
      <div class="saveFilterInpBox">
        <el-input v-model="filterName" placeholder="请输入内容"></el-input>
      </div>
      <span class="filterNameerror" v-show="showNameError">请输入1-15个字符</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFilter">保 存</el-button>
        <el-button type="primary" @click="canaelsaveDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <p>确认删除该条数据？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteFilterItem">确 定</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: "featureGuidance",
  data() {
    return {
      divisionList:[],//区划
      htmlurl:window.g.GrobalUrl,
      percentList: [
        { label: "100%", value: 100 },
        { label: "80%以上", value: 80 },
        { label: "60%以上", value: 60 }
      ],
      filterList:[], // 筛选列表
      selectFilterId:'', //选中的筛选项id
      options: [],
      value:'',
      happenAreaValue: "", // 案发区划变量
      caseTypeList: [],
      activeLiIndex: 0, // 当前大案分类index
      activeCaseType:'', // 当前大案分类dicName
      paramObj:{}, // 获取警情列表需要的特征参数对象
      timeRangeValue: "", // 时间范围变量
      keyWordValue: "",// 关键字变量
      pageNo:1,
      tableData: [], // 表格数据变量
      allSelectArr:[], // 所有页选中的案件
      selectArr:[], // 当前页选中的案件
      toggleAllText:'选择所有', // 选择所有的文本变量
      selectAllFlag:false, // 选择所有的状态flag
      select_orderId:[],
      multipleSelection:null,
      select_order_number:0,

      totalNum:0, // 数据总条数
      smallCaseList: [  // 小案类别假数据
        { name: "盗窃", value: "09" },
        { name: "盗窃", value: "09" },
        { name: "盗窃", value: "09" },
      ],
      features: [],
      collapseStatus: false, // 收起按钮的收起状态
      ruleForm: {
        seriesName: "",
        markInfo: ""
      },
      rules: {
        seriesName: [
          { required: true, message: "请输入串案名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        markInfo: [
          { message: "请填写串并依据描述", trigger: "blur" },
           { max: 225, message: "长度不超过255个字符", trigger: "blur" }
        ]
      },
      fileList: [],
      dialogFormVisible: false, // 新建串案弹框
      saveFilterDialogVisible:false, // 保存筛选弹框
      deleteDialogVisible:false, // 删除弹框
      filterName:'', // 筛选弹框内筛选名称变量
      showNameError:false
    };
  },
  mounted() {
    this.initPage();
    this.getDivision()
  },
  methods: {
    // 页面初始化方法
    initPage() {
      this.getCaseType();
      this.getFilterList();
    },
    // 保存筛选
    saveFilter(){
      if(this.filterName.length<1 || this.filterName.length>15){
        this.showNameError=true
        return
      }else{
        this.showNameError=false
      }
      let featureInfos = {};
      for(let key in this.paramObj){
        featureInfos[key] = this.paramObj[key].join(',');
      }
      let beginTime='',endTime='';
      if(this.timeRangeValue){
        beginTime = this.timeRangeValue[0] + ' 00:00:00'
        endTime = this.timeRangeValue[1] + ' 23:59:59'
      }
      let conditionObj = {
        keyword:this.keyWordValue,
        happenArea:this.happenAreaValue,
        bgTime:beginTime,
        edTime:endTime,
        caseType:this.activeCaseType,
        featureInfos:JSON.stringify(featureInfos)
      }
      let param ={
        "searchName":this.filterName,
        "conditionStr":JSON.stringify(conditionObj),
        "createrId":"5783144b-ab6d-4e3f-8859-0022d2835409",
        "creater":""
      }
      this.$Ajax
        .post("searchConditionController/insert", param, true)
        .then(res => {
          console.log("savefilter res", res);
          if(res.status === 200){
            this.saveFilterDialogVisible = false;
            this.$message({
              type:'success',
              message:'保存成功'
             
            })
            this.filterName=''
            this.showNameError=false
            this.getFilterList();
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    filterChange(val){ // 筛选条件变化
    // console.log('id',val)
      // 改变筛选条件时，先把所有特征选中状态改为未选中状态
    //  debugger
      this.features.forEach(features=>{
        features.featureValue.forEach(item=>{
          item.select = false;
        })
      })
      this.getSingleFilter(val);
    },
    // 查询筛选列表
    getFilterList(){
      let param = {"createrId":"5783144b-ab6d-4e3f-8859-0022d2835409"};
      this.$Ajax
        .post("searchConditionController/listAllConditions", param, true)
        .then(res => {
          // console.log("filterList res", res);
          if(res.status ===200 && res.data){
            this.filterList = res.data;
          }
        })
        .catch(err => {;
          console.log("err", err);
        });
    },
    getSingleFilter(id){ // 查询单个筛选条件
    //debugger
      this.$Ajax
        .post("searchConditionController/selectByPrimaryKey", {id:id}, true)
        .then(res => {
          // console.log("single filter res", res);
          if(res.status ===200 && res.data){
            // this.filterList = res.data;
            let conditionStr = res.data.conditionStr;
            this.reviewFilter(conditionStr,this);
           
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 回显筛选条件结果
    reviewFilter(conditionStr,vmObj){
      let tmpObj = null;
      vmObj.paramObj = {};
    //  debugger
      // 解析后台返回的条件数据
      try {
        tmpObj = JSON.parse(conditionStr);
        // console.log('tmpobj',tmpObj)
        vmObj.keyWordValue = tmpObj.keyword;
        vmObj.happenAreaValue = tmpObj.happenArea;
        let caseType = tmpObj.caseType; // 获取当前条件的案件分类
        let activeIndex = this.caseTypeList.findIndex(item=>item.dicName === caseType);
        if(activeIndex>-1){
          let activeItem = this.caseTypeList[activeIndex]
          this.activeLiIndex = activeIndex;
          this.activeCaseType = activeItem.dicName;
          let promiseObj = this.getFeatureInfo(activeItem.dicCode); // 接收请求特征信息的promise对象，等特征数据更新后再进行回显操作
          promiseObj.then(()=>{
          //  debugger
            let featureInfos = JSON.parse(tmpObj.featureInfos);
            let strArr = []; // 存储所有被选中特征的文本数组  如 白天,黑夜等
            for(let key in featureInfos){
              strArr = strArr.concat(featureInfos[key].split(','))
              vmObj.paramObj[key] = featureInfos[key].split(',');
            }
            //遍历所有特征数据，如果文本存在于strArr数组，更改其选中状态为true
            vmObj.features.forEach(features=>{
                features.featureValue.forEach(item=>{
                  if(strArr.includes(item.dicName)){
                    item.select = true;
                  }
                })
              })

             this.getCaseList();


          })
        }

      } catch (error) {
        console.log('conditionstr is null');
      }
    },
    // 新建串案按钮事件
    newSeriesClick(){
      if(this.allSelectArr.length<2){
        this.$message({
          type:'info',
          message:'至少选两条案件'
        })
        return;
      };
      this.ruleForm.seriesName=''
      this.ruleForm.markInfo=''
      this.dialogFormVisible = true;
    },
    // 添加待串列表
    addToWaitingInfo(){
      if(this.allSelectArr.length === 0){
        this.$message({
          type:'warning',
          message:'未选中案件！'
        });
        return;
      }
      let param = {"createrId":"5783144b-ab6d-4e3f-8859-0022d2835409","caseNos":this.allSelectArr}
      this.$Ajax.post('ssWaitingInfoController/addWaitingInfos',param,true).then(res=>{
              console.log('addToWaitingInfo res',res);
              if(res.status ===200){
                // console.log('delete filter res',res.data)
                this.$message({
                  type:'success',
                  message:'添加成功！'
                })
              }else{
                this.$message({
                  type:'warning',
                  message:res.err
                })
              }

            }).catch(err=>{
              console.log('err',err);
            })
    },
    // 新建串案弹框确认事件
    createNewSeries(){
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {

            let param = {
              "seriesName":this.ruleForm.seriesName,
              "seriesType":"2",
              "markInfo":this.ruleForm.markInfo,
              "attachmentId":"",
              "createrId":"5783144b-ab6d-4e3f-8859-0022d2835409",
              "creater":"",
              "caseNos":this.allSelectArr
              }
            this.$Ajax.post('ssSeriesInfoController/createSeriesInfo',param,true).then(res=>{
              // console.log('res',res);
              if(res.status ===200){
                // console.log('delete filter res',res.data)
                this.$message({
                  type:'success',
                  message:'串案成功！'
                })
                this.dialogFormVisible = false;
                this.$refs['ruleForm'].resetFields();
              }else{
                this.$message({
                  type:'warning',
                  message:res.err
                })
              }

            }).catch(err=>{
              console.log('err',err);
            })

          } else {
            return false;
          }
        });

    },
    selectAll(selection){ //勾选表格表头checkbox事件
      console.log('selection',selection);
      let selectLen = selection.length;
      if(selectLen!==0){
        selection.forEach(item=>{
          if(!this.allSelectArr.includes(item.case_no)){
            this.allSelectArr.push(item.case_no);
          }
        })
      }else{
        this.tableData.forEach(row=>{
          if(this.allSelectArr.includes(row.case_no)){
            let index = this.allSelectArr.findIndex(item=>item === row.case_no);
            this.allSelectArr.splice(index,1);
          }
        })
      }
      console.log('allselect',this.allSelectArr);
    },
    rowSelectChange(selection,row){ //表格单行checkbox勾选事件
      // console.log('rowselect',selection,row);
      if(!this.allSelectArr.includes(row.case_no)){
        this.allSelectArr.push(row.case_no);
      }else{
        let index = this.allSelectArr.findIndex(item=>item === row.case_no);
        this.allSelectArr.splice(index,1);
      }
    },
    toggleSelection(rows) { //  回显列表选中的方法
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    // 当前页数变化事件
    handleCurrentChange(val){
      this.pageNo = val;
      // console.log('pageNo',val);
      this.getCaseList();
    },
    // 时间变化事件
    timeChange(){
      this.getCaseList();
    },
    caseTypeClick(item,index){
      // console.log(item.dicCode,'diccode');
      this.activeLiIndex = index;
      this.activeCaseType = item.dicName;
      this.getFeatureInfo(item.dicCode);
    },
    // 获取案件分类
    getCaseType() {
      let that=this
      this.$Ajax
        .post("ssSeriesInfoController/getCaseType", {}, true)
        .then(res => {
          // console.log("res", res);
          that.caseTypeList = res.data;
          let firstCode = res.data[0].dicCode;
          that.activeCaseType = res.data[0].dicName;
          that.getFeatureInfo(firstCode);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 获取特征数据
    getFeatureInfo(caseTypeCode) {
      let param = { caseTypeCode: caseTypeCode };
      let promiseObj = this.$Ajax
        .post(
          "ssSeriesInfoController/getFeatureInfo",
          param,
          true
        )
        .then(res => {
          console.log(res, "featureInfo");
          let data = res.data;
          this.paramObj = {};
          // 处理特征数据，增加select属性，使其可切换选中状态
          data.forEach(features=>{
            this.paramObj[features.remark] = [];
            features.featureValue.forEach(item=>{
              item.select = false;
            })
          })
          this.features = data;
          this.getCaseList();
          // console.log('paramObj',this.paramObj)
        });
        return promiseObj;
    },
    // 获取警情列表
    getCaseList(){
    //debugger
      // 获取特征参数--------------
      let featureInfos = {};
      for(let key in this.paramObj){
        featureInfos[key] = this.paramObj[key].join(',');
      }
      // console.log('featuresParam',featureInfos);
      // console.log('timeRangeValue',this.timeRangeValue);
      let beginTime='',endTime='';
      if(this.timeRangeValue){
        beginTime = this.timeRangeValue[0] + ' 00:00:00'
        endTime = this.timeRangeValue[1] + ' 23:59:59'
      }
      let param ={
        "casetype":this.activeCaseType,
        "featureinfos":featureInfos,
        "keyword":this.keyWordValue,
        "happenArea":this.happenAreaValue,
        "bgTime":beginTime,
        "edTime":endTime,
        "pageSize":"10",
        "pageNo":this.pageNo+""
        }
      this.$Ajax
        .post("ssSeriesInfoController/listCaseByCondition",param, true)
        .then(res => {
          // console.log("caseList", res.data.datalist);
          if(res.status ===200){
            
            this.tableData = res.data.datalist;
            this.totalNum = res.data.totalNum;
            this.selectAllFlag = false;
            this.toggleAllText = '选择所有';
            let tmpArr = []
            this.tableData.forEach(item=>{
              if(this.allSelectArr.includes(item.case_no)){
                tmpArr.push(item);
              }

            })
            this.$nextTick(()=>{
              this.toggleSelection(tmpArr);
            })

          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    deleteFilterItem() { // 删除筛选条件
      this.$Ajax
        .post("searchConditionController/deleteByPrimaryKey",{id:this.selectFilterId}, true)
        .then(res => {
          // console.log("caseList", res.data.datalist);
          if(res.status ===200){
            // console.log('delete filter res',res.data)
            this.deleteDialogVisible = false;
            this.$message({
              type:'success',
              message:'删除成功！'
            })
            this.getFilterList();
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 特征项点击事件
    featureClick(feature,featureObj) {
   //   debugger
      feature.select = !feature.select;  // 切换特征项选中状态
      let arr = this.paramObj[featureObj.remark]
      if(arr){
        if(feature.select){
          if(!arr.includes(feature.dicName)){
            arr.push(feature.dicName)
          }
        }else{
          if(arr.includes(feature.dicName)){
            let index = arr.findIndex(item=>item===feature.dicName)
            arr.splice(index,1)
          }
        }
      }
      this.getCaseList();
      // console.log('paramobj',this.paramObj)
    },
    // 收起按钮点击事件
    collapseClick() {
      this.collapseStatus = !this.collapseStatus;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    toggleAllSelection() {
      this.$refs.multipleTable.toggleAllSelection();
      this.selectAllFlag = !this.selectAllFlag;
      if(this.selectAllFlag){
        this.toggleAllText = '取消选择';
        this.tableData.forEach(item=>{
          if(!this.allSelectArr.includes(item.case_no)){
            this.allSelectArr.push(item.case_no);
          }
        })
      }else{
        this.toggleAllText = '选择所有';
        this.tableData.forEach(row=>{
          if(this.allSelectArr.includes(row.case_no)){
            let index = this.allSelectArr.findIndex(item=>item === row.case_no);
            this.allSelectArr.splice(index,1);
          }
        })
      }
    },
    openDetails(row, event, column){
       window.open(this.htmlurl+'/VisualizePlatform/file/e98b16ef65c04fa7a6e786d8716e265b.html?id='+row.case_no) 
    },
    exportdata(){
        // debugger
         let tmpArr=[]
         this.tableData.forEach(item=>{
              if(this.allSelectArr.includes(item.case_no)){
                tmpArr.push(item);
              }
            })
      var arrData = tmpArr
      var that = this
      var aoa=[['案件编号','简要案情','案发时间','案件名称','案件类别','案发区域','受理单位']]
      for(let i = 0 ; i < arrData.length ; i++ ){
         let itemlist=[]
        for(let item in arrData[i]){
            if(arrData[i][item]==null){
              arrData[i][item]=0
            }
              itemlist.push(arrData[i][item])
        }
        aoa.push(itemlist)
      }
       var ws = XLSX.utils.aoa_to_sheet(aoa);
                var wb = XLSX.utils.book_new();
                wb.SheetNames.push('sheet1');
                wb.Sheets['sheet1'] = ws;
                var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
                var wbout = XLSX.write(wb, wopts);
                saveAs(new Blob([wbout], { type: "application/octet-stream" }), "特征引导串.xlsx");
                self.export_percentage = -1;
    },
    canaelsaveDialog(){
      this.saveFilterDialogVisible = false
      this.showNameError=false
    },
    //获取区划List
    getDivision(){
     // debugger
         this.$Ajax
        .post("alarmInfoController/queryQuHuaType", true)
        .then(res => {
          // console.log("caseList", res.data.datalist);
           for(let i=0;i<res.list.length;i++){
                let list={'value':res.list[i].dicCode,'lable':res.list[i].dicName}
                this.options.push(list)
           }
           
        })
    }
   
  }
};
</script>
<style scoped  lang="less">
@import "../../../static/css/featureGuidance.less";
</style>

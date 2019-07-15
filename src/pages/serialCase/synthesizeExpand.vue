<template>
  <div id="synthesizeExpand">
    <!-- 已选串案 -->
    <div class="selectSeriesBox">
      <h3>已选串案</h3>
      <div class="selectSeries">
        <div v-for="(item,index) in hasSeriesList" :key="index">
          <!-- <el-checkbox @change="checkChange(item)" v-model="item.checked">{{item.seriesName}} ({{item.caseNum}}起)</el-checkbox> -->
          <span>{{item.seriesName}} ( {{item.caseNum}}起 )</span>
        </div>
      </div>
    </div>
    <!-- 碰撞条件 -->
    <div class="collisionCondition">
      <h3>案件碰撞条件</h3>
      <div class="conditions">
        <div>
          <div class="conditionItem" v-for="(item,index) in collisionConditionList" :key="index">
            {{item.name}}
            <span>（{{item.num}}）个</span>
          </div>
          <div class="conditionItem">
            碰撞同案异串
            <span>（{{tongAnYiChuan.length}}）个</span>
          </div>
        </div>
        <div class="lookCondition">
          <a @click="lookCondition">查看具体条件</a>
        </div>
      </div>
    </div>
    <!-- 推荐扩串 -->
    <div class="recommendExpand">
    
      <div class="operationBox">
        <div class="operationLeft">
            <span>推荐扩串案件</span>
         <el-button @click="confirmClick">新建串案</el-button>
        </div>
        <!-- <div class="operationRight">
          <el-pagination @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next" :total="totalNum"></el-pagination>
        </div> -->
      </div>
      <div class="casesBox">
        <div class="caseItem" v-for="(item,index) in caseList" :key="index">
          <!-- <div class="caseItem"> -->
          <div class="caseHead">
            <div class="hit">
              <i class="el-icon-success"></i> 命中：
            </div>
          
            <div class="casedata">
              <ul>
             <li class="headPhone" v-for="(list,index) in item.datavalue" :key="index">{{list}}</li>
             </ul>
            </div>
          </div>
          <div class="caseBody">
            <div class="bodyleft">
              <el-checkbox @change="checkChange(item)" v-model="item.checked"></el-checkbox>
              <p
                class="percent"

              >分值：<span :class="{worstCase:item.totalscope>=100,badCase:item.totalscope>80&&item.totalscope<100,healthCase:item.totalscope>60&&item.totalscope<=80,goodCase:item.totalscope<=60}">{{item.totalscope}}</span></p>
            </div>
            <div class="bodyCenter">
              <a  @click="openDetails(item)">{{item.case_no}}</a>
              <p>{{item.case_title}}</p>
              <p>案发时间：{{item.happen_time}}</p>
            </div>
            <div class="bodyRight">
              <p :title="item.case_content">{{item.case_content}}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="caseBottom">
        共
        <span>{{totalNum}}</span> 条记录
        <div class="pageBox">
          <el-pagination @current-change="handleCurrentChange" small background layout="jumper,prev, pager, next" :total="totalNum"></el-pagination>
        </div>
      </div>
    </div>
    <!-- <div class="synthesizeExpandBottom">
      <div class="confirmSeriesBtn">
        <el-button @click="confirmClick">确定串案</el-button>
      </div>
    </div> -->

    <!-- 案件碰撞条件弹框 -->
    <el-dialog class="collisionDialog" title="案件碰撞条件" :visible.sync="dialogTableVisible">
      <div class="getCaseFeature" v-for="(item) in collisionConditionList" :key="item.type">
        <h3>{{item.name}}</h3>
        <p v-for="(bigItem,index) in item.dataList" :key="index">
          <label>{{bigItem.dicName+'：'}}</label>
          <span v-for="(smallItem,rowIndex) in bigItem.datavalueList" :key="rowIndex">{{smallItem.datavalue}} </span>
        </p>

      </div>
      <!-- <div class="getCaseAddress">
        <h3>提取号码地址</h3>
        <p>
          <label>身 份 证 ：</label>
          <span>54678719900708948484</span>
        </p>
        <p>
          <label>手 机 号 ：</label>
          <span>13898098776</span>
        </p>
        <p>
          <label>地 址 ：</label>
          <span>北京市</span>
        </p>
      </div> -->
      <div class="collisionSameCase">
        <h3>碰撞同案异串</h3>
        <div class="tongAnYiChuan">
          <label>同案 ：</label>
          <div>
            <span v-for="(item,index) in tongAnYiChuan" :key="index"> {{item.series_no}} </span>
          </div>
        </div>
      </div>
      <div class="dialogBottom">
        <div class="confirmBtn">
          <el-button @click="dialogTableVisible=false">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 确认串并弹框 -->
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
        <!-- <el-form-item label="串案类别" prop="region">
          <el-select v-model="ruleForm.region">
            <el-option label="盗窃" value="shanghai"></el-option>
            <el-option label="抢劫" value="beijing"></el-option>
            <el-option label="诈骗" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="串案条件" prop="region">
          <p>DNA;夜间;小区;溜门入室;钱包</p>
        </el-form-item> -->
        <el-form-item label="串案描述" prop="markInfo">
          <el-input type="textarea"  v-model="ruleForm.markInfo"></el-input>
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
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "synthesizeExpand", //综合扩串
  data() {
    return {
      htmlurl:window.g.GrobalUrl,
      seriesNos:'', // 页面查询数据所需串案编号
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      value: "seriesnum",
      input4: "",
      currentPage4: 4,
      pageComObj: {
        firstPage: 1,
        lastPage: 20,
        currentPage: 1,
        total: 50
      },
      currentPage: 5,
      checked: true,
      hasSeriesList: [],
      collisionConditionList: [], // 碰撞条件数组 案件特征、号码地址
      tongAnYiChuan:[],         // 同案一串数据
      caseList: [], // 案件列表变量
      totalNum:0, //总数据条数
      pageNo:1, // 当前页数
      toggleAllText:'选择所有', // 选择所有的文本变量
      selectAllFlag:false, // 选择所有的状态flag
      ruleForm: {
        seriesName: "",
        markInfo: ""
      },
      rules: {
        seriesName: [
          { required: true, message: "请输入串案名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在1 到 15 个字符", trigger: "blur" }
        ],
        markInfo: [
          { required: false, message: "请填写串并依据描述", trigger: "change" },
          { max: 225, message: "长度不超过255个字符", trigger: "blur" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ message: "请填写活动形式", trigger: "blur" }]
      },
      fileList: [],
      checkedIds:[]
    };
  },
  created(){
    // 获取从链接地址传过来的参数
    let linkParams = this.$router.query;
    this.UrlSearch();
  },
  mounted(){
    this.initPage();
  },
  methods: {
    initPage(){
      this.getHasSeries();
      this.getCollisionCondition();
      this.getCaseList();
    },
    confirmClick(){ //确定串案 按钮点击事件
      if(this.checkedIds.length<2){
        this.$message({
          type:'info',
          message:'至少选两条案件'
        })
        return;
      };
      this.dialogFormVisible = true;
    },
    UrlSearch(){ // 处理从地址栏传过来的参数 串案编号
      var str=location.href; //取得整个地址栏
      var num=str.indexOf("?")
      if(num>=0){
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        // var seriesNumberArr=str.split(","); //各个串案编号放到数组里
        this.seriesNos = str;
        console.log('seriesNos',this.seriesNos);
      }
    },
    toggleAllSelection(){ // 选择所有
      // this.$refs.multipleTable.toggleAllSelection();

      this.selectAllFlag = !this.selectAllFlag;
      if(this.selectAllFlag){
        this.toggleAllText = '取消选择';
        this.caseList.forEach(item=>{
          item.checked = true;
          if(!this.checkedIds.includes(item.case_no)){
            this.checkedIds.push(item.case_no);
          }
        })
      }else{
        this.toggleAllText = '选择所有';
        this.caseList.forEach(item=>{
          item.checked = false;
          if(this.checkedIds.includes(item.case_no)){
            let index = this.checkedIds.findIndex(caseNo=>item.case_no === caseNo);
            this.checkedIds.splice(index,1);
          }
        })
      }
    },
    handleCurrentChange(val){
      this.pageNo = val;
      // console.log('pageNo',val);
      this.getCaseList();
    },
    getCaseList(){ // 查询警情列表
      let param = {
        // "seriesNos":"C201904201555741779035,C201904221555918719833",
        "seriesNos":this.seriesNos,
        "pageSize":"5",
        "pageNo":this.pageNo+''
        }
      this.$Ajax.post('ssSeriesInfoController/listCaseBySeriesInfo',param,true).then(res=>{
        console.log('caselist----',res);
        if(res.status === 200 && res.data){
          this.caseList = res.data.dataList;
          this.totalNum = res.data.totalNum;
          this.selectAllFlag = false;
            this.toggleAllText = '选择所有';
          this.caseList.forEach(item=>{
            // item.checked = true;
            this.$set(item,'checked',false);
            if(this.checkedIds.includes(item.case_no)){
              this.$set(item,'checked',true);
            }
          });

        }
      }).catch(err=>{
        console.log('err',err);
      });
    },
    getHasSeries(){ // 查询顶部已选串案
      // let param = {"seriesNos":"C201904201555741779035,C201904221555918719833"};
      let param = {"seriesNos":this.seriesNos};
      this.$Ajax.post('ssSeriesInfoController/listSeriesByNos',param,true).then(res=>{
        console.log('hasSeriesList',res);
        if(res.status === 200 && res.data){
          this.hasSeriesList = res.data;
        }
      }).catch(err=>{
        console.log('err',err);
      })
    },
    getCollisionCondition(){ // 查询碰撞条件
      // let param = {"seriesNos":"C201904201555741779035,C201904221555918719833"};
      let param = {"seriesNos":this.seriesNos};
      this.$Ajax.post('ssSeriesInfoController/listConBySeriesInfo',param,true).then(res=>{
        console.log('res collision condition',res);
        if(res.status === 200 && res.data){
          // this.hasSeriesList = res.data;
          let tmpArr = []; //条件数组
          res.data.forEach(item=>{
            if(item.type === 'tz'){
              item.name = '提取案件特征';
              tmpArr.push(item);
            }else if(item.type === 'mh'){
              item.name = '提取号码地址';
              tmpArr.push(item);
            }else{
              this.tongAnYiChuan = item.dataList;
            }
          });
          this.collisionConditionList = tmpArr;
        }
      }).catch(err=>{
        console.log('err',err);
      })
    },
    pageAdd() {
      this.currentPage++;
      console.log("??", this.currentPage);
    },
    checkChange(item) {
      let caseNo = item.case_no;
      if(item.checked){
        if(!this.checkedIds.includes(caseNo)){
          this.checkedIds.push(caseNo);
        }
      }else{
        if(this.checkedIds.includes(caseNo)){
          let index = this.checkedIds.findIndex(item=>item === caseNo);
          this.checkedIds.splice(index,1);
        }
      }
      console.log('ids',this.checkedIds);
    },
    lookCondition() {
      this.dialogTableVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // element 上传组件方法-------------------------------------
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
    // 新建串案弹框确认事件
    createNewSeries(){
      this.$refs['ruleForm'].validate((valid) => {
        debugger
          if (valid) {
            this.dialogFormVisible = false;
            let param = {
              "seriesName":this.ruleForm.seriesName,
              "seriesType":"4",
              "markInfo":this.ruleForm.markInfo,
              "attachmentId":"",
              "createrId":"",
              "creater":"",
              // "caseNos":this.allSelectArr
              "caseNos":this.checkedIds
              }
            this.$Ajax.post('ssSeriesInfoController/createSeriesInfo',param,true).then(res=>{
              console.log('res',res);
              if(res.status ===200){
                // console.log('delete filter res',res.data)
                this.$message({
                  type:'success',
                  message:'串案成功！'
                })
              }
              this.$refs['ruleForm'].resetFields();
            }).catch(err=>{
              console.log('err',err);
            })

          } else {
            return false;
          }
        });

    },
      openDetails(row){
       window.open(this.htmlurl+'/VisualizePlatform/file/e98b16ef65c04fa7a6e786d8716e265b.html?id='+row.case_no) 
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/synthesizeExpand.less";
</style>

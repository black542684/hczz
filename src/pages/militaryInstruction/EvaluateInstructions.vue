<template>
    <div class="big-box">
        <div class="header-container">
            <el-row :gutter="20" class="el-row-style">
                <el-col :span="6" class="el-col-style">
                    <div class="grid-content">
                        <span class="header-title">研判指令确认评价</span>
                        <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
                    </div>
                </el-col>
                <el-col :span="8" :offset="10">
                    <div class="grid-content">
                        <el-row class="el-row-right">
                            <!-- <router-link tag="span" to='detailsInstructions' style="display:inline-block;margin-right:10px;"> -->
                                <el-button type="primary" size="small" @click="submitForm('instructForm')" v-if="isOnlyRead & btnShowFlag">确认</el-button>
                            <!-- </router-link> -->
                            <el-button size="small" @click="checkProcess">查看流程</el-button>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            
            <el-form 
                :inline="true" 
                :model="instructForm"
                :rules="instructRules"
                ref="instructForm" 
                class="instruct-form form-style"
                label-width="100px">

                <instructions :instructForm='instructForm'/>

                <div class="form-item" style="padding-bottom: 20px;">
                    <div class="form-title">专案组人员</div>
                    <el-table :data="specialCaseTableData" class="element-table border-table">
                        <el-table-column prop="types" label="侦办单位" width="80"></el-table-column>
                        <el-table-column prop="units" label="" width="300"></el-table-column>
                        <el-table-column prop="names" label="姓名"></el-table-column>
                        <el-table-column prop="duty" label="职务"></el-table-column>
                        <el-table-column prop="options" label="侦办角色"></el-table-column>
                        <el-table-column prop="phone" label="电话"></el-table-column>
                    </el-table>
                </div>

                <div class="form-item">
                    <div class="form-title">提交信息</div>
                    <div class="approve-list" v-for="(item,index) in approveList" :key="index">
                    <el-form-item label="审核人：" prop="superiorAuditor">
                        <div>{{ item.hParam.createName }}</div>
                    </el-form-item>
                    <el-form-item label="审核结果：" prop="auditorResult" v-show="item.hParam.result">
                        <p class="success-result">{{ item.hParam.result }}</p>  
                    </el-form-item>
                    <!-- 占位 -->
                    <el-form-item></el-form-item>

                    <el-form-item 
                    label="审核意见：" 
                    prop="applyInstructions"
                    class="check-brief-case-content">
                    <div>{{ item.hParam.suggest }}</div>
                    </el-form-item>
                    </div>
                </div>

                <div class="form-item" style="padding-bottom: 20px;">
                    <div class="form-title">侦办工作反馈</div>
                    <!-- <el-table :data="caseFeedbackTableData" class="element-table border-table">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="duty" label="侦办单位" width="200"></el-table-column>
                        <el-table-column prop="person" label="反馈人员" width="100"></el-table-column>
                        <el-table-column prop="time" label="反馈时间" width="240"></el-table-column>
                        <el-table-column prop="status" label="阶段性工作侦查情况"></el-table-column>
                        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                        <el-table-column prop="accessory" label="附件" width="150"></el-table-column>
                    </el-table> -->
                    <div class="insFeedbacks-box">
                        <div class="insFeedbacks-table">
                        <div class="insFeedbacks-title">
                            <ul class="clearfix">
                                <li style="width:5%">序号</li>
                                <li>侦办单位</li>
                                <li>反馈人员</li>
                                <li>反馈时间</li>
                                <li style="width:35%">阶段性工作侦查情况</li>
                                <li>附件</li>
                            </ul>
                        </div>
                        <div class="insFeedbacks-item" v-for="(item,index) in caseFeedbackTableData" :key="index">
                            <ul class="clearfix">
                                <li style="width:5%">{{ index + 1 }}</li>
                                <li :title="item.spyDepName">{{ item.spyDepName }}</li>
                                <li :title="item.spyDepName">{{ item.spyDepName }}</li>
                                <li :title="item.feedbackTime">{{ item.feedbackTime }}</li>
                                <li style="width:35%" :title="item.workContent">{{ item.workContent }}</li>
                                <li>
                                    <a :href="item.fileVisitPath" :download="item.fileName" v-for="(item,index) in item.attachments" :key="index">{{ item.fileName }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="form-item" style="padding-bottom: 20px;">
                    <div class="form-title">落地抓捕情况</div>

                    <p class="second-title">破获案件</p>
                    <el-table :data="arrestTableData" class="element-table">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="number" label="案件编号" width=""></el-table-column>
                        <el-table-column prop="units" label="立案单位" width=""></el-table-column>
                        <el-table-column prop="time" label="立案时间"></el-table-column>
                        <el-table-column prop="address" label="案发地点" width=""></el-table-column>
                        <el-table-column prop="caseName" label="案件名称" width=""></el-table-column>
                    </el-table>

                    <p class="second-title" style="margin-top:20px;">抓获人员</p>
                    <el-table :data="capturedTableData" class="element-table">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
                        <el-table-column prop="genders" label="性别" width="100"></el-table-column>
                        <el-table-column prop="numberID" label="身份证号" width="200"></el-table-column>
                        <el-table-column prop="homeAddress" label="户籍地址" width=""></el-table-column>
                        <el-table-column prop="beforeInfo" label="前科信息" width="300"></el-table-column>
                    </el-table>

                    <p class="second-title" style="margin-top:20px;">破案报告</p>
                    <!-- <div class="arrest-report">{{instructForm.arrestReport.join(';')}}</div> -->
                    <div class="arrest-report">
                        <a :href="item.fileVisitPath" 
                           :download="item.fileName" 
                           v-for="(item,index) in instructForm.arrestReport" 
                           :key="index"
                           style="margin-right: 10px;">
                           {{ item.fileName }}
                        </a>
                    </div>
                </div>

                <div class="form-item" style="padding-bottom: 20px;" v-if="isOnlyRead & btnShowFlag">
                    <div class="form-title">确认评价</div>
                    <el-form-item label="确认意见：" prop="opinion" class="brief-case-content">
                        <el-input type="textarea" :rows="4" placeholder="请输入确认意见" v-model="instructForm.opinion"></el-input>
                    </el-form-item>
                </div>

                <div class="form-btn-item" style="margin-bottom: 40px;" v-if="isOnlyRead & btnShowFlag">
                    <el-form-item>
                        <!-- <router-link tag="span" to='ypManagement' style="display:inline-block;"> -->
                            <el-button type="primary" size="small" @click="submitForm('instructForm')">确认</el-button>
                        <!-- </router-link> -->
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 流程弹窗 -->
        <div class="process-box" v-show="processIsShow">
            <div class="process-border" id="mountNode">
                <flow-chart :chartData='chartData' :processIsShow='isData'></flow-chart>
            </div>
        </div> 
    </div>
</template>

<script>
//  引入流程图插件 AntV/g6
import G6 from '@antv/g6'
//  引入流程图节点图片
import processNodeDefault from '../../../static/image/processNodeDefault.png'
import processNodeSuccess from '../../../static/image/processNodeSuccess.png'
// 引入流程图
import flowChart from '../../components/flowChart'
//  引入通用'指令'组件
import instructions from '../../components/MILInstructions.vue'

export default {
    name: 'evaluateInstructions',
    components:{
        instructions,
        flowChart
    },
    data () {
        return {
            processIsShow:false,        //  流程弹框显示与否
            accessoryPlacrholder:'请上传案情材料，案情列表，物证详情等',
            isBack:false,               //  是否退回

            instructForm: {             //  表单内容
                //  指令信息内容             
                instructName: '',
                instructNumber: '',
                unit:'',
                person:'',
                time:'',

                //  案源信息内容
                caseNumber:'',
                caseName:'',
                caseMeans:'',
                caseCount:0,
                personnel:'',
                caseType:'',
                briefCase:``,
                gist:'',
                clueTrait:'',
                fileList:[],        //  保存上传附件名称的数组

                //  指定侦办内容
                mainSpyUnit:'',
                cooperateSpyUnit:'',
                spyRequire:'',

                //  提交信息内容
                superiorAuditor:'',
                auditorResult:'',
                applyInstructions:'',

                //  审批部分
                approveAuditor:'',
                approveResult:'',
                approveInstructions:'',

                //  破案报告
                arrestReport:[],

                //  确认评价
                opinion:''
            },
            specialCaseTableData:[      //  专案组table数据
                
            ],
            caseFeedbackTableData:[     //  侦办工作反馈table数据
                
            ],
            isUpload:false,
            arrestTableData:[           //  破获案件table数据
                
            ],
            capturedTableData:[         //  抓获人员列表数据
                
            ],
            instructRules: {
                opinion: [
                    { required: true, message: "请输入审批意见", trigger: ["blur"] },
                    { min: 1, max: 500, message: '请输入1-500个字符', trigger: ["blur"] }
                ]
            },
            bkID: '',
            createBy: '',
            token: '',
            userId: '',
            createName: '', // 登录人名字
            depName: '', // 登录人单位
            isOnlyRead: false,
            btnShowFlag: false, // 流程控制按钮
            approveList: [], // 审批过程
            userList: '', // 主侦下的人员
            taskId: '',
            isData: false,
            chartData: '', // 流程图数据
        }
    },
    created() {
        this.taskId = this.$route.query.taskId
        if (localStorage.getItem('userName')) {
            this.createBy = localStorage.getItem('userName')
        }
        if (localStorage.getItem('userId')) {
            this.userId = localStorage.getItem('userId')
        }
        if (localStorage.getItem('token')) {
            this.token = localStorage.getItem('token')
        }
        if (localStorage.getItem('realName')) {
            this.createName = localStorage.getItem('realName')
        }
        if (this.$route.query.statusType) {
            if (this.$route.query.statusType === '1' || this.$route.query.statusType === '2') {
                this.isOnlyRead = false
            } else {
                this.isOnlyRead = true
            }
        }
        this.getCurDep()
    },
    mounted() {
        // this.bkID = window.location.href.split('=')[1]; //..获取当前路径下的布控ID
        this.bkID = this.$route.query.id
        this.initChart()

        //  获取数据
        this.$Ajax.get('fightcmd/cmdDetails',{id: this.bkID,createBy: this.createBy}, true).then(res=>{
            console.log(res);
            //  指令信息
            this.instructForm.instructName = res.data.cmdDetails.insName;
            this.instructForm.instructNumber = res.data.cmdDetails.insCode;
            this.instructForm.unit = res.data.cmdDetails.createDepName;
            this.instructForm.person = res.data.cmdDetails.createName;
            this.instructForm.time = res.data.cmdDetails.createTime;

            //  案源信息
            this.instructForm.caseNumber = res.data.cmdDetails.caseSourceCode;
            this.instructForm.caseName = res.data.cmdDetails.caseSourceName;
            this.instructForm.caseMeans = res.data.cmdDetails.meansOfCrime;
            this.instructForm.caseCount = res.data.cmdDetails.caseAmount;
            this.instructForm.personnel = res.data.cmdDetails.judgmentName;
            this.instructForm.caseType = res.data.cmdDetails.caseTypeName;
            this.instructForm.briefCase = res.data.cmdDetails.caseInfo;
            this.instructForm.gist = res.data.cmdDetails.techEvide;                
            this.instructForm.clueTrait = res.data.cmdDetails.clueFeature;
            this.instructForm.attachments = res.data.cmdDetails.attachments;
            for(var i=0;i<res.data.cmdDetails.attachments.length;i++){
                this.instructForm.fileList.push(res.data.cmdDetails.attachments[i].fileName);
            }

            //  指定侦办
            this.instructForm.mainSpyUnit = res.data.cmdDetails.mainSpyDepName;
            this.instructForm.cooperateSpyUnit = res.data.cmdDetails.coSpyDepName;
            this.instructForm.spyRequire = res.data.cmdDetails.spyRequire;
            this.instructForm.applyDesc = res.data.cmdDetails.applyDesc;

            //  提交信息
            // this.instructForm.superiorAuditor = res.data.activitiInfoList.data[1].assignee;
            // this.instructForm.auditorResult = res.data.activitiInfoList.data[1].hParam.result ;
            // this.instructForm.applyInstructions = res.data.activitiInfoList.data[1].hParam.reason;
            res.data.activitiInfoList.data.forEach(item => {
                if ((item.endTime !== null) & (item.hParam.suggest !== undefined)) {
                    this.approveList.push(item);
                }
                if (item.taskDefinitionKey === 'zzzlsq') {
                    this.userList = item.hParam.userList
                }
            });

            //  审批部分
            this.instructForm.approveAuditor = res.data.activitiInfoList.data[2].assignee;
            this.instructForm.approveResult = res.data.activitiInfoList.data[2].hParam.result ;
            this.instructForm.approveInstructions = res.data.activitiInfoList.data[2].hParam.reason;

            //  专案组人员table数据
            for(var i=0;i<res.data.cmdDetails.insTaskForces.length;i++){
                const setObj = {};
                setObj.types = res.data.cmdDetails.insTaskForces[i].typeName;
                setObj.units = res.data.cmdDetails.insTaskForces[i].spyDepName;
                setObj.names = res.data.cmdDetails.insTaskForces[i].memberName;
                setObj.options = res.data.cmdDetails.insTaskForces[i].role;
                setObj.duty = res.data.cmdDetails.insTaskForces[i].memberPost;
                setObj.phone = res.data.cmdDetails.insTaskForces[i].memberPhone;

                this.specialCaseTableData.push(setObj);
            }

            //  侦办工作反馈table数据
            // for(var j=0;j<res.data.cmdDetails.insFeedbacks.length;j++){
            //     const setObj = {};
            //     setObj.duty = res.data.cmdDetails.insFeedbacks[j].spyDepName;
            //     setObj.person = res.data.cmdDetails.insFeedbacks[j].spyName;
            //     setObj.time = res.data.cmdDetails.insFeedbacks[j].feedbackTime;
            //     setObj.status = res.data.cmdDetails.insFeedbacks[j].workContent;
            //     //setObj.phone = null;//res.data.cmdDetails.insFeedbacks[j].;
            //     setObj.accessory = res.data.cmdDetails.insFeedbacks[j].attachments;

            //     this.caseFeedbackTableData.push(setObj);
            // }
            this.caseFeedbackTableData = res.data.cmdDetails.insFeedbacks

            //  破获案件table数据
            for(var k=0;k<res.data.cmdDetails.cases.length;k++){
                const setObj = {};
                setObj.number = res.data.cmdDetails.cases[k].caseCode;
                setObj.units = res.data.cmdDetails.cases[k].putOnDep;
                setObj.time = res.data.cmdDetails.cases[k].putOnTime;
                setObj.address = res.data.cmdDetails.cases[k].caseAddress;
                setObj.caseName = res.data.cmdDetails.cases[k].caseName;

                this.arrestTableData.push(setObj);
            }

            //  抓获人员列表数据
            for(var k=0;k<res.data.cmdDetails.peoples.length;k++){
                const setObj = {};
                setObj.name = res.data.cmdDetails.peoples[k].peopleName;
                if(res.data.cmdDetails.peoples[k].peopleSex==0){
                    setObj.genders = '男';
                }else{
                    setObj.genders = '女';
                }
                setObj.numberID = res.data.cmdDetails.peoples[k].peopleIdcard;
                setObj.homeAddress = res.data.cmdDetails.peoples[k].peopleAddr;
                setObj.beforeInfo = res.data.cmdDetails.peoples[k].peopleCrimeBefore;

                this.capturedTableData.push(setObj);
            }
            
            //破案报告
            for(var p=0;p<res.data.cmdDetails.attachmentCases.length;p++){
                this.instructForm.arrestReport.push({
                    fileName: res.data.cmdDetails.attachmentCases[p].fileName,
                    fileVisitPath: res.data.cmdDetails.attachmentCases[p].fileVisitPath
                });
            }
            
            // 流程按钮
            if (res.data.btn.length > 0) {
                res.data.btn.forEach(item => {
                    if (item.taskDefKey === this.$route.query.deptType) {
                        this.btnShowFlag = true;
                    }
                });
            }
            //this.instructForm.arrestReport;
        });
    },
    methods:{
        // 获取部门
        getCurDep() {
            let that = this
            let params = {
                token: this.token
            }
            let url = '/userApi/' + this.userId
            this.$Ajax.get(url, params).then(data => {
                that.depName = data.depName
            })
        },
        initChart() {
            let that = this
            let params = {
                id: that.bkID,
                token: that.token
            }
            this.$Ajax.get('flow/processDrawing',params).then( res=>{
                console.log('流程图', res);
                that.chartData = res.data.results
                that.isData = true
                
            }).catch(err=>{
                console.log(err)
            });
        },
        //  查看流程
        checkProcess() {
            this.processIsShow = !this.processIsShow;
        },

        // 提交
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sub();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //  提交
        sub(){
            let that = this
            const postData = {
                id: this.bkID,
                taskId: this.taskId,
                createBy: this.createBy,
                opinionInfo: {
                    // evaluate: "5",
                    userList: this.userList,
                    depName: this.depName,
                    createName: this.createName,
                    suggest: this.instructForm.opinion
                }
            }

            this.$Ajax.post('fightcmd/cmdConfirmEvaluate', postData, true).then(res=>{
                console.log(res);
                if (res.data === 'success') {
                    that.$message({
                        message: '确认成功！',
                        type: "success"
                    });
                    that.$router.push({
                        name: 'fightManage'
                    })
                } else {
                    that.$message({
                        message: '确认失败！',
                        type: "warning"
                    });
                }
            }).catch(err=>{
                console.log(err)
            });
        }
    }
}
</script>

<style scoped lang="less">
    @import '../../../static/css/CheckIns.less';

    .big-box{
        padding-bottom: 10px;
    }
    .success-result{
        color: #207245;
    }

    //  饿了么table样式修改
    /deep/.element-table{
        width: 1270px;
        margin: 0 auto;
        /deep/tr{
            @{bg}: #f7faff;
        }
        /deep/th{
            @{bg}:#eef4f9;
            .border-top(1px,#d7dde5);
            .border-bottom(1px,#d7dde5);
        }
        /deep/th:nth-child(1){
            .border-left(1px,#d7dde5);
        }
        /deep/th:nth-last-child(2){
            .border-right(1px,#d7dde5);
        }
        .change-delete-style{
            border: 0;
            padding: 6px;
            @{bg}:transparent;
        }
        .el-input__inner{
            height: 28px;
            @{lh}:28px;
        }
        /deep/button{
            padding: 7px 25px;
        }
        /deep/.el-input__icon{
            @{lh}:28px;
        }
    }
    /deep/.border-table{
        /deep/td:nth-child(1){
            .border-left(1px,#d7dde5);
        }
        /deep/td:nth-last-child(1){
            .border-right(1px,#d7dde5);
        }
    }

    .second-title{
        margin-bottom: 10px;
        padding-left: 18px;
        @{fs}:14px;
        @{fw}:bold;
        color: #6b757e;
    }
    /deep/.padding-table{
        /deep/td:nth-child(1) .cell{
            padding-left: 0;
        }
    }

    .arrest-report{
        padding-left: 18px;
        @{fs}:14px;
        /deep/.el-upload-list:after{
            content: "";
            display: block;
            clear:both;
            visibility:hidden;
            height:0;
        }
        /deep/.el-upload-list__item{
            width: 320px;
            float: left;
            margin-top: 10px !important;
        }
        a {
            color: #0077d4;
            border-bottom: 1px solid #7ca3df;
            cursor: pointer;
        }
    }
</style>

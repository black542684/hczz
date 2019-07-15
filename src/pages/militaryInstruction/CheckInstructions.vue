<template>
    <div class="big-box">
        <div class="header-container">
            <el-row :gutter="20" class="el-row-style">
                <el-col :span="6" class="el-col-style">
                    <div class="grid-content">
                        <span class="header-title">研判指令审核</span>
                        <a class="header-back" href="javascript:;" @click="$router.go(-1)">返回</a>
                    </div>
                </el-col>
                <el-col :span="8" :offset="10">
                    <div class="grid-content">
                        <el-row class="el-row-right">
                            <!-- <router-link tag="span" to='fightManage' style="display:inline-block;margin-right:10px;"  v-if="!isBack & isOnlyRead"> -->
                                <el-button type="primary" size="small" v-show="!isBack & isOnlyRead & btnShowFlag" @click="subToDZ('instructForm')">提交</el-button>
                            <!-- </router-link> -->
                            <!-- <router-link tag="span" to='fightManage' style="display:inline-block;" v-if="isBack & isOnlyRead"> -->
                                <el-button type="warning" size="small" v-show="isBack & isOnlyRead & btnShowFlag" @click="subToDZ('instructForm')">退回给申请人</el-button>
                            <!-- </router-link> -->
                            <el-button size="small" @click="checkProcess">查看流程</el-button>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            
            <instructions :instructForm='instructForm'/>

            <el-form 
                :inline="true" 
                :model="instructForm"
                :rules="instructRules"
                ref="instructForm" 
                class="instruct-form form-style"
                label-width="100px">

                <div class="form-item" v-if="isOnlyRead & btnShowFlag">
                    <div class="form-title">提交信息</div>
                    <el-form-item label="审核人：" prop="superiorAuditor">
                        <div>{{instructForm.superiorAuditor}}</div>
                    </el-form-item>
                    <el-form-item label="审核结果：" prop="auditorResult">
                        <el-radio-group v-model="instructForm.auditorResult">
                            <el-radio label="通过" value="通过" @change="resultRadio"></el-radio>
                            <el-radio label="退回" value="退回" @change="resultRadio"></el-radio>
                        </el-radio-group>    
                    </el-form-item>
                    <!-- 占位 -->
                    <el-form-item></el-form-item>

                    <el-form-item label="审核意见：" prop="applyInstructions" class="brief-case-content">
                        <el-input type="textarea" :rows="4" placeholder="请输入审核意见" v-model="instructForm.applyInstructions"></el-input>
                    </el-form-item>
                </div>

                <div class="form-btn-item" v-if="isOnlyRead & btnShowFlag">
                    <el-form-item>
                        <!-- <router-link tag="span" to='fightManage' style="display:inline-block;" v-if="!isBack"> -->
                            <el-button type="primary" size="small" v-show="!isBack" @click="subToDZ('instructForm')">提交</el-button>
                        <!-- </router-link> -->
                        <!-- <router-link tag="span" to='fightManage' style="display:inline-block;" v-if="isBack"> -->
                            <el-button type="warning" size="small" v-show="isBack" @click="subToDZ('instructForm')">退回给申请人</el-button>
                        <!-- </router-link> -->
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 流程弹窗 -->
        <div class="process-box" v-show="processIsShow">
            <div class="process-border" id="mountNode">
                <!-- 流程图 -->
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

//  引入通用'指令'组件
import instructions from '../../components/MILInstructions.vue'

// 引入流程图
import flowChart from '../../components/flowChart'

export default {
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
                auditorResult:'通过',
                applyInstructions:''
            },
            instructRules: {
                auditorResult: [
                    { required: true, message: '请选择审核结果', trigger: ["blur"] }                  
                ],
                applyInstructions: [
                    { required: true, message: "请输入审核意见", trigger: ["blur"] },
                    { min: 1, max: 500, message: '请输入1-500个字符', trigger: ["blur"] }
                ]
            },
            bkID:'',
            createBy: '',
            stateIsShow: true,
            isOnlyRead: false, // 按钮显示
            btnShowFlag: false, // 流程控制按钮
            chartData: '', // 流程图数据
            token: '',
            isData: false,
            taskId: '' // 退回id
        }
    },
    created() {
        if (localStorage.getItem('userName')) {
            this.createBy = localStorage.getItem('userName')
        }
        if (localStorage.getItem('realName')) {
            this.instructForm.superiorAuditor = localStorage.getItem('realName')
        }
        if (localStorage.getItem('token')) {
            this.token = localStorage.getItem('token')
        }
        if (this.$route.query.statusType) {
            if (this.$route.query.statusType === '1' || this.$route.query.statusType === '2') {
                this.isOnlyRead = false
            } else {
                this.isOnlyRead = true
            }
        }
        this.taskId = this.$route.query.taskId
    },
    mounted(){
        // const aLength = window.location.href.split('=')[1].length-5;
        // this.bkID = window.location.href.split('=')[1].slice(0,aLength); //..获取当前路径下的布控ID
        // this.stateIsShow = window.location.href.split('=')[2];
        console.log(window.location.href.split('='))
        this.bkID = this.$route.query.id
        this.initChart()
        //  获取数据
        this.$Ajax.get('fightcmd/cmdDetails',{id:this.bkID,createBy:this.createBy}, true).then(res=>{
            console.log(res.data.cmdDetails);
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
            this.instructForm.attachments = res.data.cmdDetails.attachments
            for(var i=0;i<res.data.cmdDetails.attachments.length;i++){
                this.instructForm.fileList.push(res.data.cmdDetails.attachments[i].fileName);
            }

            //  指定侦办
            this.instructForm.mainSpyUnit = res.data.cmdDetails.mainSpyDepName;
            this.instructForm.cooperateSpyUnit = res.data.cmdDetails.coSpyDepName;
            this.instructForm.spyRequire = res.data.cmdDetails.spyRequire;
            this.instructForm.applyDesc = res.data.cmdDetails.applyDesc;

            // 流程按钮
            if (res.data.btn.length > 0) {
                res.data.btn.forEach(item => {
                    if (item.taskDefKey === this.$route.query.deptType) {
                        this.btnShowFlag = true;
                    }
                });
            }

        });
    },
    methods: {
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
        resultRadio(e){
            console.log(e);
            e == '退回' ? this.isBack = true : this.isBack = false ;
        },
        // 提交
        subToDZ(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sub();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        sub() {
            //  获取数据
            let that = this
            const postData = {
                id: this.bkID,
                createBy: this.createBy,
                statusId: that.$route.query.deptType, // 退回参数
                taskId: that.taskId,
                opinionInfo: {
                    createName: this.instructForm.superiorAuditor,
                    result: this.instructForm.auditorResult,
                    suggest: this.instructForm.applyInstructions
                }
            }
            console.log(postData)
            let successMsg = '提交成功！'
            let failMsg = '提交失败！'
            if (this.isBack) {
                let successMsg = '退回成功！'
                let failMsg = '退回失败！'
            }
            this.$Ajax.post('fightcmd/cmdReview',postData, true).then(res=>{
                console.log(res);
                if (res.data === 'success') {
                    that.$message({
                        message: successMsg,
                        type: 'success'
                    });
                    that.$router.push({
                        name: 'fightManage'
                    })
                } else {
                    that.$message({
                        message: failMsg,
                        type: 'warning'
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
</style>

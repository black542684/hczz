<!-- 案源管理流程页面 -->
<template>
  <div class="xsxc-content">
    <!-- 流程弹窗 -->
    <div class="process-box" v-show="processIsShow">
        <div class="process-border" id="mountNode">
            <flow-chart :chartData='chartData' :processIsShow='isData'></flow-chart>
        </div>
    </div> 
    <el-row :gutter="20" class="el-row-style">
        <el-col :span="6" class="el-col-style">
            <div class="grid-content">
                <span class="xsxc-title">{{changeTitle}}</span>
                <a class="xsxc-back" href="javascript:;" @click="$router.go(-1)">返回</a>
            </div>
        </el-col>
        <el-col :span="8" :offset="10">
            <div class="grid-content">
                <el-row class="el-row-right">
                    <el-button type="primary" size="small" @click="checkProcess" v-if="this.$route.query.isSQ != 1 && this.$route.query.statusStr !== '草稿'">查看流程</el-button>
                </el-row>
            </div>
        </el-col>
    </el-row>

    <!-- 历史审核流转信息（只显示退回内容） - 组件 -->
    <shInfo :approveList='approveListTH'/>

    
    <!-- 申请 基本信息 组件 -->
    <!-- 1.能否编辑; 2.表单数据; 3.title名称列表; 4.设置DOM名称用于表单验证; -->
    <sqComp 
    :sqIsRead='sqIsRead'    
    :ayData='ayData'
    :titleList01='titleList01'
    ref="sqCom"/>

    <!-- 申请 案源信息 组件 -->
    <!-- 1.能否编辑; 2.表单数据; 3.上传文件; 4.文件上传方法; 5.文件删除方法; 6.title名称列表; 7.设置DOM名称用于表单验证; -->
    <sqComp2 
    :sqIsRead='sqIsRead'    
    :ayData='ayData' 
    :originFileList='originFileList' 
    :uploadFiles='uploadFiles'
    :deleleFile='deleleFile' 
    :titleList02='titleList02'
    ref="sqCom2"/>

    <el-form
    :inline="true"
    :model="ayData"
    :rules="ayRules"
    ref="sqComLocal">
        <div class="xsxc-form-item" :class="{'xsxc-xcxx-only-read':sqIsRead}">
            <div class="xsxc-form-title">提交审核</div>
            <el-form-item label="提请需求：" prop="tqxq" class="xsxc-width100">
                <el-input
                    type="textarea"
                    v-model="ayData.tqxq"
                    autosize
                    :readonly="sqIsRead"
                ></el-input>
            </el-form-item>
        </div>
    </el-form>

    <!-- 历史审核流转信息 - 组件 -->
    <shInfo :approveList='approveList'/>

    <!-- 当前审核人及审核意见 -->
    <shyjInfo :shData='shData' :newTaskId='newTaskId' v-if='sjypyspBtn'/>

    <!-- 申请按钮 -->
    <div class="xsxc-btn-box" v-if="sqBtn">
        <el-button type="primary" size="mini" @click="submitCG(procInstId?null:0)">保存草稿</el-button>
        <el-button type="primary" size="mini" @click="submitFormSP('ayForm', 1)">提交审批</el-button>
    </div>

    <!-- 确认按钮 -->
    <div class="xsxc-btn-box" v-if='qrBtn'>
        <el-button type="primary" size="mini" @click="qrSubmit">确认</el-button>
    </div>

    <!-- 签收结果 -->
    <qsInfo :qsjgList='qsjgList'/>
  </div>
</template>

<script>
import flowChart from '../../components/flowChart'              // 引入流程图
import sqComp from '../../components/caseSource/sqComp'              // 引入申请的表单
import sqComp2 from '../../components/caseSource/sqComp2'              // 引入申请2的表单
import shInfo from '../../components/caseSource/shInfo'         //  引入审核流转历史信息组件
import shyjInfo from '../../components/caseSource/shyjInfo'     //  引入审核意见组件
import qsInfo from '../../components/caseSource/qsInfo'         //  签收结果信息组件

export default {
    components:{
        flowChart,  //流程图
        sqComp,     //申请表单
        sqComp2,     //申请表单2
        shInfo,     //审核信息
        shyjInfo,   //审核意见
        qsInfo,     //签收结果
    },
    data() {
        return{
            changeTitle:'案源申请',     //..title

            processIsShow:false,        //  流程弹框显示与否
            chartData: '', // 流程图数据
            isData: false,  //  控制流程图只渲染一次

            //    申请提交需要上传的数据（从管理页面拿到的数据）
            bkID:'',
            createBy:'',
            token:'',
            userId:'',
            taskId:'',
            procInstId:'',
            statusId:'',
            depId:'',
            roleId:'',

            newTaskId:'',


            approveList:[],     //  保存流转历史数据
            approveListTH:[],
            qsjgList:[],    //  签收结果数据


            sqIsRead:false,      //  申请模块是否只读
            

            /** 按钮方面数据 */
            sqBtn:true,
            
            shxxEditIsShow:false,   //  审核编辑框显示与否
            sjypyspBtn:false,   //  审核按钮显示与否
            qrBtn:false,        //  确认btn是否显示

            
            //  案源审核数据
            shData:{
                shr:'',
                shjg:'通过',
                shyj:'',

                shyjLabel:'审核意见：',     //..切换通过/退回状态使用
                sqr:'',         //..保存单据申请人，审核步骤下，提交审核结果需要用到
                
            },
            originFileList: [],   //  申请上传附件列表
            
            
            //    案源数据
            ayData:{
                //    基本信息
                aymc:'',
                aybh:new Date().getTime(),
                xfsj:'',
                sqdw:'',
                sqr:'',

                //  案源信息
                ajbh:'',
                ajmc:'',
                zasd:'',
                ajsl:'',
                ypry:'',
                ajlb:'',
                jyaq:'',
                cbyj:[],
                xstz:'',
                attachments: [],
                originFile:'',// 判定附件是否上传的数据

                //  
                cxdw:'',
                tqxq:'',

                fileList:[],//保存回显的数据列表
                userList:'',    //  用户列表（下级审批人）
            },
            //  title名称动态数据 - 基本信息
            titleList01:{
                formName:'基本信息',

                name:'案源名称：',
                number:'案源编号：',
                time:'下发时间：',
                unit:'申请单位：',
                person:'申请人：'
            },
            //  title名称动态数据 - 案源信息
            titleList02:{
                formName:'案源信息',
                
                number:'案件编号：',
                name:'案件名称：'
            },

            ayRules:{
                tqxq: [
                    { required: true, message: "请输入提请需求", trigger: ["blur"] },
                    { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
                ]
            },
        }
    },
    
    created(){
        this.bkID = this.$route.query.id;
        // this.taskId = this.$route.query.taskId;
        this.procInstId = this.$route.query.procInstId;
        this.statusId = this.$route.query.statusId;

        if (localStorage.getItem("userName")) {
        this.createBy = localStorage.getItem("userName");
        }
        if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token");
        }
        if (localStorage.getItem("userId")) {
        this.userId = localStorage.getItem("userId");
        }
        if (localStorage.getItem("realName")) {     //..申请人
        this.ayData.sqr = localStorage.getItem("realName");
        }

        this.getUserList(); //  获取userList和申请单位

        //  如果在管理页点击的不是申请按钮，才会调用详情数据
        if(this.$route.query.isSQ!=1){
            //  调用详情数据
            this.getDetails();
        }
    },
    mounted() {
        //    获取当前时间，赋值给申请时间
        this.ayData.xfsj = this.getTime();

        //  如果在管理页点击的不是申请按钮，且不是草稿页面，才会调用流程图数据
        if(this.$route.query.isSQ!=1 && this.$route.query.statusStr !== '草稿'){
            //  加载流程图数据
            this.initChart();
        }
        
        
    },
    watch: {
        // 判断附件数量是否为0
        originFileList(nv) {
            nv.length === 0? this.ayData.originFile = "":this.ayData.originFile = "案源信息附件已上传"
        }
    },
    methods: {
        getFormPromise(form) {
            return new Promise(resolve => {
                form.validate(res => {
                    resolve(res);
                })
            })
        },
        //  申请页面 - 提交审批
        submitFormSP(formName, num) {
            //  获取子组件的ref DOM名称
            // const ayFormName = this.$refs.sqCom.$refs.ayForm;
            // ayFormName.validate(valid => {
            //     if (valid) {
            //     console.log("申请提交成功");
            //         this.submitCG(num);
            //     } else {
            //     console.log("error submit!!");
            //     return false;
            //     }
            // });


            //  获取子组件的ref DOM名称
            const ayFormName = this.$refs.sqCom.$refs.ayForm;
            const ayFormName2 = this.$refs.sqCom2.$refs.ayForm;
            const ayFormNameLocal = this.$refs.sqComLocal;

            Promise.all([ayFormName, ayFormName2, ayFormNameLocal].map(this.getFormPromise)).then(res => {
                const validateResult = res.every(item => !!item);
                if (validateResult) {
                    console.log("申请提交成功");
                    this.submitCG(num);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            })
        },
        //  申请页面 - 保存草稿
        submitCG(num) {
            const applyData = {
                id: this.bkID,
                createBy: this.createBy,

                csCode: this.ayData.aybh,
                csName: this.ayData.aymc,
                createName: this.ayData.sqr,
                createDepId: null, //申请单位id
                createDepName: this.ayData.sqdw,
                createTime: this.ayData.xfsj,
                caseSourceCode: this.ayData.ajbh,
                isSeriesed: 0,    //是否系列案
                caseSourceName: this.ayData.ajmc,     
                caseTypeCode: null, //  案件类型编码
                caseTypeName: this.ayData.ajlb,
                caseAmount: this.ayData.ajsl,
                judgmentBy: null,   //  研判人员id
                judgmentName: this.ayData.ypry,
                caseInfo: this.ayData.jyaq,
                techEvide: this.ayData.cbyj.join(','),
                meansOfCrime: this.ayData.zasd,
                clueFeature: this.ayData.xstz,
                reviewBy: null,     //  上级审核人id
                reviewName: null,   //  上级审核人姓名
                applyDesc: this.ayData.tqxq,
                csStatus: num,     //  案源状态   null保存  1提交
                excute: null,
                opinionInfo: {
                    userList: this.ayData.userList,
                    createBy:this.createBy
                },
                attachments: this.ayData.attachments,

                taskId:this.newTaskId,
            }
            if(this.taskId){
                applyData.taskId = this.taskId;
            }
            console.log(applyData);

            let successMsg = "提交成功！";
            let failMsg = "提交失败！";
            if (num == 0) {
                successMsg = "保存草稿成功！";
                failMsg = "保存草稿失败！";
            }
            this.$Ajax.post('casesource/csApply', applyData, true).then(res => {
                console.log(res);
                if (res.data === "success") {
                    this.$message({
                        message: successMsg,
                        type: "success"
                    });
                    this.$router.push({
                        name: "caseSourceManage"
                    });
                } else {
                    this.$message({
                        message: failMsg,
                        type: "warning"
                    });
                }
            }); 
        },
        //  获取userList
        getUserList(){
            /* 申请单位 */
            let url01 = "/userApi/" + this.userId;
            this.$Ajax.get(url01,{token: this.token},true).then(res => {
                // console.log('单位',res)
                this.ayData.sqdw = res.depName;     //  获取申请单位
                this.depId = res.depId;

                let url02 = '/orgApi/getParentDeps/'+res.depId;
                this.$Ajax.get(url02,{token: this.token},true).then(res => {
                    // console.log('单位2',res)
                    let orgId = res[0].id;
                    
                    this.$Ajax.get('/casesource/getTaskRole/',{statusId: this.statusId},true).then(res => {
                        // console.log('单位3',res)
                        this.roleId = res[0];

                        this.$Ajax.get('/userApi/getUsersByOrgIdAndRoleId/',{orgId: orgId,roleId:this.roleId},true).then(res => {
                            // console.log('单位4',res)
                            this.ayData.userList = res.join(',');
                        });
                    });
                });
            });
            /* 申请单位 */
        },
        //  获取当前时间
        getTime(){
            const year = new Date().getFullYear();
            let month = new Date().getMonth()+1;
            month = this.rewriteNowTime(month);
            let date = new Date().getDate();
            date = this.rewriteNowTime(date);
            let hour = new Date().getHours();
            hour = this.rewriteNowTime(hour);
            let minute = new Date().getMinutes();
            minute = this.rewriteNowTime(minute);
            let second = new Date().getSeconds();
            second = this.rewriteNowTime(second);
            const nowTime =
            year +
            "-" +
            month +
            "-" +
            date +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second;
            return nowTime;
        },
        //  重写时间为双数
        rewriteNowTime(time){
            if(time<10){
                return "0"+time;
            }else{
                return time;
            }
        },
        //  加载流程图数据
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
        //  获取详情数据
        getDetails() {
            let statusType = this.$route.query.statusType;
            
            console.log({ id: this.bkID, createBy: this.createBy, procInstId: this.procInstId,statusType:statusType })
            // { id: 'c6225d1e-02cd-4034-8f69-655b07e7adc1', createBy: 'jiandan' }
            this.$Ajax.get("casesource/csDetails",{id: this.bkID,createBy: this.createBy,procInstId: this.procInstId,statusType:statusType},true).then(res => {
                if(res.data.details){
                    //  审核数据
                    this.shData.shr = localStorage.getItem("realName");
                    this.shData.sqr = res.data.details.createBy;
                    

                    //  申请数据
                    this.ayData.aymc = res.data.details.csName;
                    this.ayData.aybh = res.data.details.csCode;
                    this.ayData.xfsj = res.data.details.createTime;
                    this.ayData.sqdw = res.data.details.createDepName;
                    this.ayData.sqr = res.data.details.createName;

                    this.ayData.ajbh = res.data.details.caseSourceCode;
                    this.ayData.ajmc = res.data.details.caseSourceName;
                    this.ayData.zasd = res.data.details.meansOfCrime;
                    this.ayData.ajsl = res.data.details.caseAmount;
                    this.ayData.ypry = res.data.details.judgmentName;
                    this.ayData.ajlb = res.data.details.caseTypeName;
                    this.ayData.jyaq = res.data.details.caseInfo;
                    this.ayData.cbyj = res.data.details.techEvide;
                    this.ayData.xstz = res.data.details.clueFeature;

                    //  附件
                    for(var i=0;i<res.data.details.attachments.length;i++){
                        this.ayData.fileList.push(res.data.details.attachments[i]);
                    }
                    //  数组去重
                    function uniq(array){
                        var temp = []; 
                        var _arr = [];
                        for(var i = 0; i < array.length; i++){
                            if(temp.indexOf(array[i].fileName) == -1){
                                temp.push(array[i].fileName);
                                _arr.push(array[i])
                            }
                        }
                        return _arr;
                    }
                    this.ayData.fileList = uniq(this.ayData.fileList);

                    // this.ayData.cxdw: "石家庄市桥西分局第四刑侦大队", //查询单位
                    this.ayData.tqxq = res.data.details.applyDesc;
                    this.ayData.auditor = res.data.details.reviewName;
                }
                if(res.data.activitiInfoList==null || res.data.details==null){
                    //  activitiInfoList为空，案源申请页面
                    this.sqIsRead = false;
                    this.yySuccess1 = false;
                    this.yySuccess2 = false;
                    this.ayRules = this.ayRules;
                }else if(res.data.activitiInfoList){
                    this.sqIsRead = true;
                    this.yySuccess1 = true;
                    this.yySuccess2 = true;
                    this.ayRules = {};

                    
                }
                console.log(res);
                console.log(res.data.activitiInfoList.data);

                // const approveListSave = [];
                res.data.activitiInfoList.data.forEach(item => {
                    if ((item.endTime !== null) & (item.hParam.result !== undefined) & (item.hParam.result !== '退回')){
                        this.approveList.push(item.hParam);
                    }
                    // if(item.hParam.result==='退回' && this.createBy===res.data.details.createBy){
                    //     //这里控制退回信息显示状态（如果退回要展示在最上面）
                    //     approveListSave.push(item)
                    // }


                    //  获取签收结果数据
                    if(item.hParam.date && item.hParam.depName){
                        this.qsjgList.push(item);
                    }
                });
                // //  取最后一条记录
                // if(statusType === '0' && this.$route.query.statusStr === '发起协查申请'){   //..待办而且是重新申请的状态
                //     this.approveListTH.push( approveListSave.pop() );
                // }

                //  获取退回结果数据
                res.data.taskList.forEach(item=>{
                    res.data.activitiInfoList.data.forEach(list=>{
                        if(item.taskId===list.id && list.hParam.result==='退回'){
                            this.approveListTH.push(list.hParam)
                        }
                    })
                });
                
                

                console.log('deptType',statusType);
                //  控制按钮显示

                //  只有待办才显示
                //  获取当前页面状态   0待办；1发起；2已办
                if (statusType) {
                    if (statusType === '1' && this.$route.query.statusStr === '草稿'){        //..发起状态，申请按钮显示
                        this.sqBtn = true;          //  显示申请按钮
                        this.originFileList = this.ayData.fileList;     //  已经上传的文件渲染出来,展示名称
                        this.ayData.attachments = res.data.details.attachments;     //  已经上传的文件保存给后台

                        this.sqIsRead = false;      //  切换为编辑状态
                        this.yySuccess1 = false;
                        this.yySuccess2 = false;
                        this.ayRules = this.ayRules;

                        this.ayData.ajsl = this.ayData.ajsl ? this.ayData.ajsl.toString() : '';             //  案件数量
                        this.ayData.cbyj = res.data.details.techEvide.length>0 ? res.data.details.techEvide.split(',') : [];   //..串并依据
                    }else{
                        this.sqBtn = false;

                        this.sqIsRead = true;
                        this.yySuccess1 = true;
                        this.yySuccess2 = true;
                        this.ayRules = {};
                    }

                    if (statusType === '1' || statusType === '2') {
                        //  只读状态，且按钮隐藏
                        // this.shxxEditIsShow = false;
                        // this.sjypyspBtn = false;
                        this.changeTitle = '案源详情';
                        if(this.$route.query.statusStr === '草稿'){
                            this.changeTitle = '案源申请';
                        }
                    } else {
                        //  编辑状态，且按钮显示(待办)
                        if (res.data.taskList[0].formProps.length > 0){
                            this.newTaskId = res.data.taskList[0].taskId,
                            res.data.taskList[0].formProps.forEach(item => {
                                if(item==='review_info'){           //  审核编辑框显示与否
                                    this.shxxEditIsShow = true;
                                    this.changeTitle = '案源审核';
                                }
                                if(item==='submit_review_btn'){     //  审核按钮显示与否
                                    this.sjypyspBtn = true;
                                }
                                if(item==='confirm_btn'){     //  确认按钮是否显示
                                    this.qrBtn = true;
                                    this.changeTitle = '案源确认';
                                }
                                //  被退回之后
                                if(item==='apply_submit_btn'){    
                                    this.changeTitle = '案源申请'; 
                                    //申请按钮出现，而且是编辑状态
                                    this.ayData.ajsl = this.ayData.ajsl.toString();             //  案件数量
                                    this.ayData.cbyj = res.data.details.techEvide.split(',');   //..串并依据
                                    this.originFileList = this.ayData.fileList;     //  已经上传的文件渲染出来,展示名称
                                    this.ayData.attachments = res.data.details.attachments;     //  已经上传的文件保存给后台
                                    this.sqIsRead = false;      //  切换为编辑状态
                                    this.sqBtn = true;          //  显示申请按钮
                                }
                            })
                        }
                    }
                }
            });
        },
        //  文件上传
        uploadFiles(e) {
            let fileList = e.currentTarget.files;
            let that = this;
            let formData = new FormData();
            if (fileList.length === 1) {
                formData.append("files", fileList[0]);
            } else if (fileList.length > 1) {
                for (var i = 0; i < fileList.length; i++) {
                formData.append("files", fileList[i]);
                }
            }
            if (fileList !== "") {
                this.ayData.originFile = "案源信息附件已上传";
            }
                this.$Ajax.form("upload/batch?classify=9", formData).then(data => {
                    console.log("案源信息附件上传", data);
                    if (data.data.length > 0) {
                        data.data.forEach(item => {
                            //item.classify = "9";
                            that.ayData.attachments.push(item);
                            that.originFileList.push(item);
                        });
                    }
                    //  数组去重
                    function uniq(array){
                        var temp = []; 
                        var _arr = [];
                        for(var i = 0; i < array.length; i++){
                            if(temp.indexOf(array[i].fileName) == -1){
                                temp.push(array[i].fileName);
                                _arr.push(array[i])
                            }
                        }
                        return _arr;
                    }
                    that.originFileList = uniq(that.originFileList);
                });
        },
        //  文件删除
        deleleFile(item) {
            console.log(item);
            let that = this;
            let params = {
                id: item.id
            };
            this.$confirm("此操作将删除附件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                this.$Ajax
                    .post("fightcmd/delAttachments", params, true)
                    .then(data => {
                    console.log("案源信息附件删除", data);
                    });
                let path = "";
                // if (!item.fileSavePath) {
                //     path = "";
                // } else {
                //     path = item.fileSavePath;
                // }
                let url =
                    "upload/deleteFile?id=" +
                    item.id +
                    "&fileName=" +
                    item.fileName +
                    "&path=" +
                    path;
                console.log('url',url)
                this.$Ajax.post(url, {}, true).then(data => {
                    if (data.data === "删除成功") {
                    that.originFileList.forEach((ele, index) => {
                        console.log('index',index,'data',that.originFileList)
                        if (ele.id === item.id) {
                        that.originFileList.splice(index, 1);
                        }
                    });
                    that.ayData.attachments.forEach((ele, index) => {
                        if (ele.id === item.id) {
                        that.ayData.attachments.splice(index, 1);
                        }
                    });
                    that.$refs.uploadFiles.value = "";    //..上传input的value置空
                    that.$message({
                        message: "附件删除成功",
                        type: "success"
                    });
                    } else {
                    that.$message({
                        message: "附件删除失败",
                        type: "warning"
                    });
                    }
                });
                })
                .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
                });
        },
        //  发起人确认页面 - 确认按钮
        qrSubmit(){
            let qrData = {
                createBy: this.shData.sqr,
                id: this.bkID,
                statusId:this.statusId,
                taskId:this.newTaskId,
                opinionInfo: {
                    depName:this.ayData.sqdw,
                    createName:this.ayData.sqr,
                    date:this.getTime()
                }
            }
            console.log(qrData);
            this.$Ajax.post('casesource/csConfirm', qrData, true).then(res => {
                this.$message({
                    type: 'success',
                    message: '确认成功!'
                });
                this.$router.push({
                    name: 'caseSourceManage'
                });
            }); 
        },
    }
}
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
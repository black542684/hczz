<template>
    <div class="big-box">
        <div class="header-container">
            <div class="Breadcrumb">
                <span @click="bkbz">布控比中</span>
                <span>布控编辑</span>
            </div>

            <el-row :gutter="20" class="el-row-style">
                <el-col :span="6" class="el-col-style">
                    <div class="grid-content">
                        <span class="header-title">布控编辑</span><a class="header-back" href="javascript:;">返回</a>
                    </div>
                </el-col>
            </el-row>
            
            <el-form 
                :inline="true" 
                :model="warningForm" 
                :rules="warningRules" 
                ref="warningForm" 
                class="new-warning-form form-style"
                label-width="100px">
                <div class="form-item">
                    <div class="form-title" style="margin-bottom: 20px;">布控对象配置</div>

                    <self-table ref="selfTable" v-for="(item,index) in formInline" :key='index' :formInline='formInline[index]'>
                        <template slot="deleteIcon">
                            <i class="el-icon-delete" @click="deleteRow(index)"></i>
                        </template>
                    </self-table>
                    
                    <el-button size="small" @click="addTableRow" style="margin: 10px 0px 20px 110px;">添加</el-button>
                </div>

                <div class="form-item">
                    <div class="form-title">布控信息</div>
                    <el-form-item label="布控时间：" prop="time" class="date-picker-style">
                         <el-date-picker type="date" placeholder="选择日期" v-model="warningForm.time" value-format="yyyy-MM-dd"></el-date-picker>
                         <el-date-picker type="date" placeholder="选择日期" v-model="warningForm.time2" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    
                    <!-- <el-form-item label="布控区划：" prop="type" class="select-style02">
                        <el-select v-model="warningForm.type" placeholder="请选择预警类型">
                            <el-option label="类型一" value="type1"></el-option>
                            <el-option label="类型二" value="type2"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="案件编号：" prop="name">
                        <el-input placeholder="请输入案件编号" v-model="warningForm.name" class="form-ipt-style" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="布控原因：" prop="briefCase" class="brief-case-content02">
                        <el-input type="textarea" :rows="4" placeholder="请输入布控原因" v-model="warningForm.briefCase"></el-input>
                    </el-form-item>


                </div>
                
                <div class="form-btn-item">
                    <el-form-item>
                        <router-link tag="span" to=''>
                            <el-button type="primary" size="small" @click="saveData">保存</el-button>
                        </router-link>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import selfTable from '../../components/table'

export default {
    components:{
        selfTable
    },
    data () {
        return {
            warningForm: {             //  表单内容
                //  预警信息内容             
                name:'',
                type:'',
                time:'',
                time2:'',
                area:'',
                briefCase:''
            },
            warningRules: {                //  指令信息检查规则
                time: [
                    { required: true, message: '请选择布控起止时间', trigger: 'blur' }
                ],
            },

            formInline:[
                // {
                //     obj: '',
                //     ID: '',
                //     name:'',
                //     carNum:'',
                //     type:'',
                //     chNum:'',
                //     macNum:'',

                //     peopleIsShow:false,
                //     carsIsShow:false,
                //     itemsIsShow:false,
                //     chIsShow:false,
                //     macIsShow:false,
                // }
            ],
            bkID:'',
            status:0,
        }
    },
    mounted(){
        this.bkID = window.location.href.split('=')[1]; //..获取当前路径下的布控ID
        // console.log(window.location.href);
        // console.log('http://192.168.181.109:9090/hczz/portal/hczz#/editMonitor?id=1fc9d010-f25f-4cf6-a33d-dd582977361b'.split('=')[1])
        this.$Ajax.postParams('bkController/getBkInfoByBkId', {id:this.bkID}, true).then(res=>{
            console.log(res)
            this.status = res.data.bk.status;
            if(res.data.ryList.length != 0){                    //  人员
                for(var i=0;i<res.data.ryList.length;i++){
                    const ryObj = {};
                    ryObj.obj = '人员';
                    ryObj.ID = res.data.ryList[i].sfz;
                    ryObj.name = res.data.ryList[i].xm;
                    ryObj.peopleIsShow = true;
                
                    this.formInline.push(ryObj)
                }
            }

            if(res.data.clList.length != 0){                    //  车辆
                for(var i=0;i<res.data.clList.length;i++){
                    const clObj = {};
                    clObj.obj = '车辆';
                    clObj.carNum = res.data.clList[i].cph;
                    clObj.carsIsShow = true;
                
                    this.formInline.push(clObj)
                }
            }

            if(res.data.wpList.length != 0){                    //  物品
                for(var i=0;i<res.data.wpList.length;i++){
                    const wpObj = {};
                    wpObj.obj = '物品';
                    if(res.data.wpList[i].type == 1){       //  手机
                        wpObj.chNum = res.data.wpList[i].sbh;
                        wpObj.chIsShow = true;
                    }else if(res.data.wpList[i].type == 2){       //  MAC
                        wpObj.macNum = res.data.wpList[i].sbh;
                        wpObj.macIsShow = true;
                    }
                
                    this.formInline.push(wpObj)
                }
            }

            this.warningForm.name = res.data.bk.caseNo
            this.warningForm.time = res.data.bk.startTime
            this.warningForm.time2 = res.data.bk.endTime
            this.warningForm.briefCase = res.data.bk.reason
            // console.log(this.formInline)
        }).catch( (error)=>{
            console.error(error)
        } );
    },
    methods:{
        bkbz(){
            window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/9daaab6b0c75467096deaf9336e70209.html`;
        },
        //  添加行
        addTableRow(){
            const data = {
                obj: '',
                ID: '',
                name:'',
                carNum:'',
                type:'',
                chNum:'',
                macNum:'',

                peopleIsShow:false,
                carsIsShow:false,
                itemsIsShow:false,
                chIsShow:false,
                macIsShow:false,
            }
            this.formInline.push(data);
        },
        //  保存按钮获取子组件数据
        saveData(){
            // console.log(this.formInline)
            const monitorArr = [];
            for(var i=0;i<this.formInline.length;i++){
                const monitor = {};
                if(this.formInline[i].obj == '车辆'){
                    //  车
                    monitor.targetType = 0;        
                    monitor.cph = this.formInline[i].carNum;
                }else if(this.formInline[i].obj == '人员'){
                    //  人
                    monitor.targetType = 1;
                    monitor.xm = this.formInline[i].name;
                    monitor.sfz = this.formInline[i].ID;
                }else if(this.formInline[i].obj == '物品'){
                    //  物
                    monitor.targetType = 2;
                    if(this.formInline[i].chIsShow){
                        //  手机
                        monitor.type = 1;
                        monitor.sbh = this.formInline[i].chNum;
                    }else if(this.formInline[i].macIsShow){
                        //  MAC
                        monitor.type = 2;
                        monitor.sbh = this.formInline[i].macNum;
                    }
                }

                if(this.formInline[i].obj == 0){
                    //  车
                    monitor.targetType = 0;        
                    monitor.cph = this.formInline[i].carNum;
                }else if(this.formInline[i].obj == 1){
                    //  人
                    monitor.targetType = 1;
                    monitor.xm = this.formInline[i].name;
                    monitor.sfz = this.formInline[i].ID;
                }else if(this.formInline[i].obj == 2){
                    //  物
                    monitor.targetType = 2;
                    if(this.formInline[i].type == 1){
                        //  手机
                        monitor.type = 1;
                        monitor.sbh = this.formInline[i].chNum;
                    }else if(this.formInline[i].type == 2){
                        //  MAC
                        monitor.type = 2;
                        monitor.sbh = this.formInline[i].macNum;
                    }
                }
                
                monitorArr.push(monitor);
            }
            console.log(monitorArr);
            const monitorObj = {
                bkId: this.bkID,
                status:this.status,
                caseNo :this.warningForm.name,
                endTime :this.warningForm.time2,
                targetList :monitorArr,
                reason :this.warningForm.briefCase,
                startTime :this.warningForm.time
            };
            console.log(monitorObj)
            this.$Ajax.post('bkController/updateBkTask',monitorObj, true).then(data=>{
                console.log(data);
                this.$message({
                    message: '布控信息保存成功！',
                    type: 'success'
                });
                window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/9daaab6b0c75467096deaf9336e70209.html`;
            });
        },
        //  删除行
        deleteRow(index){
            this.formInline.splice(index,1);
        }
        
        
    }
}
</script>

<style scoped lang="less">
    @import '../../../static/css/AppIns.less';

    .new-warning-form{
        .el-form-item{

            /deep/.el-form-item__label{
                line-height: 33px;
            }
        }
        .warning-name{
            width: 100%;
            /deep/input{
                width: 1120px;
            }
        }

        //  日期选择器样式
        .date-picker-style{
            width: 576px !important;
            // width: 288px !important;

            /deep/.el-date-editor.el-input{
                height: 28px;
                line-height: 28px;
                // width: 466px !important;
                width: 230px !important;
            }
            /deep/.el-input__icon{
                line-height: 28px;
            }
        }
        //  select样式
        .select-style{
            /deep/.el-input__inner{
                width: 466px !important;
            }
            /deep/.el-input__icon{
                line-height: 28px;
            }
        }
        .select-style02{
            /deep/.el-input__icon{
                line-height: 28px;
            }
        }
        .select-height{
            /deep/.el-input__inner{
                height: 28px;
                line-height: 28px;
            }
            /deep/.el-input__icon{
                line-height: 28px;
            }
        }
        .input-height{
            width: 56px;
            /deep/input{
                height: 28px;
                line-height: 28px;
            }
        }
        
        //  table
        .warning-table{
            /deep/th{
                display: none;
            }

            //  删除图标修改
            .change-delete-style {
                border: 0;
                padding: 6px;
                background: transparent;
            }
        }


        /deep/.star-style{
            margin-bottom: 0px;
            /deep/.el-form-item__label{
                &::before{
                    content: "* ";
                    color:red;
                }
            }
        }
    }

    .el-icon-delete{
        position: absolute;
        right: 40px;top:12px;
    }

    /deep/.el-form-item__label{
        width: 110px !important;
        text-align: right;
    }


    .brief-case-content02{
            width: 100% !important;
            margin-right: 0;
            margin-bottom: 20px;
            height: auto !important;
            /deep/.el-form-item__content{
                width: 1112px;
                height: 96px;
                textarea{
                    resize: none;  
                }
            }
        }



        /deep/.el-date-editor{
            &>input{
                height: 28px;
                line-height: 28px;
            }
        }
        /deep/.el-button--small{
            float: none !important;
        }
</style>

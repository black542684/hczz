<template>
    <div class="big-box">
        <div class="header-container">
            <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumb">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>布控比中</el-breadcrumb-item>
            </el-breadcrumb> -->
            <div class="Breadcrumb">
                <span @click="bkbz">布控比中</span>
                <span>新建布控</span>
            </div>

            <el-row :gutter="20" class="el-row-style">
                <el-col :span="6" class="el-col-style">
                    <div class="grid-content">
                        <span class="header-title">新建布控</span><a class="header-back" href="javascript:;" @click="backClick">返回</a>
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
                        <el-date-picker
                            v-model="warningForm.time"
                            type="date"
                            placeholder="开始日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                        <el-date-picker
                            v-model="warningForm.time2"
                            type="date"
                            placeholder="无限"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
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
                        <el-input type="textarea" :rows="4" placeholder="请输入布控原因(255个字符以内)" maxlength="255" show-word-limit v-model="warningForm.briefCase"></el-input>
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
            pickerOptions: {
                disabledDate: (t) => {
                    let endDateVal = this.warningForm.time2;

                    if (endDateVal) {
                        return t.getTime() > endDateVal;
                    } 
                }
            },

            pickerOptions2: {
                disabledDate: (t) => {
                    let beginDateVal = this.warningForm.time;

                    if (beginDateVal) {
                        return t.getTime() < beginDateVal;
                    }
                }
            },


            warningForm: {             //  表单内容
                //  预警信息内容             
                name:'',
                type:'',
                time:new Date().getTime(),//new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
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
                {
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
            ]
        }
    },
    mounted(){
        
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
            // console.log(this.formInline);
            const monitorArr = [];
            for(var i=0;i<this.formInline.length;i++){
                const monitor = {};
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
            // console.log(monitorArr);
            const sDate = new Date(this.warningForm.time);
            const eDate = this.warningForm.time2;
            const monitorObj = {
                caseNo :this.warningForm.name,
                startTime :sDate.getFullYear()+'-'+(sDate.getMonth()+1)+'-'+sDate.getDate(),
                endTime :eDate ? eDate.getFullYear()+'-'+(eDate.getMonth()+1)+'-'+eDate.getDate() : '',
                reason :this.warningForm.briefCase,
                targetList :monitorArr
            };
            console.log(monitorObj);
            this.$Ajax.post('bkController/addBkTask',monitorObj, true).then(data=>{
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
            if( this.formInline.length !=1 ){
                this.formInline.splice(index,1);
            }else{
                this.$message({
                    message: '至少需保留一条布控对象数据',
                    type: 'warning'
                });
            }
        },
        
        //  返回
        backClick(){
            window.location.href = `${window.g.GrobalUrl}VisualizePlatform/file/9daaab6b0c75467096deaf9336e70209.html`;
        },
    }
}
</script>

<style scoped lang="less">
    @import '../../../static/css/AppIns.less';

    .new-warning-form{
        /deep/.el-form-item{
            margin-bottom: 16px;
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
        /deep/.el-select.select-height{
            width: auto;
        }
</style>

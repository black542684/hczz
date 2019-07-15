<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="warningRules">
            <el-form-item label="布控对象：" class="bkdx-style">
                <el-select v-model="formInline.obj" placeholder="选择布控对象" class="select-height" @change="objSelect">
                    <el-option label="人员" value="1"></el-option>
                    <el-option label="车辆" value="0"></el-option>
                    <el-option label="物品" value="2"></el-option>
                </el-select>
            </el-form-item>

            <!-- 人员 -->
            <el-form-item label="身份证：" v-show="formInline.peopleIsShow" prop="ID">
                <el-input v-model="formInline.ID" placeholder="输入身份证号" class="input-height" @blur.prevent="idGetName" @keyup.native="numberOnly"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" v-show="formInline.peopleIsShow">
                <el-input v-model="formInline.name" placeholder="输入姓名" class="input-height"></el-input>
            </el-form-item>

            <!-- 车辆 -->
            <el-form-item label="车牌号：" v-show="formInline.carsIsShow">
                <el-input v-model="formInline.carNum" placeholder="输入车牌号" class="input-height"></el-input>
            </el-form-item>


            <!-- 物品 -->
            <el-form-item label="物品类型：" v-show="formInline.itemsIsShow">
                <el-select v-model="formInline.type" placeholder="选择物品类型" class="select-height02" @change="typeSelect">
                    <el-option label="手机串号" value="1"></el-option>
                    <el-option label="电脑mac" value="2"></el-option>
                </el-select>
            </el-form-item>

            <!-- 串号 -->
            <el-form-item label="串号：" v-show="formInline.chIsShow">
                <el-input v-model="formInline.chNum" placeholder="输入串号" class="input-height"></el-input>
            </el-form-item>

            <!-- MAC -->
            <el-form-item label="MAC：" v-show="formInline.macIsShow">
                <el-input v-model="formInline.macNum" placeholder="输入MAC号" class="input-height"></el-input>
            </el-form-item>

            <slot name="deleteIcon" class="delete-icon"></slot>
        </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            warningRules: {                //  指令信息检查规则
                ID: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { min: 18, max: 18, message: '长度 18 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    props:['formInline'],
    mounted(){
        
    },
    methods:{
        objSelect(obj){
            if(obj == 1){
                //  人员
                this.formInline.peopleIsShow = true;
                this.formInline.carsIsShow = false;
                this.formInline.itemsIsShow = false;

                this.formInline.chIsShow = false;
                this.formInline.macIsShow = false;
            }else if(obj == 0){
                //  车辆
                this.formInline.peopleIsShow = false;
                this.formInline.carsIsShow = true;
                this.formInline.itemsIsShow = false;

                this.formInline.chIsShow = false;
                this.formInline.macIsShow = false;
            }else if(obj == 2){
                //  物品
                this.formInline.peopleIsShow = false;
                this.formInline.carsIsShow = false;
                this.formInline.itemsIsShow = true;

                //  置空 ‘物品类型’ select
                this.formInline.type = '';
            }
        },

        typeSelect(type){
            if(type == 1){
                //  手机串号
                this.formInline.chIsShow = true;
                this.formInline.macIsShow = false;
            }else if(type == 2){
                //  MAC
                this.formInline.chIsShow = false;
                this.formInline.macIsShow = true;
            }
        },
        
        idGetName(){
            //console.log(this.formInline.ID);
            if(this.formInline.ID.length == 18 && this.formInline.ID){
                this.$Ajax.post(`bkController/getNameBySfz?sfz=${this.formInline.ID}`,{}, true).then(res=>{
                    console.log(res.data);
                    this.formInline.name = res.data;
                }).catch( (err)=>{
                    this.formInline.name = '';
                } );
            }else{
                //this.formInline.name = '';
            }
        },
        numberOnly(){
            this.formInline.ID=this.formInline.ID.replace(/[^\.\d]/g,'');
            this.formInline.ID=this.formInline.ID.replace('.','');
        }
    }
}
</script>

<style scoped lang="less">
    .select-height{
        /deep/.el-input__inner{
            width: 466px !important;
        }
    }
    .select-height,
    .select-height02{
        /deep/.el-input__inner{
            height: 28px;
            line-height: 28px;
        }
        /deep/.el-input__icon{
            line-height: 28px;
        }
    }

    .input-height{
        /deep/.el-input__inner{
            height: 28px;
            line-height: 28px;
        }
    }

    /deep/.el-form-item{
        margin-bottom: 10px;
    }
    /deep/.el-form-item__label{
        line-height: 33px;
        height: 33px;
        width: 110px;
        text-align: right;
    }

    .demo-form-inline{
        position: relative;
    }
    /deep/.bkdx-style{
        &>.el-form-item__label{
            &::before{
                content: '*';
                color:red;
            }
        }
    }
    /deep/.el-select.select-height{
        width: auto;
    }
    
</style>

<template>
    <div class="cases-warning-list">
        <el-row :gutter="20" class="el-row-style">
            <el-col :span="6" class="el-col-style">
                <div class="grid-content title-style">
                    案件预警（{{caseTotal}}）
                </div>
            </el-col>
            <el-col :span="10" :offset="8">
                <div class="grid-content">
                    <el-row class="el-row-right">
                        <el-button type="primary" size="small" class="btn-set-height">新建预警</el-button>
                        <el-input v-model="rulesNames" placeholder="请输入预警名称/规则等" class="ipt-set-height" @keydown.enter.native="searchRulesNames"></el-input>
                        <i class="el-icon-search btn-search" @click="searchRulesNames"></i>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-tabs v-model="activeName" @tab-click="handleClick" class="change-tab">
            <el-tab-pane :label="tabName[0]" name="first">用户管理</el-tab-pane>
            <el-tab-pane :label="tabName[1]" name="second">配置管理</el-tab-pane>
            <el-tab-pane :label="tabName[2]" name="third">角色管理</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    components:{
        
    },
    data () {
        return {
            caseTotal:100,
            rulesNames:'',
            activeName: 'first',
            tabName:['已触发（12）','市级预警（20）','个人预警（55）'],

        }
    },
    mounted(){

    },
    methods:{
        searchRulesNames(){
            alert(`确定要搜索${this.rulesNames}嘛？`);
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>

<style scoped lang="less">
    @import '../../../static/css/SCManagement.less';
</style>

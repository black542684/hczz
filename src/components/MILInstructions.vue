<template>
    <div class="big-box">
        <div class="header-container">
            
            
            <el-form 
                :inline="true" 
                :model="instructForm"
                ref="instructForm" 
                class="instruct-form form-style"
                label-width="100px">

                <div class="form-item">
                    <div class="form-title">指令信息</div>
                    <el-form-item label="指令名称：" prop="instructName">
                        <div>{{instructForm.instructName}}</div>
                    </el-form-item>
                    <el-form-item label="指令编号：" prop="instructNumber">
                        <div>{{instructForm.instructNumber}}</div>
                    </el-form-item>
                    <el-form-item label="发起人：" prop="person">
                        <div>{{instructForm.person}}</div>
                    </el-form-item>
                    <el-form-item label="发起单位：" prop="unit">
                        <div>{{instructForm.unit}}</div>
                    </el-form-item>
                    <el-form-item label="申请时间：" prop="time">
                        <div>{{instructForm.time}}</div>
                    </el-form-item>
                    <el-form-item label="申请说明：" prop="applyDesc">
                        <div>{{instructForm.applyDesc}}</div>
                    </el-form-item>
                </div>
                
                <div class="form-item">
                    <div class="form-title">案源信息</div>
                    <el-form-item label="案串编号：" prop="caseNumber">
                        <div>{{instructForm.caseNumber}}</div>
                    </el-form-item>
                    <el-form-item label="案串名称：" prop="caseName">
                        <div>{{instructForm.caseName}}</div>
                    </el-form-item>
                    <el-form-item label="作案手段：" prop="caseMeans">
                        <div>{{instructForm.caseMeans}}</div>
                    </el-form-item>
                    <el-form-item label="案件数量：" prop="caseCount">
                        <div>{{instructForm.caseCount}}</div>
                    </el-form-item>
                    <el-form-item label="研判人员：" prop="personnel">
                        <div>{{instructForm.personnel}}</div>
                    </el-form-item>
                    <el-form-item label="案件类别：" prop="caseType">
                        <div>{{instructForm.caseType}}</div>
                    </el-form-item>

                    <el-form-item 
                    label="简要案情：" 
                    :title="instructForm.briefCase" 
                    prop="briefCase" 
                    class="check-brief-case-content">
                        <div>{{instructForm.briefCase}}</div>
                    </el-form-item>

                    <el-form-item label="串并依据：" class="check-brief-case-content">
                        <div>{{instructForm.gist}}</div>
                    </el-form-item>

                    <el-form-item 
                    label="线索特征：" 
                    prop="clueTrait" 
                    :title="instructForm.clueTrait"
                    class="check-brief-case-content">
                    <div>{{instructForm.clueTrait}}</div>
                    </el-form-item>

                    <el-form-item label="附件：" class="check-brief-case-content">
                        <ul class="origin-files clearfix">
                            <li v-for="(item,index) in instructForm.attachments" :key="index">
                                <a :href="item.fileVisitPath" :download="item.fileName">{{ item.fileName }}</a>
                            </li>
                        </ul>
                    </el-form-item>
                </div>

                <div class="form-item">
                    <div class="form-title">指定侦办</div>
                    <el-form-item label="主侦单位：" prop="mainSpyUnit">
                        <div>{{instructForm.mainSpyUnit}}</div>
                    </el-form-item>
                    <el-form-item label="配侦单位：" prop="cooperateSpyUnit">
                        <div>{{instructForm.cooperateSpyUnit}}</div>
                    </el-form-item>
                    <!-- 占位 -->
                    <el-form-item></el-form-item>

                    <el-form-item label="侦办要求：" prop="spyRequire" class="high-check-content">
                        <div>{{instructForm.spyRequire}}</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 流程弹窗 -->
        <div class="process-box" v-show="processIsShow">
            <div class="process-border" id="mountNode">
                <!-- 流程图 -->
            </div>
        </div> 
    </div>
</template>

<script>
//  引入流程图插件 AntV/g6
import G6 from '@antv/g6'
//  引入流程图节点图片
import processNodeDefault from '../../static/image/processNodeDefault.png'
import processNodeSuccess from '../../static/image/processNodeSuccess.png'

export default {
    props:['instructForm'],
    data () {
        return {
            processIsShow:false,        //  流程弹框显示与否
            accessoryPlacrholder:'请上传案情材料，案情列表，物证详情等',
            isBack:false,               //  是否退回

            // instructForm: {             //  表单内容
            //     //  指令信息内容             
            //     instructName: '发动机萨克打击力度',
            //     instructNumber: 'ZL201901000',
            //     unit:'石家庄市公安局刑侦第四支队',
            //     person:'王胜利',
            //     time:'2018-7-7  -  2018-9-7',

            //     //  案源信息内容
            //     caseNumber:'',
            //     caseName:'朝阳小区入室盗窃系列案',
            //     caseMeans:'白天入室',
            //     caseCount:15,
            //     personnel:'王木木',
            //     caseType:'',
            //     briefCase:`受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。`,
            //     gist:['技术物证','DNA','指纹'],
            //     clueTrait:'受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右，系冒充淘宝客户作案受害人XX接到诈骗电话被骗了四五万元左右。',
            //     fileList:['图片01.png','文档01.txt','文本01.docx','表格01.xlsx'],        //  保存上传附件名称的数组

            //     //  指定侦办内容
            //     mainSpyUnit:'桥东分局',
            //     cooperateSpyUnit:'桥西市局',
            //     spyRequire:'暂无',

            //     //  提交信息内容
            //     superiorAuditor:'王麻子--刑侦大队长',
            //     auditorResult:'通过',
            //     applyInstructions:'写的合格'
            // },
            nodesData:[                 //  流程图节点数据
                {
                    id: 'node1',
                    x: 265,
                    y: 208,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeSuccess,
                    label:`
                    申请
                    张三  发起申请
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node2',
                    x: 423,
                    y: 208,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node3',
                    x: 670,
                    y: 67,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node4',
                    x: 670,
                    y: 208,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node5',
                    x: 670,
                    y: 357,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node6',
                    x: 830,
                    y: 67,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node7',
                    x: 830,
                    y: 208,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node8',
                    x: 830,
                    y: 357,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node9',
                    x: 990,
                    y: 67,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node10',
                    x: 990,
                    y: 208,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                },
                {
                    id: 'node11',
                    x: 990,
                    y: 357,
                    size:[40,40],
                    shape: 'image',
                    img: processNodeDefault,
                    label:`
                    发起部门领导审批
                    李四  待处理
                    2019-04-09 17:10:20`,
                    labelCfg: {
                        position: 'bottom',
                        textAlign:'left',
                    },
                }
            ],
        }
    },
    mounted(){
        //  显示流程图
        const data = {
            //  节点
            nodes: this.nodesData,
            //  连接线
            edges: [
                {
                    source: 'node1',
                    target: 'node2',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node2',
                    target: 'node3',
                    shape: 'polyline',          //  折线
                    controlPoints: [{x: 423, y: 67}],       //  折线转折处坐标
                    style: {
                        endArrow: true          //  连接线结尾箭头
                    }, 
                },{
                    source: 'node2',
                    target: 'node4',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node2',
                    target: 'node5',
                    shape: 'polyline',
                    controlPoints: [{x: 423, y: 357}],
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node3',
                    target: 'node6',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node4',
                    target: 'node7',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node5',
                    target: 'node8',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node6',
                    target: 'node9',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node7',
                    target: 'node10',
                    style: {
                        endArrow: true
                    },
                },{
                    source: 'node8',
                    target: 'node11',
                    style: {
                        endArrow: true
                    },
                }
            ]
        };
        const graph = new G6.Graph({
            container: 'mountNode',
            width: 1306,
            height: 480,
            nodeStyle: {
                default: {
                    fill: '#f7faff',      //  节点背景色
                    stroke: '#c0ccd7'       //  节点边框色
                }
            },
            edgeStyle: {
                default: { 
                    stroke: '#bfcbd6',      //  连接线颜色
                    lineWidth:2,
                }
            }
        });
        graph.read(data);
    },
    methods:{
        //  查看流程
        checkProcess(){
            this.processIsShow = !this.processIsShow;
            // console.log(this.instructForm)
        },
        resultRadio(e){
            console.log(e);
            e == '退回' ? this.isBack = true : this.isBack = false ;
        }
    }
}
</script>

<style scoped lang="less">
    @import '../../static/css/CheckIns.less';

    .big-box{
        padding-bottom: 10px;
    }
</style>

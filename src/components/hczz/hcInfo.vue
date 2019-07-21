<template>
  <div class="header-container">
    <el-form
      :inline="true"
      :model="instructForm"
      :rules="instructRules"
      ref="hcxxForm"
      class="instruct-form form-style"
      label-width="100px"
    >
      <div class="form-item">
        <div class="form-title">合成信息</div>
        <el-form-item label="合战部门：" class="compound-info" prop="deptTypes">
        <el-checkbox-group @change="getName" v-model="instructForm.deptTypes">
        <el-checkbox
          label="0"
          :class="{ 'checkbox-border': formItemFlag === '0' }"
          :disabled="jzDisable"
        >技侦</el-checkbox>
        <el-checkbox
          label="1"
          :class="{ 'checkbox-border': formItemFlag === '1' }"
          :disabled="wzDisable"
        >网安</el-checkbox>
        <el-checkbox
          label="2"
          :class="{ 'checkbox-border': formItemFlag === '2' }"
          :disabled="spDisable"
        >刑侦</el-checkbox>
        <el-checkbox
          label="3"
          :class="{ 'checkbox-border': formItemFlag === '3' }"
          :disabled="jingzhenDisable"
        >经侦</el-checkbox>
        <el-checkbox
          label="4"
          :class="{ 'checkbox-border': formItemFlag === '4' }"
          :disabled="fankongDisable"
        >反恐</el-checkbox>
        <el-checkbox
          label="5"
          :class="{ 'checkbox-border': formItemFlag === '5' }"
          :disabled="zhianDisable"
        >治安</el-checkbox>
      </el-checkbox-group>
      <div class="jz" @click="formItemFlag = '0'">技侦</div>
      <div class="wj" @click="formItemFlag = '1'">网安</div>
      <div class="sp" @click="formItemFlag = '2'">刑侦</div>
      <div class="jingzhen" @click="formItemFlag = '3'">经侦</div>
      <div class="fankong" @click="formItemFlag = '4'">反恐</div>
      <div class="zhian" @click="formItemFlag = '5'">治安</div>
    </el-form-item>

        <!-- 技侦 -->
    <el-form-item
      label="技术侦查  查询类别"
      prop="jzQueryType"
      class="br-style"
      v-show="formItemFlag === '0'"
    >
      <el-select
        v-model="instructForm.jzQueryType"
        clearable
        placeholder="请选择技术侦查查询类别"
        size="small"
        :disabled="jzDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in jzQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="jzQueryContent" v-show="formItemFlag === '0'">
      <el-input
        v-model="instructForm.jzQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="jzDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="jzFile"
      v-show="formItemFlag === '0'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.jzFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="jzHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="jzHzUploadList.length !== 0">
          <li v-for="(item,index) in jzHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 0)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" ref="jzHzUploadList" multiple @change="hcChange(0)" :disabled="jzDisable" />
        <div>上传</div>
      </div>
    </el-form-item>

    <!-- 网安 -->
    <el-form-item
      label="网安侦查  查询类别"
      prop="wzQueryType"
      class="br-style"
      v-show="formItemFlag === '1'"
    >
      <el-select
        v-model="instructForm.wzQueryType"
        clearable
        placeholder="请选择网安侦查查询类别"
        size="small"
        :disabled="wzDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in wzQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="wzQueryContent" v-show="formItemFlag === '1'">
      <el-input
        v-model="instructForm.wzQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="wzDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="wzFile"
      v-show="formItemFlag === '1'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.wzFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="wzHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="wzHzUploadList.length !== 0">
          <li v-for="(item,index) in wzHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 1)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" ref="wzHzUploadList" multiple @change="hcChange(1)" :disabled="wzDisable" />
        <div>上传</div>
      </div>
    </el-form-item>

    <!-- 刑侦 -->
    <el-form-item
      label="刑侦侦查  查询类别"
      prop="spQueryType"
      class="br-style"
      v-show="formItemFlag === '2'"
    >
      <el-select
        v-model="instructForm.spQueryType"
        clearable
        placeholder="请选择刑侦侦查查询类别"
        size="small"
        :disabled="spDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in spQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="spQueryContent" v-show="formItemFlag === '2'">
      <el-input
        v-model="instructForm.spQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="spDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="spFile"
      v-show="formItemFlag === '2'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.spFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="spHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="spHzUploadList.length !== 0">
          <li v-for="(item,index) in spHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 2)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" ref="spHzUploadList" multiple @change="hcChange(2)" :disabled="spDisable" />
        <div>上传</div>
      </div>
    </el-form-item>
    
    <!-- 经侦 -->
    <el-form-item
      label="经侦侦查  查询类别"
      prop="jingzhenQueryType"
      class="br-style"
      v-show="formItemFlag === '3'"
    >
      <el-select
        v-model="instructForm.jingzhenQueryType"
        clearable
        placeholder="请选择经侦侦查查询类别"
        size="small"
        :disabled="jingzhenDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in jingzhenQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="jingzhenQueryContent" v-show="formItemFlag === '3'">
      <el-input
        v-model="instructForm.jingzhenQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="jingzhenDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="jingzhenFile"
      v-show="formItemFlag === '3'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.jingzhenFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="jingzhenHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="jingzhenHzUploadList.length !== 0">
          <li v-for="(item,index) in jingzhenHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 3)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" ref="jingzhenHzUploadList" multiple @change="hcChange(3)" :disabled="jingzhenDisable" />
        <div>上传</div>
      </div>
    </el-form-item>

    <!-- 反恐 -->
    <el-form-item
      label="反恐国保  查询类别"
      prop="fankongQueryType"
      class="br-style"
      v-show="formItemFlag === '4'"
    >
      <el-select
        v-model="instructForm.fankongQueryType"
        clearable
        placeholder="请选择反恐国保查询类别"
        size="small"
        :disabled="fankongDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in fankongQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="fankongQueryContent" v-show="formItemFlag === '4'">
      <el-input
        v-model="instructForm.fankongQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="fankongDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="fankongFile"
      v-show="formItemFlag === '4'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.fankongFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="fankongHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="fankongHzUploadList.length !== 0">
          <li v-for="(item,index) in fankongHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 4)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" ref="fankongHzUploadList" multiple @change="hcChange(4)" :disabled="fankongDisable" />
        <div>上传</div>
      </div>
    </el-form-item>

    <!-- 治安 -->
    <el-form-item
      label="治安侦查  查询类别"
      prop="zhianQueryType"
      class="br-style"
      v-show="formItemFlag === '5'"
    >
      <el-select
        v-model="instructForm.zhianQueryType"
        clearable
        placeholder="请选择治安侦查查询类别"
        size="small"
        :disabled="zhianDisable"
      >
        <el-option
          :value="item.name"
          :label="item.name"
          v-for="(item,index) in zhianQueryTypeList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询内容：" prop="zhianQueryContent" v-show="formItemFlag === '5'">
      <el-input
        v-model="instructForm.zhianQueryContent"
        placeholder="请输入查询内容"
        size="small"
        :disabled="zhianDisable"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="附件："
      class="brief-case-content"
      prop="zhianFile"
      v-show="formItemFlag === '5'"
    >
      <el-input
        type="textarea"
        :rows="4"
        :placeholder="accessoryPlacrholder"
        v-model="instructForm.zhianFile"
        disabled="disabled"
        style="display: none"
      ></el-input>
      <div class="origin-file-list">
        <span v-show="zhianHzUploadList.length === 0">{{ accessoryPlacrholder }}</span>
        <ul v-show="zhianHzUploadList.length !== 0">
          <li v-for="(item,index) in zhianHzUploadList" :key="index">
            <span :title="item">{{ item }}</span>
            <i class="iconfont iconguanbi2" @click="deleleFile(index, 5)"></i>
          </li>
        </ul>
      </div>
      <div class="origin-upload">
        <input type="file" multiple @change="hcChange(5)" :disabled="zhianDisable" />
        <div>上传</div>
      </div>
    </el-form-item>
      </div>
    </el-form>
    <div style="height: 10px;"></div>
  </div>
</template>

<script>
import { uniq } from '@/util/publicTools.js'; // 数组去重
import instructRules from '../../util/hczz/hczzManageMixinRule.js'; // 表单校验规则
import hczzURL from '../../util/url/hczzURL.js'; // 合成作战公用url
import hcWatch from './hcInfoWatch.js'; // 侦听器
export default {
  props: ['coprDepts', 'getSection', 'editHczzData'],
  data() {
    return {
      formItemFlag: "0",//  tab切换默认索引值
      jzDisable: false, // 技侦退回禁用状态
      wzDisable: false, // 网安退回禁用状态
      spDisable: false, // 刑侦退回禁用状态
      jingzhenDisable: false, // 经侦退回禁用状态
      fankongDisable: false, // 反恐退回禁用状态
      zhianDisable: false, // 治安退回禁用状态
      //  tab切换里面的select数据
      jzQueryTypeList: [
        { name: "话单(基站位置)查询" },
        { name: "电话名址查询" },
        { name: "电围数据查询" },
        { name: "伴随数据查询" },
        { name: "实时数据查询" }
      ],
      wzQueryTypeList: [
        { name: "QQ号码查询" },
        { name: "微信号码查询" },
        { name: "上网位置查询" },
        { name: "支付宝/微信关联查询" },
        { name: "实时位置查询" }
      ],
      spQueryTypeList: [{ name: "刑侦侦查查询" }],
      //  new
      jingzhenQueryTypeList: [{ name: "经侦侦查查询" }],
      fankongQueryTypeList: [{ name: "反恐侦查查询" }],
      zhianQueryTypeList: [{ name: "治安侦查查询" }],
      //  placeholder 展示数据
      accessoryPlacrholder: "请上传案情材料，案情列表，物证详情等",
      /* 展示使用 */
      jzHzUploadList: [], // 技侦附件列表
      wzHzUploadList: [], // 网安附件列表
      spHzUploadList: [], // 刑侦附件列表
      jingzhenHzUploadList: [], // 经侦附件列表
      fankongHzUploadList: [], // 反恐附件列表
      zhianHzUploadList: [], // 治安附件列表

      //  表单内容
      instructForm: {
        //  合成信息
        deptTypes: [], // 合战部门

        jzQueryType: "", // 技术侦查类别
        jzQueryContent: "", // 查询内容
        jzFile: "", // 技侦附件

        wzQueryType: "", // 网安侦查类别
        wzQueryContent: "", // 查询内容
        wzFile: "",

        spQueryType: "", // 刑侦侦查类别
        spQueryContent: "", // 查询内容
        spFile: "",

        jingzhenQueryType: "", // 经侦侦查类别
        jingzhenQueryContent: "", // 查询内容
        jingzhenFile: "",

        fankongQueryType: "", // 反恐侦查类别
        fankongQueryContent: "", // 查询内容
        fankongFile: "",

        zhianQueryType: "", // 治安侦查类别
        zhianQueryContent: "", // 查询内容
        zhianFile: "",
        //  提交信息内容
        createConfirm: ""
      },
    };
  },
  mixins: [instructRules, hcWatch],
  computed: {
    deptTypes() {
      return this.instructForm.deptTypes;
    }
  },
  
  watch: {
    deptTypes(nv) {
      if (nv.includes("0")) { //..技侦
        this.instructRules.jzQueryType[0].required = true;
        this.instructRules.jzQueryContent[0].required = true;
        this.instructRules.jzFile[0].required = true;
      } else {
        this.instructRules.jzQueryType[0].required = false;
        this.instructRules.jzQueryContent[0].required = false;
        this.instructRules.jzFile[0].required = false;
      }
      if (nv.includes("1")) { //..网安
        this.instructRules.wzQueryType[0].required = true;
        this.instructRules.wzQueryContent[0].required = true;
        this.instructRules.wzFile[0].required = true;
      } else {
        this.instructRules.wzQueryType[0].required = false;
        this.instructRules.wzQueryContent[0].required = false;
        this.instructRules.wzFile[0].required = false;
      }
      if (nv.includes("2")) { //..刑侦
        this.instructRules.spQueryType[0].required = true;
        this.instructRules.spQueryContent[0].required = true;
        this.instructRules.spFile[0].required = true;
      } else {
        this.instructRules.spQueryType[0].required = false;
        this.instructRules.spQueryContent[0].required = false;
        this.instructRules.spFile[0].required = false;
      }
      if (nv.includes("3")) { //..经侦
        this.instructRules.jingzhenQueryType[0].required = true;
        this.instructRules.jingzhenQueryContent[0].required = true;
        this.instructRules.jingzhenFile[0].required = true;
      } else {
        this.instructRules.jingzhenQueryType[0].required = false;
        this.instructRules.jingzhenQueryContent[0].required = false;
        this.instructRules.jingzhenFile[0].required = false;
      }
      if (nv.includes("4")) { //..反恐
        this.instructRules.fankongQueryType[0].required = true;
        this.instructRules.fankongQueryContent[0].required = true;
        this.instructRules.fankongFile[0].required = true;
      } else {
        this.instructRules.fankongQueryType[0].required = false;
        this.instructRules.fankongQueryContent[0].required = false;
        this.instructRules.fankongFile[0].required = false;
      }
      if (nv.includes("5")) { //..治安
        this.instructRules.zhianQueryType[0].required = true;
        this.instructRules.zhianQueryContent[0].required = true;
        this.instructRules.zhianFile[0].required = true;
      } else {
        this.instructRules.zhianQueryType[0].required = false;
        this.instructRules.zhianQueryContent[0].required = false;
        this.instructRules.zhianFile[0].required = false;
      }
      
    },
    'coprDepts': function (val) {
      if(this.$route.query.isSQ === 1) return;
      if(this.coprDepts.length===0) return;
      val.forEach(item => {
        switch(item.deptTypeName) {
          case '技侦':
            this.instructForm.jzQueryType = item.queryType;
            this.instructForm.jzQueryContent = item.queryContent; // 查询内容
            this.jzHzUploadList = item.attachments.map(item => item.fileName);;// 技侦附件
            this.instructForm.deptTypes.push('0');
            this.instructForm.jzFile = '附件已经上传';
          break;
          case '网安':
            this.instructForm.wzQueryType = item.queryType;
            this.instructForm.wzQueryContent = item.queryContent; // 查询内容
            this.wzHzUploadList = item.attachments.map(item => item.fileName);// 技侦附件
            this.instructForm.deptTypes.push('1');
            this.instructForm.wzFile = '附件已经上传';
          break;
          case '刑侦':
            this.instructForm.spQueryType = item.queryType;
            this.instructForm.spQueryContent = item.queryContent; // 查询内容
            this.spHzUploadList = item.attachments.map(item => item.fileName);;// 技侦附件
            this.instructForm.deptTypes.push('2');
            this.instructForm.spFile = '附件已经上传';
          break;
          case '经侦':
            this.instructForm.jingzhenQueryType = item.queryType;
            this.instructForm.jingzhenQueryContent = item.queryContent; // 查询内容
            this.jingzhenHzUploadList = item.attachments.map(item => item.fileName);;// 技侦附件
            this.instructForm.deptTypes.push('3');
            this.instructForm.jingzhenFile = '附件已经上传';
          break;
          case '反恐':
            this.instructForm.fankongQueryType = item.queryType;
            this.instructForm.fankongQueryContent = item.queryContent; // 查询内容
            this.fankongHzUploadList = item.attachments.map(item => item.fileName);;// 技侦附件
            this.instructForm.deptTypes.push('4');
            this.instructForm.fankongFile = '附件已经上传';
          break;
          case '治安':
            this.instructForm.zhianQueryType = item.queryType;
            this.instructForm.zhianQueryContent = item.queryContent; // 查询内容
            this.zhianHzUploadList = item.attachments.map(item => item.fileName);;// 技侦附件
            this.instructForm.deptTypes.push('5');
            this.instructForm.zhianFile = '附件已经上传';
          break;
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.warn(this.instructForm);
    })
  },
  methods: {
    // 获取选中的合战部门
    getName() {
      this.getSection(this.instructForm.deptTypes);
    },
    // 合成信息附件上传
    async hcChange(p) {
      let event = window.event || arguments.callee.caller.arguments[0];
      let fileList = event.currentTarget.files;
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }
      let {data} = await this.$Ajax.form(hczzURL.upload, formData).catch(err => console.error(err));
      
      if (data.length < 0) return ;
      // 显示上传文件的名字
      let fileName = [
        'jzHzUploadList', // 技侦附件列表
        'wzHzUploadList', // 网安附件列表
        'spHzUploadList', // 刑侦附件列表
        'jingzhenHzUploadList', // 经侦附件列表
        'fankongHzUploadList', // 反恐附件列表
        'zhianHzUploadList', // 治安附件列表
      ];
      // 校验规则的名字
      let fileRule = [
        'jzFile',
        'wzFile',
        'spFile',
        'jingzhenFile',
        'fankongFile',
        'zhianFile',
      ];
      
      data.forEach(item => {
        this.coprDepts.forEach((val, index) => {
          if (val.deptType == p) {
            this.coprDepts[index].attachments.push(item);
          }
        });  // 最终提交的数据
        this[fileName[p]].push(item.fileName);     // 用来显示的上传的文件名字
        this.instructForm[fileRule[p]] = "附件已上传";// 用来表单校验
      });
      // this.coprDepts = upData;
      // 用于修改父组件的值
      // this.editHczzData(upData);
      console.log("案源信息附件上传", data);
      this[fileName[p]] = uniq(this[fileName[p]]);  // 显示的文件名字去重
    },
    // 删除文件
    deleleFile(index, num) {
      // 显示上传文件的名字
      let fileName = [
        'jzHzUploadList', // 技侦附件列表
        'wzHzUploadList', // 网安附件列表
        'spHzUploadList', // 刑侦附件列表
        'jingzhenHzUploadList', // 经侦附件列表
        'fankongHzUploadList', // 反恐附件列表
        'zhianHzUploadList', // 治安附件列表
      ];
      let item = this.coprDepts[num].attachments[index];
      let params = {id: item.id};
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        console.log('params', params);
          this.$Ajax
          .post("fightcmd/delAttachments", params, true)
          .then(data => {
            console.log("线索协查信息附件删除", data);
          });
          let path = "";
          let url =
            "upload/deleteFile?id=" +
            item.id +
            "&fileName=" +
            item.fileName +
            "&path=" +
            path;
          let data = await this.$Ajax.post(url, {}, true);
          if (data.status !== 200) {
            this.$message({ message: "附件删除失败", type: "warning" });
          }
          // 删除对应的文件名字
          this[fileName[num]].splice(index, 1);
          // 删除对应的文件数组
          this.coprDepts[num].attachments.splice(index, 1);
          this.$refs[fileName[num]].value = '' //..上传input的value置空
          this.$message({
            message: "附件删除成功",
            type: "success"
          });
      }).catch(err => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/AppIns.less";
</style>
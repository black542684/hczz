<template>
  <el-form
    :inline="true"
    :model="instructForm"
    :rules="instructRules"
    ref="instructForm"
    class="instruct-form form-style"
    label-width="100px"
  >
    <div class="xsxc-form-item">
      <div class="xsxc-form-title">合成信息</div>
      <el-form-item label="合战部门：" class="compound-info" prop="deptType">
        <el-checkbox-group v-model="instructForm.deptType">
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('jz')" :disabled="jzDisable" />
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('wj')" :disabled="wzDisable" />
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('sp')" :disabled="spDisable" />
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('jingzhen')" :disabled="jingzhenDisable" />
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('fankong')" :disabled="fankongDisable" />
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
              <i class="iconfont iconguanbi2"></i>
            </li>
          </ul>
        </div>
        <div class="origin-upload">
          <input type="file" multiple @change="hcChange('zhian')" :disabled="zhianDisable" />
          <div>上传</div>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import instructRules from '@/util/hczz/hczzManageMixinRule.js'; // 表单校验规则

export default {
  data() {
    return {
      url: {
        // getListSeriesUrl: "ssSeriesInfoController/listSeriesByNos",
        uploadUrl: "upload/batch", // 上传文件
        // applyUrl: "hcfight/fightApply",
        // getInformationUrl: "hcfight/cmdDetails",
        // getCurDepUrl: "userApi/"
      },
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
      jzUploadFile: [], // 技侦文件
      wzUploadFile: [], // 网安文件
      spUploadFile: [], // 刑侦文件
      jingzhenUploadFile: [], // 经侦文件
      fankongUploadFile: [], // 反恐文件
      zhianUploadFile: [], // 治安文件
      jzHzUploadList: [], // 技侦附件列表
      wzHzUploadList: [], // 网安附件列表
      spHzUploadList: [], // 刑侦附件列表
      jingzhenHzUploadList: [], // 经侦附件列表
      fankongHzUploadList: [], // 反恐附件列表
      zhianHzUploadList: [], // 治安附件列表
      //  表单内容
      instructForm: {
        coprName: "", // 合战名称
        coprCode: "", // 合战编号
        createDepName: "", // 发起单位
        createName: "", // 发起人
        createBy: "",
        createTime: "", // 下发时间

        //  案源信息内容
        caseSourceCode: "", // 案串编号
        caseSourceName: "", // 案串名称
        meansOfCrime: "", // 作案手段
        caseAmount: "", // 案件数量
        judgmentName: "", // 研判人员
        caseTypeName: "", // 案件类别
        caseInfo: "", // 简要案情
        techEvide: [], // 串并依据
        clueFeature: "", // 线索特征
        originFile: "", // 附件

        //  合成信息
        deptType: [], // 合战部门

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
  mixins: [instructRules],
  computed: {
    deptType() {
      return this.instructForm.deptType;
    }
  },
  watch: {
    deptType(nv) {
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
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    // 合成信息附件
    hcChange(p) {
      let event = window.event || arguments.callee.caller.arguments[0];
      let fileList = event.currentTarget.files;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
      } else {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
        }
      }
      this.$Ajax.form(this.url.uploadUrl, formData).then(data => {
        console.log("案源信息附件上传", data);
        if (data.data.length > 0) {
          if (p === "jz") {
            data.data.forEach(item => {
              // item.classify = "4";
              this.jzUploadFile.push(item);
            });
            // this.jzUploadFile = data.data
            this.instructForm.jzFile = "技侦附件已上传";
            this.jzHzUploadList = [];
            this.jzUploadFile.forEach(item => {
              this.jzHzUploadList.push(item.fileName);
            });
          } else if (p === "wj") {
            data.data.forEach(item => {
              // item.classify = "5";
              this.wzUploadFile.push(item);
            });
            // this.wzUploadFile = data.data
            this.instructForm.wzFile = "网安附件已上传";
            this.wzHzUploadList = [];
            this.wzUploadFile.forEach(item => {
              this.wzHzUploadList.push(item.fileName);
            });
          } else if (p === "sp") {
            data.data.forEach(item => {
              // item.classify = "6";
              this.spUploadFile.push(item);
            });
            // this.spUploadFile = data.data
            this.instructForm.spFile = "刑侦附件已上传";
            this.spHzUploadList = [];
            this.spUploadFile.forEach(item => {
              this.spHzUploadList.push(item.fileName);
            });
          } else if (p === "jingzhen") {
            data.data.forEach(item => {
              // item.classify = "15";
              this.jingzhenUploadFile.push(item);
            });
            // this.spUploadFile = data.data
            this.instructForm.jingzhenFile = "经侦附件已上传";
            this.jingzhenHzUploadList = [];
            this.jingzhenUploadFile.forEach(item => {
              this.jingzhenHzUploadList.push(item.fileName);
            });
          } else if (p === "fankong") {
            data.data.forEach(item => {
              // item.classify = "13";
              this.fankongUploadFile.push(item);
            });
            // this.spUploadFile = data.data
            this.instructForm.fankongFile = "反恐附件已上传";
            this.fankongHzUploadList = [];
            this.fankongUploadFile.forEach(item => {
              this.fankongHzUploadList.push(item.fileName);
            });
          } else if (p === "zhian") {
            data.data.forEach(item => {
              // item.classify = "14";
              this.zhianUploadFile.push(item);
            });
            // this.spUploadFile = data.data
            this.instructForm.zhianFile = "治安附件已上传";
            this.zhianHzUploadList = [];
            this.zhianUploadFile.forEach(item => {
              this.zhianHzUploadList.push(item.fileName);
            });
          }
        }
      });
    },
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
.compound-info {
width: 100%;
.jz {
position: absolute;
top: 0;
left: 28px;
cursor: pointer;
}
.wj {
position: absolute;
top: 0;
left: 122px;
cursor: pointer;
}
.sp {
position: absolute;
top: 0;
left: 210px;
cursor: pointer;
}


.jingzhen {
position: absolute;
top: 0;
left: 300px;
cursor: pointer;
}
.fankong {
position: absolute;
top: 0;
left: 388px;
cursor: pointer;
}
.zhian {
position: absolute;
top: 0;
left: 476px;
cursor: pointer;
}
}
</style>



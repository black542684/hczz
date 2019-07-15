import hczzURL from '../url/hczzURL.js';  // 合成作战中的url地址
import { uniq } from '@/util/publicTools.js'; // 数组去重
import uploading from './hczzUploadName.js';  // 这个是控制 技侦，网侦， 或者视频 上传input标签
// 合成作战中的通用方法
export default {
  methods: {
    // 获取部门
    getCurDep() {
      let params = { token: this.token };
      let url = hczzURL.getCurDep + this.userId;
      this.$Ajax.get(url, params).then(data => {
        this.instructForm.createDepName = data.depName;
      });
    },
    // 获取信息数据
    async getInformationData() {
      let data = await this.$Ajax.get(hczzURL.getInformation, this.params);
      let cmdDetails = data.data.cmdDetails;
      console.log("是数据啊", data.data);
      this.instructForm = {...this.instructForm,...cmdDetails};
      this.instructForm.techEvide = cmdDetails.techEvide.split(",");
      
      if (cmdDetails.attachments.length > 0) {
        this.instructForm.originFile = "案源信息附件已上传";
        cmdDetails.attachments.forEach(item => {
          this.originFileList.push(item.fileName);
          this.attachments.push(item);
        });
      }
      if (cmdDetails.coprDepts.length > 0) {
        cmdDetails.coprDepts.forEach(item => {
          this.instructForm.deptType.push(item.deptType.toString());
          if (item.deptType == 0) {
            this.instructForm.jzQueryType = item.queryType;
            this.instructForm.jzQueryContent = item.queryContent;
            this.jzId = item.id;
            if (item.attachments.length > 0) {
              this.instructForm.jzFile = "技侦附件已上传";
              item.attachments.forEach(item => {
                this.jzHzUploadList.push(item.fileName);
                this.jzUploadFile.push(item);
              });
            }
          } else if (item.deptType == 1) {
            this.instructForm.wzQueryType = item.queryType;
            this.instructForm.wzQueryContent = item.queryContent;
            this.wzId = item.id;
            if (item.attachments.length > 0) {
              this.instructForm.wzFile = "网侦附件已上传";
              item.attachments.forEach(item => {
                this.wzHzUploadList.push(item.fileName);
                this.wzUploadFile.push(item);
              });
            }
          } else if (item.deptType == 2) {
            this.instructForm.spQueryType = item.queryType;
            this.instructForm.spQueryContent = item.queryContent;
            this.spId = item.id;
            if (item.attachments.length > 0) {
              this.instructForm.spFile = "视频附件已上传";
              item.attachments.forEach(item => {
                this.spHzUploadList.push(item.fileName);
                this.spUploadFile.push(item);
              });
            }
          }
        });
      }
      this.instructForm.createConfirm = cmdDetails.createConfirm;
    },
    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
      // console.log(this.instructForm)
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isCoprStatus = "1";
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交表单
    async submitForm() {
      this.coprDepts = [];
      this.instructForm.deptType.forEach(item => {
        switch(item){
          case "0":
            this.coprDepts.push({
              deptType: item,
              id: this.jzId,
              queryType: this.instructForm.jzQueryType,
              queryContent: this.instructForm.jzQueryContent,
              attachments: this.jzUploadFile
            });
          break;
          case "1":
            this.coprDepts.push({
              deptType: item,
              id: this.wzId,
              queryType: this.instructForm.wzQueryType,
              queryContent: this.instructForm.wzQueryContent,
              attachments: this.wzUploadFile
            });
          break;
          case "2":
            this.coprDepts.push({
              deptType: item,
              id: this.spId,
              queryType: this.instructForm.spQueryType,
              queryContent: this.instructForm.spQueryContent,
              attachments: this.spUploadFile
            });
          break;
        }
      });
      let params = {
        taskId: this.taskId,
        id: this.params.id,
        coprStatus: this.coprStatus, // 提交 1 or 草稿 0
        attachments: this.attachments,
        // 合成信息
        coprDepts: this.coprDepts,
      };
      params = {...params,...this.instructForm};
      params.techEvide = this.instructForm.techEvide.join(",");
      let msg = "提交成功";
      let failMsg = "提交失败";
      if (this.isCoprStatus === "0") {
        msg = "保存草稿成功";
        failMsg = "保存草稿失败";
      }
      console.log("参数", params);
      let data = await this.$Ajax.post(hczzURL.apply, params, true);
      if (data.data === "success") {
        this.$message({
          message: msg,
          type: "success"
        });
        this.$router.push({
          name: "hczzManage"
        });
      } 
      else {
        this.$message({
          message: failMsg,
          type: "warning"
        });
      }
    },
    // 保存草稿
    keepDraft() {
      if (this.$route.query.statusType === "0") {
        this.coprStatus = null; // 待办进来时 保存草稿 参数为null
      }
      this.isCoprStatus = "0"; // 0 草稿
      this.submitForm();
    },
    // 串并编号查询
    async getNumQuery() {
      let caseSourceCode = this.instructForm.caseSourceCode;
      if (caseSourceCode === "") {
        this.$message({
          message: "请输入案串编号！",
          type: "warning"
        });
      }
      let data = await this.$Ajax.post(hczzURL.getListSeries, {seriesNos: caseSourceCode}, true);
      console.log("aaaaaaaaaaa", data);
      if (data.data.length > 0) {
        // 如果有对应的案串编号
        this.instructForm.caseSourceName = data.data[0].seriesName;
        this.instructForm.caseAmount = data.data[0].caseNum;
        this.disabledFlag = true; // 案串名称，数量，变成不可编辑
        this.$message({
          message: "案串编号引用成功！",
          type: "success"
        });
      } else {
        // 如果没有对应的编号，则向另外一个接口查找
        this.$Ajax
          .post("ssSeriesInfoController/listCaseInfoByNos", {caseNos: caseSourceCode}, true)
          .then(res => {
            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbb", res);
            this.instructForm.caseAmount = 1;
            this.instructForm.caseSourceName = res.data[0].case_title;
            this.instructForm.caseInfo = res.data[0].case_content;
            this.instructForm.meansOfCrime = res.data[0].crime_method_type;
            this.instructForm.caseTypeName = res.data[0].case_small_type;
            this.disabledFlagA = true;
            this.$message({
              message: "案串编号引用成功！",
              type: "success"
            });
          })
          .catch(err => {
            this.disabledFlag = false;
            this.disabledFlagA = false;
            this.instructForm.caseAmount = "";
            this.instructForm.caseSourceName = "";
            this.instructForm.caseInfo = "";
            this.instructForm.meansOfCrime = "";
            this.instructForm.caseTypeName = "";
            this.$message({
              message: "系统未找到对应的串案/案件编号，请手动输入",
              type: "warning"
            });
          });
      }
    },
    //  查看流程
    checkProcess() {
      this.processIsShow = !this.processIsShow;
      // console.log(this.instructForm)
    },
    // 案源信息附件
    originChange(e) {
      let fileList = e.currentTarget.files;
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
        this.originFileList.push(fileList[i].name);  // 文件名字
      }
      if (fileList !== "") {
        this.instructForm.originFile = "案源信息附件已上传";
      }
      this.$Ajax.form(this.url.uploadUrl, formData).then(data => {
        console.log("案源信息附件上传", data);
        if (data.data.length > 0) {
          data.data.forEach(item => {
            item.classify = "3";
            this.attachments.push(item);  // 文件附加列表
          });
        }
      });
      console.log('安源信息', this.originFileList);
      // 数组去重
      this.originFileList = uniq(this.originFileList);  // 展示的名字
      this.attachments = uniq(this.attachments); // 提交表单需要的数据
    },
    //  文件上传
    async uploadFiles(e,num) {
      let fileList = e.currentTarget.files;
      let formData = new FormData();
      console.log('上传事件执行了');
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }
      // 上传文件接口
      let data = await this.$Ajax.form(`${hczzURL.upload}?classify=${num}`, formData);
      this.instructForm[uploading[num][0]] = uploading[num][1];  // 提示信息
      console.warn('文件上传', data);
      if (data.data.length > 0) {
        data.data.forEach(item => {
          this[uploading[num][2]].push(item); // 提交表单需要的数据
          this[uploading[num][3]].push(item.fileName);  // 展示的名字
        });
      }
      
      // 数组去重
      this[uploading[num][3]] = uniq(this[uploading[num][3]]);  // 展示的名字
      this[uploading[num][2]] = uniq(this[uploading[num][2]]); // 提交表单需要的数据
      console.log('上传文件的名字', this[uploading[num][3]], uploading[num][3]);
    },
    // 删除文件
    deleleFile(item, child, num) {
      // 1:item 用来获取需要删除的文件ID  和名字    2:child  是input标签DOM元素  3: num控制技侦，网侦，视频    
      let params = {id: item.id};
      
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          this.$Ajax
            .post("fightcmd/delAttachments", params, true)
            .then(data => {
              console.log("附件删除成功", data);
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

          this[uploading[num][3]].forEach((ele, index) => {  // 删除列表中展示文件名
            if (ele === item.fileName) {
              this[uploading[num][3]].splice(index, 1);
            }
          });
          console.log('删除事件', item.fileName)

          this[uploading[num][2]].forEach((ele, index) => { // 删除需要提交的数据列表中的那条数据
            if (ele.id === item.id) {
              this[uploading[num][2]].splice(index, 1);
            }
          });

          // child.value = ""; //..上传input的value置空
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
}
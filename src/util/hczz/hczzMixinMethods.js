import hczzURL from '../url/hczzURL.js';  // 合成作战中的url地址
import { uniq } from '@/util/publicTools.js'; // 数组去重
import uploading from './hczzUploadName.js';  // 这个是控制 技侦，网侦， 或者视频 上传input标签
// 合成作战中的通用方法
export default {
  methods: {
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
      params = {...params,...hat.instructForm};
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
    //  文件上传
    async uploadFiles(e,num) {
      let fileList = e.currentTarget.files;
      let formData = new FormData();
      
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }
      // 上传文件接口
      let data = await this.$Ajax.form(`upload/batch?classify=${num}`, formData);
      this.instructForm[uploading[num][0]] = uploading[num][1];  // 提示信息
      if (data.data.length > 0) {
        data.data.forEach(item => {
          //item.classify = "9";
          this[uploading[num][2]].push(item); // 提交表单需要的数据
          this[uploading[num][3]].push(item.fileName);  // 展示的名字
        });
      }
      // 数组去重
      this[uploading[num][3]] = uniq(this[uploading[num][3]]);  // 展示的名字
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

          this.originFileList.forEach((ele, index) => {  // 删除列表中展示的那条数据
            if (ele.id === item.id) {
              this.originFileList.splice(index, 1);
            }
          });

          this.ayData.attachments.forEach((ele, index) => { // 删除需要提交的数据列表中的那条数据
            if (ele.id === item.id) {
              this.ayData.attachments.splice(index, 1);
            }
          });

          child.value = ""; //..上传input的value置空

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
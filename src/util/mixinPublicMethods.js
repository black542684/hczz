import { uniq } from '@/util/publicTools.js'; // 数组去重
export default {
  methods: {
    //  文件上传
    async uploadFiles(e,num) {
      let fileList = e.currentTarget.files;
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }
      if (fileList !== "") {
        this.ayData.originFile && (this.ayData.originFile = "线索协查信息附件已上传");
      }
      // 上传文件接口
      let data = await this.$Ajax.form(`upload/batch?classify=${num}`, formData);
      if (data.data.length > 0) {
        data.data.forEach(item => {
          //item.classify = "9";
          this.ayData.attachments.push(item);  // 需要上传的数据列表
          this.originFileList.push(item);   // 展示的文件名字
        });
      }
      // 数组去重
      this.originFileList = uniq(this.originFileList);
    },
    // 删除文件
    deleleFile(item, child) {
      let params = {id: item.id};
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
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

          this.originFileList.forEach((ele, index) => {
            if (ele.id === item.id) {
              this.originFileList.splice(index, 1);
            }
          });

          this.ayData.attachments.forEach((ele, index) => {
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
<template>
  <div class="xsxc-content">
    <el-form :inline="true">
      <el-form-item label="附件：">
        <div class="origin-upload">
          <input
            type="file"
            style="position: absolute;top: 7px;opacity: 0;z-index: 999;width: 56px;height: 28px;"
            multiple
            @change="uploadFiles"
            ref="uploadFiles"
          >
          <el-button type="primary" size="mini">上传</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="origin-file-list">
          <ul v-show="originFileList.length !== 0" class="clearfix">
            <li
              v-for="(item,index) in originFileList"
              :key="index"
              style="font-size:12px;float:left;margin-right:10px;"
            >
              <span>{{ item.fileName }}</span>
              <i
                class="el-icon-close"
                style="cursor:pointer;font-size: 14px;"
                @click="deleleFile(item)"
              ></i>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uniq } from '../../util/publicTools.js'; // 数组去重
export default {
  name: "",
  data() {
    return {
      instructForm: {
        originFile: "",
        attachments: []
      },
      originFileList: []
    };
  },
  methods: {
    //文件上传
    uploadFiles(e) {
      let fileList = e.currentTarget.files;
      let that = this;
      let formData = new FormData();
      if (fileList.length === 1) {
        formData.append("files", fileList[0]);
      } else if (fileList.length > 1) {
        for (var i = 0; i < fileList.length; i++) {
          formData.append("files", fileList[i]);
        }
      }
      if (fileList !== "") {
        this.instructForm.originFile = "案源信息附件已上传";
      }
        this.$Ajax.form("upload/batch", formData).then(data => {
            console.log("案源信息附件上传", data);
            if (data.data.length > 0) {
                data.data.forEach(item => {
                    item.classify = "1";
                    that.instructForm.attachments.push(item);
                    that.originFileList.push(item);
                });
            }
            //  数组去重
            that.originFileList = uniq(that.originFileList);
        });
    },
    // 文件删除
    deleleFile(item) {
      let that = this;
      let params = {
        id: item.id
      };
      this.$confirm("此操作将删除附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$Ajax
            .post("fightcmd/delAttachments", params, true)
            .then(data => {
              console.log("案源信息附件删除", data);
            });
          let path = "";
          if (!item.fileSavePath) {
            path = "";
          } else {
            path = item.fileSavePath;
          }
          let url =
            "upload/deleteFile?id=" +
            item.id +
            "&fileName=" +
            item.fileName +
            "&path=" +
            path;
          this.$Ajax.post(url, {}, true).then(data => {
            if (data.data === "删除成功") {
              that.originFileList.forEach((ele, index) => {
                if (ele.id === item.id) {
                  that.originFileList.splice(index, 1);
                }
              });
              that.instructForm.attachments.forEach((ele, index) => {
                if (ele.id === item.id) {
                  that.instructForm.attachments.splice(index, 1);
                }
              });
              // 附件列表数组为空
            //   if (that.originFileList.length === 0) {
                that.$refs.uploadFiles.value = "";
            //   }
              that.$message({
                message: "附件删除成功",
                type: "success"
              });
            } else {
              that.$message({
                message: "附件删除失败",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped lang="less">
</style>

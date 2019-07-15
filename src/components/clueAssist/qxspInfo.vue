<template>
  <div>
    <el-form
      style="margin-top:10px;"
      :inline="true"
      :model="shData"
      :rules="shRules"
      v-show="shData.xzqxjsBtn"
      ref="shForm"
    >
      <div>
        <div class="xsxc-form-item">
          <div class="xsxc-form-title">{{isShenhe}}信息</div>
          <template v-if="shData.setFkHide">
            <el-form-item :label="isShenhe03">
              <el-input
                v-model="shData.shr"
                placeholder
                size="small"
                class="xsxc-input-only-read"
                readonly="readonly"
              ></el-input>
            </el-form-item>

            <el-form-item :label="isShenhe02" v-if="!shData.backIsShow">
              <el-radio-group v-model="shData.shjg">
                <el-radio label="通过" @change="shResultFn"></el-radio>
                <el-radio label="退回" @change="shResultFn"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="isShenhe02" v-if="shData.backIsShow">通过</el-form-item>
          </template>

          <el-form-item :label="shData.shyjLabel" prop="shyj" class="xsxc-width100">
            <el-input type="textarea" v-model="shData.shyj" autosize></el-input>
          </el-form-item>

          <el-form-item
            label="附件："
            style="width: auto;margin-right: 10px;"
            prop="originFile"
            v-if="shData.showUpload"
          >
            <div class="origin-upload">
              <input
                type="file"
                style="position: absolute;top: 7px;opacity: 0;z-index: 999;width: 56px;height: 28px;"
                multiple
                @change="uploadFiles($event, shData.uploadNumber)"
                ref="uploadFiles"
              />
              <el-button type="primary" size="mini">上传</el-button>
              <el-input v-show="false" v-model="ayData.originFile"></el-input>
            </div>
          </el-form-item>
          <el-form-item style="width: 1030px;">
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
                    @click="deleleFile(item, qxspInfo)"
                  ></i>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 审核按钮 -->
    <div class="xsxc-btn-box" v-if="!shData.btnSecShow">
      <template v-if="shBtnShow">
        <el-button type="primary" size="mini" @click="shSubmit('shForm',0,null)">{{title}}</el-button>
      </template>
      <template v-if="!shBtnShow">
        <el-button type="warning" size="mini" @click="shSubmit('shForm',1,null)">退回给申请人</el-button>
      </template>
    </div>

    <!-- 流转市局 -->
    <div class="xsxc-btn-box" v-if="shData.btnSecShow">
      <template>
        <el-button type="primary" size="mini" @click="shSubmit('shForm',0,0)">{{title003}}</el-button>
      </template>
      <template>
        <el-button
          type="warning"
          v-if="shData.sjjsBtn02"
          size="mini"
          @click="shSubmit02('shForm',0,1)"
        >提交市局协查</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment"; // 时间格式化
import { uniq } from '../../util/publicTools.js';  // 数组去重方法
import publicMethods from '../../util/mixinPublicMethods.js'; // 一些公用的方法
export default {
  props: ["shData", "newTaskId"],
  mixins: [publicMethods],
  data() {
    return {
      bkID: "",
      taskId: "",
      statusId: "",
      userId: "",
      token: "",
      roleId: "",
      //  案源审核校验
      shRules: {
        shyj: [
          { required: true, message: "请输入审核意见", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        originFile: [{ required: false, message: "请传附件", trigger: "blur" }]
      },
      shBtnShow: true, //  审核流程按钮切换控制

      title: "提交审核",
      title003: "提交接收",
      ayData: {
        originFile: "",
        fileList: [],
        attachments: []
      },
      originFileList: [],
      newUserList: "",
      newUserList2: "",
      isShenhe: "审核",
      isShenhe02: "审核结果：",
      isShenhe03: "审核人："
    };
  },
  created() {
    if(!this.shData.xzqxjsBtn) {
      this.shRules.shyj = "-1";
    }
  },
  computed: {
    qxspInfo: function () {
      return this.$refs.uploadFiles;
    }
  },
  mounted() {
    /* 通过url传入的数据 */
    this.bkID = this.$route.query.id;
    this.taskId = this.$route.query.taskId;
    this.statusId = this.$route.query.statusId;
    /* 获取本地存储信息 */
    this.token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    /* 审核按钮的名字 */
    if (this.shData.sjjsBtn) {
      this.title = "确认接收";
    }
    if (this.shData.sjjgfkBtn) {
      this.title = "提交反馈线索";
    }

    this.getUserList(0, true);
    this.getUserList(1, true);
    if (this.shData.sjbmIsCity == 1) {
      this.getUserList(null, false);
    }

    if (this.shData.uploadNumber == 11 || this.shData.uploadNumber == 12) {
      this.isShenhe = "反馈";
      this.isShenhe02 = "反馈结果：";
      this.isShenhe03 = "反馈人：";
      this.shData.shyjLabel = "反馈意见：";
      this.title003 = "提交反馈";
    }
  },
  watch: {
    // 判断附件数量是否为0
    originFileList(nv) {
      this.ayData.originFile = nv.length === 0 ? "" : "线索协查信息附件已上传";
    }
  },
  methods: {
    /* 把原来的getUserList和getUserList1和getUserList2合并了 */
    async getUserList(num, flag) {
      //  提交市局，重新调用接口，获取userList
      let url01 = "/userApi/" + this.userId;
      // 获取申请部门和父级部门ID
      let parentID = await this.$Ajax.get(url01, { token: this.token }, true);
      this.ayData.sqdw = parentID.depName; //  获取申请单位
      this.depId = parentID.depId; // 获取父级部门ID
      
      let orgId;
      if (flag) {
        // 根据上面获取的父级部门ID ，获取市级查询单位数据
        let url02 = "/orgApi/getParentDeps/" + parentID.depId;
        console.log('url02', parentID);
        let sjResult = await this.$Ajax.get(url02, { token: this.token }, true);
        console.log('获取市级查询单位数据', sjResult);
        this.shiju = sjResult[0].name;
        this.shijuID = sjResult[0].id;
        orgId = sjResult[0].id;
      }

      // 获取角色ID
      let role = await this.$Ajax.get(
        "/clue/getTaskRole/",
        { statusId: this.shData.statusIdNew, branch: num },
        true
      );
      this.roleId = role[0];

      // 通过OrgId和RoleId获取用户
      let params = {};
        if (flag) {
          // getUserList
          params = { orgId: orgId, roleId: this.roleId };
        } else {
          // getUserList2
          params = { orgId: this.depId, roleId: this.roleId };
        }
      let user = await this.$Ajax.get(
        "userApi/getUsersByOrgIdAndRoleId/",
        params,
        true
      );
      console.warn(user + "这是第二个");
      if (flag) {
        this.newUserList = user.join(",");
      } else {
        this.newUserList2 = user.join(",");
      }
      
    },
    //  审核页面 - 审核结果切换
    shResultFn(label) {
      if (label === "通过") {
        this.shBtnShow = true;
        this.shData.shyjLabel = "审核意见：";
      } else if (label === "退回") {
        this.shBtnShow = false;
        this.shData.shyjLabel = "退回原因：";
      }
    },
    //  提交市局协查
    shSubmit02(formName, number, number02) {
      // let formName = formName;
      // let number = number;
      // let number02 = number02;

      if (this.shData.btnSecShow && this.shData.xzqxJSFKtask && number02 == 1) {
        this.$prompt("是否提请市局协查该案件线索？", "市局协查提请", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: "请输入内容"
        }).then(({ value }) => {
          //this.getUserList(1);
          let reviewData = {
            createBy: localStorage.getItem("userName"), //..审核状态下，当前登陆人
            id: this.bkID,
            statusId: this.shData.statusId02,
            taskId: this.newTaskId,
            opinionInfo: {
              suggest: "", //this.shData.shyj,
              result: this.shData.shjg,
              createName: localStorage.getItem("realName"), //..审核状态下，当前登陆人
              isInvalid: number.toString(), //  通过or退回
              createBy: this.shData.sqr, //  流程单子申请的人

              isCity: 0, //0：县级，1市级"
              userList: "", //this.newUserList ? this.newUserList : this.shData.userLi,   //  下级审批人userList
              explain: value,

              //  反馈需要的内容
              depName: this.ayData.sqdw,
              date: moment().format("YYYY-MM-DD HH:mm:ss")
            },

            feedbackContent: this.shData.shyj,
            attachments: this.ayData.attachments
          };

          //  市局接收状态下，使用通过审核的按钮，但是提交的数据为市级的‘1’；
          this.shData.sjjsBtn
            ? (reviewData.opinionInfo.isCity = "1")
            : (reviewData.opinionInfo.isCity = "0");
          console.log(reviewData.opinionInfo.isCity);
          this.shData.sjjgfkBtn
            ? (reviewData.opinionInfo.isCity = "1")
            : (reviewData.opinionInfo.isCity = "0");
          console.log(reviewData.opinionInfo.isCity);
          number02
            ? (reviewData.opinionInfo.isCity = number02.toString())
            : (reviewData.opinionInfo.isCity = 0);
          console.log(reviewData.opinionInfo.isCity);
          if (this.shData.unitType) {
            reviewData.opinionInfo.isCity = this.shData.unitType;
          }

          reviewData.opinionInfo.userList = this.newUserList;
          console.log(reviewData);
          /* 第一个lcData */
          const lcData = {
            createBy: localStorage.getItem("userName"),
            id: this.bkID,
            modeType: "2",
            taskKey:this.shData.taskKey,
            taskId:this.shData.taskIdNew,
            opinionInfo: {
              suggest: "", //this.shData.shyj,
              result: this.shData.shjg,
              createName: localStorage.getItem("realName"), //..审核状态下，当前登陆人
              isInvalid: number.toString(), //  通过or退回
              createBy: this.shData.sqr, //  流程单子申请的人

              isCity: reviewData.opinionInfo.isCity, //0：县级，1市级"
              userList: reviewData.opinionInfo.userList, //this.newUserList ? this.newUserList : this.shData.userLi,   //  下级审批人userList
              explain: value,

              //  反馈需要的内容
              depName: this.ayData.sqdw,
              date: moment().format("YYYY-MM-DD HH:mm:ss")
            },
          };
          /* let myLcData = lcData;
          myLcData.opinionInfo.suggest = '';
          myLcData.opinionInfo.explain = value; */
          
          this.$Ajax.post("flow/submitFlow", lcData, true).then(res => {
            console.warn(res);
            if (res.data === "success") {
              this.$message({
                message: successMsg,
                type: "success"
              });
              this.$router.push({
                name: "clueAssistManage"
              });
            } else {
              this.$message({
                message: "操作失败",
                type: "warning"
              });
            }
          });
          
          this.$Ajax.post(this.shData.url, reviewData, true).then(res => {
            console.log(res);
          });

          if (number === 0) {
            //  通过
            this.$message({
              type: "success",
              message: "审核成功!"
            });
            this.$router.push({
              name: this.shData.jumpPath
            });
          } else {
            //  退回
            this.$confirm("是否退回给申请人重新填写?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$message({
                  type: "success",
                  message: "退回成功!"
                });
                this.$router.push({
                  name: this.shData.jumpPath
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消退回操作"
                });
              });
          }
        });
      }
    },
    //  审核页面 - 提交审核/退回
    shSubmit(formName, number, number02) {
      //  审核退回
      console.log("statusID", this.shData.statusIdNew);
      console.log("this.statusId", this.statusId);

      this.$refs[formName].validate(valid => {
        if (valid) {
          //  表单校验非空
          let reviewData = {
            createBy: localStorage.getItem("userName"), //..审核状态下，当前登陆人
            id: this.bkID,
            statusId: this.shData.statusId02,
            taskId: this.newTaskId,
            opinionInfo: {
              suggest: this.shData.shyj,
              result: this.shData.shjg,
              createName: localStorage.getItem("realName"), //..审核状态下，当前登陆人
              isInvalid: number.toString(), //  通过or退回
              createBy: this.shData.sqr, //  流程单子申请的人

              isCity: 0, //0：县级，1市级"
              userList: "", //this.newUserList ? this.newUserList : this.shData.userLi,   //  下级审批人userList

              //  反馈需要的内容
              depName: this.ayData.sqdw,
              date: moment().format("YYYY-MM-DD HH:mm:ss")
            },

            feedbackContent: this.shData.shyj,
            attachments: this.ayData.attachments
          };

          //  市局接收状态下，使用通过审核的按钮，但是提交的数据为市级的‘1’；
          this.shData.sjjsBtn
            ? (reviewData.opinionInfo.isCity = "1")
            : (reviewData.opinionInfo.isCity = "0");

          this.shData.sjjgfkBtn
            ? (reviewData.opinionInfo.isCity = "1")
            : (reviewData.opinionInfo.isCity = "0");

          number02
            ? (reviewData.opinionInfo.isCity = number02.toString())
            : (reviewData.opinionInfo.isCity = 0);

          if (this.shData.unitType) {
            reviewData.opinionInfo.isCity = this.shData.unitType;
          }
          //  市级部门审批、接收状态流转，穿isCity为1
          if (this.shData.sjbmIsCity == 1) {
            reviewData.opinionInfo.isCity = "1";
          }

          number02 == 1 && this.newUserList
            ? (reviewData.opinionInfo.userList = this.newUserList)
            : (reviewData.opinionInfo.userList = this.shData.userLi);

          //  区县转市级审批再转接收和反馈的时候需要用到
          // TODO
          /*  这是修改了的  */
          if (this.newUserList2 != "") {
            reviewData.opinionInfo.userList = this.newUserList2;
          }
          
          if (!this.shData.setFkHide) {
            /* 第二个lcData */
            const lcData = {
              createBy: localStorage.getItem("userName"),
              id: this.bkID,
              modeType: "2",
              taskKey:this.shData.taskKey,
              taskId:this.shData.taskIdNew,
              opinionInfo: {
                suggest: this.shData.shyj,
                result: this.shData.shjg,
                createName: localStorage.getItem("realName"), //..审核状态下，当前登陆人
                isInvalid: number.toString(), //  通过or退回
                createBy: this.shData.sqr, //  流程单子申请的人

                isCity: reviewData.opinionInfo.isCity, //0：县级，1市级"
                userList: reviewData.opinionInfo.userList, //this.newUserList ? this.newUserList : this.shData.userLi,   //  下级审批人userList

                //  反馈需要的内容
                depName: this.ayData.sqdw,
                date: moment().format("YYYY-MM-DD HH:mm:ss")
              },
            };
            /* 下面的这个是通过公共的JS引入 */
            /* let myLcData = lcData;
            myLcData.opinionInfo.suggest = this.shData.shyj;
            myLcData.opinionInfo.explain = null; */
            this.$Ajax.post("flow/submitFlow", lcData, true).then(res => {
              console.warn(res);
              if (res.data === "success") {
                this.$message({
                  message: successMsg,
                  type: "success"
                });
                this.$router.push({
                  name: "clueAssistManage"
                });
              } else {
                this.$message({
                  message: "操作失败",
                  type: "warning"
                });
              }
            });
          }
          console.warn(reviewData);
          this.$Ajax.post(this.shData.url, reviewData, true).then(res => {
            console.log(res);
          });

          if (number === 0) {
            //  通过
            this.$message({
              type: "success",
              message: "审核成功!"
            });
            this.$router.push({
              name: this.shData.jumpPath
            });
          } 
          else {
            //  退回
            this.$confirm("是否退回给申请人重新填写?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$message({
                type: "success",
                message: "退回成功!"
              });
              this.$router.push({
                name: this.shData.jumpPath
              });
            }).catch(() => {
              this.$message({
                type: "info",
                message: "已取消退回操作"
              });
            });
          }
        } else {
          
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../static/css/clueAssistInvestigate.less";
</style>
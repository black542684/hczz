import hczzURL from '../url/hczzURL.js';  // 合成作战中的url地址
import { uniq } from '@/util/publicTools.js'; // 数组去重
import uploading from './hczzUploadName.js';  // 这个是控制 技侦，网侦， 或者视频 上传input标签
// 合成作战中的通用方法
export default {
  methods: {
    // 获取部门
    getCurDep() {
      let params = { token: localStorage.getItem("token") };
      let url = hczzURL.getCurDep + localStorage.getItem("userId");
      this.$Ajax.get(url, params).then(data => {
        this.hczzData.createDepName = data.depName;
        this.auditData.depName = data.depName; // 申请单位
        this.getSection = data;
        //console.log('部门信息',data)
      });
    },
    // 获取详情
    async getInformationData() {
      let statusType = this.$route.query.statusType;
      if (this.$route.query.isSQ) return;
      let data = await this.$Ajax.get(hczzURL.getInformation, {
        id: this.id,
        createBy: this.createBy,
        procInstId: this.$route.query.procInstId,
        // taskId: ''
        statusType: statusType
      });
      let cmdDetails = data.data.cmdDetails;
      console.log("获取详情", data);
      
      // 历史走过的流程
      this.historyFromProps = data.data.historyFormProps;
      // 当前流程
      data.data.taskList && data.data.taskList.map(item => {
        item.formProps.map(item => this.currentProps.push(item));
        this.taskKey = item.statusId;  // 发起部门审核需要的数据
        this.taskId = item.taskId;    // 发起部门审核需要的数据
      });
      console.log('历史流程', this.historyFromProps);
      // 可看不可编辑
      this.historyFromProps.map(item => {
        this.controllerData[item].show = true;
        this.controllerData[item].edit = false;
      })
      console.log('当前流程', this.currentProps);
      // 可看又可编辑
      this.currentProps.map(item => {
        this.controllerData[item].show = true;
        this.controllerData[item].edit = true;
      })
      // console.warn('当前流程人', this.controllerData);
      // 草稿状态可编辑
      if(this.$route.query.statusStr == '草稿') {
        this.controllerData['hczz_fqsq'].edit = true;

      }
      /* 退回 */
      if (data.data.taskList) {
        data.data.taskList.forEach(item => {
          data.data.activitiInfoList.data.forEach(list => {
            if (item.taskId === list.id && list.hParam.result === "退回") {
              this.approveListTH.push(list.hParam);
            }
          });
        });
      }




      /* 获取反馈的数据 */
      data.data.activitiInfoList.data.forEach(item => {
        // 原来的方法放在组件里
        //  获取签收结果数据
        let key = item.taskDefinitionKey;
        //console.log('循环的结果是：', signFor[key], item);
        if (key.includes('fk') && item.endTime) {
          this.showFeedbackData.push(item.hParam);
        }
      });
      





      //let coprDepts = [...this.hczzData.coprDepts];
      // 发送给后台的数据
      this.hczzData = {...this.hczzData,...cmdDetails};
      /* cmdDetails.coprDepts.forEach(item => {
        coprDepts.forEach((val, index) => {
          if(item.deptType == val.deptType){
            coprDepts[index] = item;
            // console.log('执行了这个方法', coprDepts[index]);
          }
        });
      }) */
      this.hczzData.techEvide = cmdDetails.techEvide.split(",");
      //this.hczzData.coprDepts = [...coprDepts];




      console.log('hczzData', this.hczzData);
      // 签收结果数据
      let activitiInfoList = data.data.activitiInfoList.data;
      // 用来获取当前用户可以看到的
      let dataObj = {
        hczz_jizqr : 'jzbmqr', //..经侦
        hczz_xzqr : 'spbmqr', //..刑侦
        hczz_waqr : 'wzbmqr', //..网安
        hczz_jingzqr : 'jqrjzbm', //..经侦
        hczz_zaqr : 'qrzabm', //..治安
        hczz_fkgbqr : 'qrfkgbbm', //..反恐
      }
      // 获取有确认这个字段的数据
      let historyData =  this.historyFromProps.filter(item => {
        return item.includes('qr');
      });
      // 根据上面的进行过滤
      activitiInfoList.map(item => {
        historyData.forEach(val => {
          //console.log(item.taskDefinitionKey);
          if(item.taskDefinitionKey == dataObj[val]){
            this.qsjgList.push(item.hParam);
          }
        })
      })

      /* let signFor = { jgjs:'qsjgList'};
      activitiInfoList.data.forEach(item => {
        // 原来的方法放在组件里
        //  获取签收结果数据
        let key = item.taskDefinitionKey;
        //console.log('循环的结果是：', signFor[key], item);
        if (signFor[key] && item.endTime) {
          this[signFor[key]].push(item.hParam);
        }
      }); */
      console.log('结果接收的数据--获取详情', this.qsjgList);
      // console.log('签收结果数据', this.qsjgArr);



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
      let caseSourceCode = this.hdzzData.caseSourceCode;
      if (caseSourceCode === "") {
        return this.$message({
          message: "请输入案串编号！",
          type: "warning"
        });
      }
      console.warn('开始查询', caseSourceCode);
      let data = await this.$Ajax.post(hczzURL.getListSeries, {seriesNos: caseSourceCode}, true)
        .catch(err => console.log(err));
      console.warn('结束查询', data);
      console.log("aaaaaaaaaaa", data);
      if (data.data.length > 0) {
        // 如果有对应的案串编号
        this.hdzzData.caseSourceName = data.data[0].seriesName;
        this.hdzzData.caseAmount = data.data[0].caseNum;
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
            this.hdzzData.caseAmount = 1;
            this.hdzzData.caseSourceName = res.data[0].case_title;
            this.hdzzData.caseInfo = res.data[0].case_content;
            this.hdzzData.meansOfCrime = res.data[0].crime_method_type;
            this.hdzzData.caseTypeName = res.data[0].case_small_type;
            this.disabledFlagA = true;
            this.$message({
              message: "案串编号引用成功！",
              type: "success"
            });
          })
          .catch(err => {
            this.disabledFlag = false;
            this.disabledFlagA = false;
            this.hdzzData.caseAmount = "";
            this.hdzzData.caseSourceName = "";
            this.hdzzData.caseInfo = "";
            this.hdzzData.meansOfCrime = "";
            this.hdzzData.caseTypeName = "";
            this.$message({
              message: "系统未找到对应的串案/案件编号，请手动输入",
              type: "warning"
            });
          });
      }
    }
  }
}
export default {
  data() {
    //   案件数量校验规则（正整数）
    let numCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("案件数量"));
      } else {
        let reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error("请输入大于0的数字"));
        } else {
          callback();
        }
      }
    };
    return{
      ayRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseSourceCode: [
          { required: true, message: "请输入案件编号", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseSourceName: [
          { required: true, message: "请输入案件名称", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        meansOfCrime: [
          { required: true, message: "请输入作案手段", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseAmount: [
          { required: true, message: "请输入案件数量", trigger: "blur" },
          //{ min: 1, max: 50, message: "请输入1-50个字符", trigger: "blur" },
          { validator: numCheck, trigger: "blur" }
        ],
        judgmentName: [
          { required: true, message: "请输入研判人员", trigger: "blur" },
          { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
        ],
        caseTypeName: [
          { required: true, message: "请选择案件类别", trigger: "change" }
        ],
        caseInfo: [
          { required: true, message: "请输入简要案情", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        techEvide: [
          {
            type: "array",
            required: true,
            message: "请选择串并依据",
            trigger: "change"
          }
        ],
        clueFeature: [
          { required: true, message: "请输入线索特征", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        applyDesc: [
          { required: true, message: "请输入提请需求", trigger: ["blur"] },
          { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
        ],
        originFile: [{ required: true, message: "请传附件", trigger: "blur" }],
        //  协查级别
        level: [
          { required: true, message: "请选择协查级别", trigger: "change" }
        ],
        //  查询单位
        cxdw: [{ required: true, message: "请选择查询单位", trigger: "change" }]
      }
    }
  }
}
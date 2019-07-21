export default {
  /*  */
  data() {
    let numCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("案件数量"));
      } else {
        let reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      }
    };
    return {
      instructRules: {
        //  指令信息检查规则
        coprName: [
          { required: true, message: "请输入合战名称", trigger: "blur" },
          { min: 1, max: 20, message: "请输入1-20个字符", trigger: "blur" }
        ],
        caseSourceCode: [
          { required: true, message: "请输入案串编号", trigger: "blur" }
        ],
        caseSourceName: [
          {
            required: true,
            message: "请输入案串名称",
            trigger: ["blur"]
          },
          {
            min: 1,
            max: 20,
            message: "请输入1-20个字符",
            trigger: ["blur"]
          }
        ],
        meansOfCrime: [
          { required: true, message: "请输入作案手段", trigger: "blur" },
          { min: 1, max: 20, message: "请输入1-20个字符", trigger: "blur" }
        ],
        caseAmount: [
          {
            required: true,
            message: "请输入案件数量",
            trigger: ["blur"]
          },
          { validator: numCheck, trigger: "blur" }
        ],
        judgmentName: [
          { required: true, message: "请输入研判人员名称", trigger: "blur" },
          { min: 1, max: 20, message: "请输入1-20个字符", trigger: "blur" }
        ],
        caseTypeName: [
          { required: true, message: "请选择案件类别", trigger: "blur" }
        ],
        caseInfo: [
          { required: true, message: "请输入简要案情", trigger: "blur" },
          { min: 1, max: 200, message: "请输入1-200个字符", trigger: "blur" }
        ],
        techEvide: [
          { required: true, message: "请选择串并依据", trigger: "blur" }
        ],
        clueFeature: [
          { required: true, message: "请输入线索特征", trigger: "blur" }
        ],
        // 案源信息文件
        originFile: [
          { required: true, message: "请上传案源信息附件", trigger: "blur" }
        ],
        deptType: [
          { required: true, message: "请选择合战部门", trigger: "blur" }
        ],
        // 技侦
        jzQueryType: [
          {
            required: false,
            message: "请选择技术侦查查询类别",
            trigger: "blur"
          }
        ],
        jzQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        jzFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],
        // 网安
        wzQueryType: [
          {
            required: false,
            message: "请选择技术侦查查询类别",
            trigger: "blur"
          }
        ],
        wzQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        wzFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],
        // 刑侦
        spQueryType: [
          {
            required: false,
            message: "请选择技术侦查查询类别",
            trigger: "blur"
          }
        ],
        spQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        spFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],

        // 经侦
        jingzhenQueryType: [
          {
            required: false,
            message: "请选择经侦侦查查询类别",
            trigger: "blur"
          }
        ],
        jingzhenQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        jingzhenFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],
        // 反恐
        fankongQueryType: [
          {
            required: false,
            message: "请选择反恐侦查查询类别",
            trigger: "blur"
          }
        ],
        fankongQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        fankongFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],
        // 治安
        zhianQueryType: [
          {
            required: false,
            message: "请选择治安侦查查询类别",
            trigger: "blur"
          }
        ],
        zhianQueryContent: [
          { required: false, message: "请输入查询内容", trigger: "blur" }
        ],
        zhianFile: [
          { required: false, message: "请上传合成信息附件", trigger: "blur" }
        ],
    
        // 下发说明
        createConfirm: [
          { required: true, message: "请输入下发说明", trigger: "blur" },
          { min: 1, max: 200, message: "请输入1-200个字符", trigger: "blur" }
        ]
      }
    }
  }
}
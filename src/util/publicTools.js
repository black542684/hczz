//  数组去重
function uniq(array) {
  var temp = [];
  var _arr = [];
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i].fileName) == -1) {
      temp.push(array[i].fileName);
      _arr.push(array[i]);
    }
  }
  return _arr;
}
//    案件数量校验规则（正整数）
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

//  案源申请校验规则
const ayRules = {
  aymc: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
  ],
  ajbh: [
    { required: true, message: "请输入案件编号", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
  ],
  ajmc: [
    { required: true, message: "请输入案件名称", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
  ],
  zasd: [
    { required: true, message: "请输入作案手段", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
  ],
  ajsl: [
    { required: true, message: "请输入案件数量", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] },
    { validator: numCheck, trigger: "blur" }
  ],
  ypry: [
    { required: true, message: "请输入研判人员", trigger: "blur" },
    { min: 1, max: 50, message: "请输入1-50个字符", trigger: ["blur"] }
  ],
  ajlb: [
    { required: true, message: "请选择案件类别", trigger: "change" }
  ],
  jyaq: [
    { required: true, message: "请输入简要案情", trigger: ["blur"] },
    { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
  ],
  cbyj: [
    {
      type: "array",
      required: true,
      message: "请选择串并依据",
      trigger: "change"
    }
  ],
  xstz: [
    { required: true, message: "请输入线索特征", trigger: ["blur"] },
    { min: 1, max: 500, message: "请输入1-500个字符", trigger: ["blur"] }
  ],
  tqxq: [
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

// 取出两个数组中相同的数据
function getSameArray(arr1=[], arr2=[]) {
  let temp1 = [];
  let temp2 = [];
  temp1 = arr1.length > arr2.length ? arr1 : arr2;   // 更长的数组
  temp2 = arr1.length > arr2.length ? arr2 : arr1;   // 更短的数组
  return temp1.filter((item) => {
    return temp2.includes(item);
  })
}

// 对象深拷贝方法
function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key]!==null) {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export { uniq, ayRules, deepCopy };
  //生成一个公共的uuid
  export const guid=function () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

//数组对象比较方法
  export const comparearrobj = function (objproprerty) {
    return function (obj1,obj2) {
      var value1 = obj1[objproprerty];
      var value2 = obj2[objproprerty];
      return value1 - value2;
    }
  };

  //生成当前时间
  export const nowday = function () {
    let date = new Date();
    let year = date.getFullYear();
    let mounth = date.getMonth() + 1;
    let day = date.getDate();
    if (mounth >= 1 && mounth <= 9) {
      mounth = "0" + mounth;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    return year + '-' + mounth + '-' + day;
  }

  //当前时间
  export const getNowDate = function () {
    var date = new Date();
    var sign1 = "-";
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
    return currentdate;
  }

  //判断一个元素是否存在于一个数组中
  export const isInArray = function(arr,value){
    if(arr.indexOf&&typeof(arr.indexOf)=='function'){
      var index = arr.indexOf(value);
      if(index >= 0){
        return '1';
      }
    }
    return '0';
  }


// 合成信息里面的侦听器, 用于把内部的数据传递给父组件
export default {
  watch: {
    // 监听文件列表数据变化
    'instructForm.jzQueryContent'(newValue) {
      if(!this.coprDepts[0]) return;
      this.coprDepts[0].queryContent = newValue;
    },
    'instructForm.wzQueryContent'(newValue) {
      if(!this.coprDepts[1]) return;
      this.coprDepts[1].queryContent = newValue;
    },
    'instructForm.spQueryContent'(newValue) {
      if(!this.coprDepts[2]) return;
      this.coprDepts[2].queryContent = newValue;
    },
    'instructForm.jingzhenQueryContent'(newValue) {
      if(!this.coprDepts[3]) return;
      this.coprDepts[3].queryContent = newValue;
    },
    'instructForm.fankongQueryContent'(newValue) {
      if(!this.coprDepts[4]) return;
      this.coprDepts[4].queryContent = newValue;
    },
    'instructForm.zhianQueryContent'(newValue) {
      if(!this.coprDepts[5]) return;
      this.coprDepts[5].queryContent = newValue;
    },
    // 监听文件名字数据变化
    'instructForm.jzQueryType'(v) {
      if(!this.coprDepts[0]) return;
      this.coprDepts[0].queryType = v;
    },
    'instructForm.wzQueryType'(v) {
      if(!this.coprDepts[1]) return;
      this.coprDepts[1].queryType = v;
    },
    'instructForm.spQueryType'(v) {
      if(!this.coprDepts[2]) return;
      this.coprDepts[2].queryType = v;
    },
    'instructForm.jingzhenQueryType'(v) {
      if(!this.coprDepts[3]) return;
      this.coprDepts[3].queryType = v;
    },
    'instructForm.fankongQueryType'(v) {
      if(!this.coprDepts[4]) return;
      this.coprDepts[4].queryType = v;
    },
    'instructForm.zhianQueryType'(v) {
      if(!this.coprDepts[5]) return;
      this.coprDepts[5].queryType = v;
    },

  }
}
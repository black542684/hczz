<template>
  <el-container>
    <router-view></router-view>
  </el-container>
</template>
<script>
export default {
  name: "modePage",
  computed: {
    judgementName() {
      // return this.$store.getters.judgementName
      return "nan";
    }
  },
  data() {
    return {
      PatternTypeList: [
        {
          class: "iconfont icon-tuximoshi navIcon",
          judgementtype: "1",
          typename: "关系挖掘",
          link: "jsplumbapi"
        },
        {
          class: "iconfont icon-huadanmoshi navIcon",
          judgementtype: "2",
          typename: "话单分析",
          link: "calllist"
        },
        {
          class: "iconfont icon-guijimoshi navIcon",
          judgementtype: "3",
          typename: "时空分析",
          link: "locusMode"
        },
        {
          class: "iconfont icon-sousuomoshi navIcon",
          judgementtype: "4",
          typename: "全息搜索",
          link: "searchMode"
        }
      ]
    };
  },
  methods: {
    PatternType(item) {
      this.$router.push({ name: item.link });
    },
    back() {
      this.$router.push({ name: "myJudge" });
    }
  }
};
</script>
<style lang="css" scoped>
.el-container {
  height: 100%;
  /* width: 1306px; */
}
.header {
  border-bottom: 1px solid #dcdee2;
}
.headerTitle {
  line-height: 55px;
  width: 223px;
  float: left;
  font-weight: bold;
}
.headerTitle :hover {
  cursor: pointer;
}
.headerTitle .icon-fanhui {
  margin-right: 6px;
  cursor: pointer;
  font-weight: normal;
}
.translateY1 {
  display: inline-block;
  transform: translateY(1px);
}
.headerNav {
  width: calc(100% - 475px);
  height: 100%;
  float: left;
}
.modeList,
.panelList,
.otherList {
  float: left;
  height: 100%;
}
.modeList {
  width: 40%;
}
.panelList {
  width: 30%;
}
.otherList {
  width: 30%;
}
.navListItem {
  display: inline-block;
  width: 60px;
  text-align: center;
  padding-top: 10px;
  cursor: pointer;
}
.navListItem:hover {
  color: #5cadff;
}
.navListItem.active {
  color: #2d8cf0;
}
.navIcon {
  display: block;
  font-size: 19px;
}
.headerAction {
  width: 252px;
  float: left;
}
</style>

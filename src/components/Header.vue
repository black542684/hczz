<template>
  <div class="header">
    <el-row :gutter="0" class="header-handle">
      <el-col :span="6">aaa</el-col>
      <el-col :span="8" :offset="6">
        <el-button icon="el-icon-search">代办提醒</el-button>
        <el-button icon="el-icon-search">待串案件</el-button>
        <el-button icon="el-icon-search">系统配置</el-button>
      </el-col>
      <el-col :span="4">
        <span class="demonstration">click 激活</span>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            下拉菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check-outline">蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#004479"
      text-color="#ccdae4"
      active-text-color="#ffffff"
    >
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">一键搜索</el-menu-item>
      <el-menu-item index="3">案件串并</el-menu-item>
      <el-menu-item index="4">作战指令</el-menu-item>
      <el-menu-item index="5">合成作战</el-menu-item>
      <el-menu-item index="6">案件预警</el-menu-item>
      <el-menu-item index="7">布控比中</el-menu-item>
      <el-menu-item index="8">话单研判</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
//  定义语法糖
@bg: background; //  背景色
@pos: position; //  定位
@fs: font-size; //  字号
@fw: font-weight; //  字体粗细
@lh: line-height; //  行高

//  修改ElementUI头部默认样式
/deep/.el-menu.el-menu--horizontal {
  border-bottom: 0 !important;
  padding-left: 40px;

  & > .el-menu-item {
    height: 40px;
    @{lh}: 40px;
    border-bottom: 0 !important;
  }
  & > .el-menu-item.is-active {
    @{bg}: #003158 !important;
  }
}

// .header-handle{

// }
</style>

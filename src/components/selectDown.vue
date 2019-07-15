<template>
  <div @click.stop="onToggle" class="box">
    <input class="inputBox" :style="{width: width + 'px', height: height + 'px', lineHeight: height - 2 + 'px'}" type="text" disabled v-model="label" :placeholder="placeholderText">
    <i class="el-icon-arrow-down" :class="{rotate: isShow}"></i>
    <ul :style="{width: width + 'px', top: height + 5 + 'px', maxHeight: height * 5 + 2 + 'px'}" class="list" v-show="isShow" ref="main1">
      <li :style="{height: height + 'px', lineHeight: height + 'px'}" v-for="(item, index) in data" :title="item[defaultProps.name]" :key="index" @click="onChange(item)">{{item[defaultProps.name]}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'selectDown',
  props: {
    placeholderText: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 210
    },
    height: {
      type: Number,
      default: 30
    },
    val: String, // 当前值
    valId: String, // 当前值的ID
    data: Array, // 列表数据
    defaultProps: {
      type: Object,
      default: function () {
        return {name: 'name'}
      }
    },
    defaultId: {
      type: String,
      default: 'id'
    }
  },
  watch: {
    val (val) {
      this.label = val
    },
    valId (val) {
      if (val === '') {
        this.label = ''
        return
      }
      for (let i = 0; i < this.data.length; i++) {
        const el = this.data[i]
        if (val === el[this.defaultId]) {
          this.label = el[this.defaultProps.name]
          break
        }
      }
    }
  },
  data () {
    return {
      isShow: false,
      label: ''
    }
  },
  // mounted () {
  //   // 默认选中第一个
  //   if (this.val !== '') {
  //     this.label = this.val
  //   }
  // },
  methods: {
    onChange (item) {
      this.label = item[this.defaultProps.name]
      this.$emit('change', item)
    },
    onToggle () {
      this.isShow ? this.hide() : this.show()
    },
    show () {
      this.isShow = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.isShow = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (!this.$refs.main1.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="css" scoped>
.box {
  position: relative;
  display: inline-block;
  z-index: 901;
}
.box > input {
  height: 30px;
  border-radius: 4px;
  border: solid 1px #ddd;
  background-color: #fff;
  padding-left: 5px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 12px;
}
.el-icon-arrow-down {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: transform 0.4s;
  cursor: pointer;
  font-size: 10px;
}
.el-icon-arrow-down.rotate {
  transform: translateY(-50%) rotate(180deg);
}
.list {
  position: absolute;
  top: 35px;
  border-radius: 2px;
  border: solid 1px #eeeeee;
  max-height: 152px;
  overflow-y: auto;
  background-color: #fff;
  z-index: 2000;
  font-size: 12px;
}
.list > li {
  text-align: left;
  padding-left: 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list > li:hover {
  background-color: #F5F8FD;
}
</style>

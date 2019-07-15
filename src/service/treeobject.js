// export const MenuTree = function (id, label, isSelected, rolemenupid, nodeurl) {
//   this.id = id
//   this.label = label
//   this.isSelected = isSelected
//   this.rolemenupid = rolemenupid
//   this.nodeurl = nodeurl
// }
// export default MenuTree.prototype.setChildren = function (children) {
//   this.children = children
// }
// 解析tree数据
export const chkVal = function (arrayVal) {
  let children = []
  for (let i = 0; i < arrayVal.length; i++) {
    let nodemsg = arrayVal[i]
    nodemsg.isEdit = false
    if (nodemsg.pid === '0') {
      children[children.length] = nodemsg
      arrayVal.splice(i, 1)
      i--
    }
  }
  for (let i = 0; i < children.length; i++) {
    findVal(children[i], arrayVal)
  }
  // return JSON.parse(JSON.stringify(children).replace('MenuTree', ''))
  return children
}
// 递归查找节点数据
export const findVal = function (node, arrays) {
  let id = node.uid
  let children = []
  for (let i = 0; i < arrays.length; i++) {
    let el = arrays[i]
    if (id === el.pid) {
      children[children.length] = el
      arrays.splice(i, 1)
      i--
      findVal(el, arrays)
    }
  }
  if (children.length !== 0) {
    node.children = children
  }
}

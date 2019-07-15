// import 'http://api.map.baidu.com/api?v=2.0&ak=nNe0G8TVhpEgzi8CPuxZnk2V1dcTwzPf'
import '../../static/offlinemap/map'
import {baseURL} from './api'

let url = (process.env.NODE_ENV !== 'production' ? '../../../../' : window.g.apiUrl)
function ComplexCustomOverlay (point, data, addClick) {
  this._point = point
  this._eventData = data
  this._list = data.nodeList
  this._addClick = addClick
}
ComplexCustomOverlay.prototype = new BMap.Overlay()
ComplexCustomOverlay.prototype.initialize = function (map) {
  this._map = map
  var div = this._div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
  div.style.backgroundColor = '#fff'
  div.style.border = '1px solid #dcdee2'
  // div.style.color = 'white'
  div.style.width = '182px'
  // div.style.width = '200px'
  // div.style.overflowY = 'auto'
  // div.style.padding = '2px'
  div.style.lineHeight = '39px'
  div.style.whiteSpace = 'nowrap'
  div.style.MozUserSelect = 'none'
  div.style.fontSize = '12px'
  for (let i = 0; i < this._list.length; i++) {
    const el = this._list[i]
    let p = document.createElement('p')
    if (i !== this._list.length - 1) {
      p.style.borderBottom = '1px solid #dcdee2'
    }
    p.className = 'mapTipsItem'
    p.style.paddingLeft = '10px'
    p.style.cursor = 'point'
    let text = (i + 1) + '. ' + el.resource_showname + ' 活动次数 ' + el.count
    p.appendChild(document.createTextNode(text))
    this._addClick(p, this._eventData, el)
    div.appendChild(p)
  }
  // var that = this

  var arrow = this._arrow = document.createElement('div')
  arrow.style.background = 'url(' + url + 'static/images/arrow.png) no-repeat'
  arrow.style.position = 'absolute'
  arrow.style.width = '15px'
  arrow.style.height = '8px'
  arrow.style.top = this._list.length * 40 - 1 + 'px'
  arrow.style.left = parseInt(this._div.style.width) / 2 - 9 + 'px'
  arrow.style.overflow = 'hidden'
  div.appendChild(arrow)

  map.getPanes().labelPane.appendChild(div)

  return div
}
ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map
  var pixel = map.pointToOverlayPixel(this._point)
  console.log(this._div.offsetHeight, 'height')
  this._div.style.left = pixel.x - parseInt(this._div.style.width) / 2 + 'px'
  this._div.style.top = pixel.y - this._list.length * 40 - 35 + 'px'
}

export default ComplexCustomOverlay

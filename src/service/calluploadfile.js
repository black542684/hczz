import Vue from 'vue'
import { Loading } from 'element-ui'

var loading_
function startLoading () {
  loading_ = Loading.service({
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoadingsuccess () {
  loading_.close()
}
function endLoading () {
  setTimeout(() => {
    loading_.close()
  }, 200)
}

export const calluploadfile = function (uploadbtnid, fileid, httpurl) {
  var fileupdatas = ''
  var formData = new FormData()
  var userinfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
  var uploaderid = userinfo.loginName

  formData.append('file', document.getElementById(fileid).files[0])
  formData.append('uploaderid', uploaderid)
  var url = httpurl + 'callListAanlysis/reloadFile'
  startLoading()
  $.ajax({
    url: url,
    type: 'POST',
    async: false,
    data: formData,
    contentType: false,
    processData: false,
    success: function(data) {
      endLoadingsuccess()
      fileupdatas = data
    },
    error: function(error) {
      endLoading()
      console.log(error)
    }
  });
  return fileupdatas
};

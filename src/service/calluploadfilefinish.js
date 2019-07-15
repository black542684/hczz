import Vue from 'vue'
import { Loading } from 'element-ui'

var loading_
function startLoading () {
  loading_ = Loading.service({
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}
function endLoadingsuccess () {
  loading_.close()
}
function endLoading () {
  setTimeout(() => {
    loading_.close()
  }, 200)
}
export const calluploadfilefinish = function (uploadbtnid, fileid, paramsobj, httpurl) {
  startLoading()
  var fileupdatas = ''
  var formData = new FormData()

  formData.append('templetFile', document.getElementById(fileid).files[0])
  formData.append('userid', paramsobj.userid)
  formData.append('callid', paramsobj.callid)
  formData.append('phone', paramsobj.phone)
  formData.append('owername', paramsobj.owername)
  formData.append('phoneAddress', paramsobj.phoneAddress)
  formData.append('idcard', paramsobj.idcard)
  formData.append('phonetype', paramsobj.phonetype)
  formData.append('configid', paramsobj.configid)
  formData.append('year', paramsobj.year)

  if (paramsobj.detail) {
    var detailarr = JSON.stringify(paramsobj.detail)
    formData.append('detail', detailarr)
  } else {
    formData.append('detail', '')
  }
  if (paramsobj.startRow) {
    formData.append('startRow', paramsobj.startRow)
  } else {
    formData.append('startRow', 0)
  }
  var url = httpurl + 'callListAanlysis/saveTemplet'
  $.ajax({
    url: url,
    type: 'POST',
    async: false,
    data: formData,
    contentType: false,
    processData: false,
    success: function (data) {
      endLoadingsuccess()
      fileupdatas = data
    },
    error: function (error) {
      endLoading()
      console.log(error)
    }
  })
  return fileupdatas
}

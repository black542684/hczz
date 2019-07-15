import axios from 'axios'
import qs from 'qs' // axios发送的数据不是json格式，若需要json格式，添加此库
import config from '../../config'
// axios.defaults.withCredentials = true
// import {getSessiontoken} from "./UtilService";
// import {saveSessiontoken} from "./UtilService";
// import {delSessiontoken} from "./UtilService";
// var serviceUrl = window.g.ApiUrl;

// Add a request interceptore
axios.interceptors.request.use(config => {
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(response => {
  // console.log(response, 'response')
  let data = response.data
  //   console.log(data);
  //   if (typeof data === 'string') {       //
  //     data = JSON.parse(data)
  //   }
  if (data.CODE) {
    if (data.CODE === 200 || data.code === 200) {
      return data.RESULT || data.result
    } else {
      throw data
    }
  }
  // else if (data.status) {
  //   if (data.status === 200) {
  //     return data.data
  //   } else {
  //     Message({
  //       type: 'info',
  //       message: data.err
  //     })
  //     return data;
  //   }
  // }
  else {
    return data
  }
}, function (error) {
  var status=error.response.status;
  if(status === 401){  //权限登录系统无权限处理
  window.location.href = baseURL + "/check/casLogin";
  return Promise.reject(error)
  }
  return Promise.reject(error)
})

const prodBaesUrl = window.g.apiUrl
const baseURL = (process.env.NODE_ENV !== 'production' ? config.dev.httpUrl : prodBaesUrl)
// axios.defaults.baseURL = (process.env.NODE_ENV !== 'production' ? config.dev.httpUrl : config.build.httpUrl)
// export default axios
// const baseURL = (process.env.NODE_ENV !== 'production' ? config.dev.httpUrl : config.build.httpUrl)
// const baseURL = (process.env.NODE_ENV !== 'production' ? config.dev.httpUrl : serviceConfig.ApiUrl)
export default {
  get(url, params, token) {
    return axios({
      method: 'get',
      url: baseURL + url,
      params,
      withCredentials: true,
      // timeout: 30000
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'token': token
      }
    })
  },
  post(url, data, ifJSON, token) {
    ifJSON = ifJSON || false;
    return axios({
      method: 'post',
      url: baseURL + url,
        // data: qs.stringify(data),
    //   params:data,
      data: data,
      // timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': ifJSON ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'Content-Type': 'application/json; charset=UTF-8',
        'token': token
      }
    })
  },
  postParams(url, data, ifJSON, token) {
    ifJSON = ifJSON || false;
    return axios({
      method: 'post',
      url: baseURL + url,
        // data: qs.stringify(data),
      params:data,
    //   data: data,
      // timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': ifJSON ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'Content-Type': 'application/json; charset=UTF-8',
        'token': token
      }
    })
  },
  form(url, formdata) {
    return axios({
      method: 'post',
      url: baseURL + url,
      data: formdata,
      withCredentials: true,
      // timeout: 30000
      headers: {
        'Content-Type': 'multipart/form-data'
        // 'token':token
      }
    })
  },
  newApi(method, url, data, token) {
    return axios({
      method: method,
      url: url,
      data: qs.stringify(data),
      // timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'token': token
      }
    })
  },
  buildFormDataWith(data) {
    let postData = new FormData()
    for (let d in data) {
      if (typeof data[d] === 'object') {
        postData.append(d, JSON.stringify(data[d]))
      } else {
        postData.append(d, data[d])
      }
    }
    return postData
  },
  baseURL: baseURL
}

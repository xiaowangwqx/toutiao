/**
 * 请求模块
 */
import store from '@/store'
import axios from 'axios'
// import JSONBig from 'json-bigint';

// JSONBig.parse()  //把JSON格式的字符串 转为javaScript对象
// JSONBig.stringify()   把JavaScript对象转为JSON格式的字符串
// JSONBig可以处理数据中超出JavaScript安全整数的范围的问题
// 使用的时候 要把bigNumber 转为字符串来使用

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 接口的基准路径

  // 自定义后端返回的原始数据
  // transformRequest: [function(data) {
  //     try {
  //         return JSONBig.parse(data)
  //     } catch (error) {
  //         return data
  //     }

  // }]
})

// 请求拦截器
// 统一注入token
request.interceptors.request.use(
  function (config) {
    // 请求发起会经过这里
    // config是本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config);
    return config
  },
  function (error) {
    // 如果请求出错 （还没有发出去）
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request

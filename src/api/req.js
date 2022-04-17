import axios from 'axios';
import env from './env';
import _public from '@/public/public';
import constant from '@/public/constant';
import router from '@/router';
import { Dialog } from 'vant';

// 每次请求生成一次取消token
const { CancelToken } = axios;
const source = CancelToken.source();


// axios 默认设置
axios.defaults.retry = 5;
axios.defaults.retryDelay = 1000;
// axios 拦截器
axios.interceptors.response.use(
    response => {
      //登录失效的时候重定向为登录页面
      if (response.data.code == -11) {
        // userLogout()
        return response
      } else if (response.data.code == 21 || response.data.code == -21 || response.data.code == 22) {
        // 21:更换jwt
        if (response.data.code == 21 || response.data.code == 22) {
            _public.saveStorage("token", response.data.data);
        }
        // 判断是否配置了重试      
        var config = response.config
        if (!config || !config.retry) return response;
        // 设置重置次数，默认为0      
        config.__retryCount = config.__retryCount || 0;
        // 判断是否超过了重试次数      
        if (config.__retryCount >= config.retry) {
            // userLogout()
            return response
        }
        config.__retryCount += 1;
        // 延时
        var backoff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve();
          }, config.retryDelay || 1);
        });
  
        //重新发起axios请求              
        return backoff.then(function () {
          var jwt = _public.getStorage('token');
          if (jwt.list == undefined) {
            config.headers.authorization = _public.getStorage('token');
          }
          return axios(config);
        });
      } else if (response.data.code == -31 ) {
        noAuthority()
        return response
      }
      else {
        return response
      }
    },
    // error => {
    //   var config = error.config;
    //   // 判断是否配置了重试
    //   if (!config || !config.retry) return Promise.reject(error);
  
    //   // 设置重置次数，默认为0
    //   config.__retryCount = config.__retryCount || 0;
  
    //   // 判断是否超过了重试次数
    //   if (config.__retryCount >= config.retry) {
    //     if (config.url.indexOf('/account/exit') != -1) {
    //         _public.removeStorage('token');
    //         _public.removeStorage('userInfo');
    //         router.push("/login");
    //     }
    //     else {
    //         userLogout();
    //     }
    //     return Promise.reject(error);
    //   }
    //   //重试次数自增
    //   config.__retryCount += 1;
    //   //延时处理
    //   var backoff = new Promise(function (resolve) {
    //     setTimeout(function () {
    //       resolve();
    //     }, config.retryDelay || 1);
    //   });
    //   //重新发起axios请求
    //   return backoff.then(function () {
    //     return axios(config);
    //   });
    // }
)

// 用户退出登录
const userLogout = function () {  
    Dialog.alert({
        title: '提示',
        message: '登录已过期，请重新登录'
    }).then(() => {
        // on close
        // 直接退出不清空 redis
        _public.removeStorage('token');
        _public.removeStorage('userInfo');
        router.push("/login");
        
        // api.userLogout({
        //     uid: _public.getStorage('userInfo').id,
        //     systemId: constant.systemId
        // }).then(function (res) {  
        //     _public.removeStorage('token');
        //     _public.removeStorage('userInfo');
        //     router.push("/login");
        // });
    });
}

// 无权限访问
const noAuthority = function () {
    Dialog.alert({
        title: '提示',
        message: '无权限访问'
    }).then(() => {
        // on close
    });
}


// 封装请求方法
export const req = function(baseUrl, method, url, params, isOriginalGET, timeout, isLogin) {
    !params && (params = {});
    let config = {
        method: method,
        url: `${env[baseUrl]}${url}`,
        timeout: 30000,
        headers: {
            systemId: constant.systemId,
            // device: 'APP'
            device: window.reqDeviceType,
        }
    };

    console.log(method,timeout,'method,timeout')
    // 设置超时
    if(timeout){
        config.timeout = timeout;
    }
    // 定义请求头
    if(!timeout){
        // config.headers = {
        //     'authorization': _public.getStorage('token'),
        //     'uid': _public.getStorage('userInfo').id,
        //     'systemId': constant.systemId,
        //     'device': 'APP'
        // };
        config.headers.authorization = _public.getStorage('token');
        config.headers.uid = _public.getStorage('userInfo').id;
    }

    console.log(method,'method')
    // 定义传参方法
    method = method.toUpperCase();
    if (method == 'GET') {
        if(isOriginalGET){
            // 传统GET方法传参
            config.params = params;
        } else {
            // 现有地址栏拼接字符串方法传参
            config.url += `/${encodeURIComponent(JSON.stringify(params))}`
        }
    } else {
        config.data = params;
    }

    // 加入时间戳
    //config.url += `?${Date.parse(new Date())}`;
    console.log(config,'config')

    return axios(config);
}

// 封装请求方法
export const req2 = function({baseUrl, method, url, params, isOriginalGET, timeout, isLogin, cancel_callback, isNeedLimit}) {

  // console.log(url,source.token,'source.token')

  // 控制是否退出请求
  var isBack = false; 

  if(url == 'qmTblInspectionbill/saveTblInspectionbillInfo'){
    isBack = judgeIsExpire(200)
  }
  
  if(url == 'qmMstPerconfig/list' && isNeedLimit){
    isBack = judgeIsExpire()
  }

  // 判断是否过期
  function judgeIsExpire(overTimespan){
    if(localStorage['REQ_CANCEL_LIST']){
      var REQ_CANCEL_LIST = JSON.parse(localStorage['REQ_CANCEL_LIST'])
      var obj;
      var nowDate = new Date().getTime();

      if(Object.prototype.toString.call(REQ_CANCEL_LIST) == '[object Array]'){
        // 旧数据
        // 第一次请求 可请求 计算过期时间
        recordExpire(url,true,overTimespan)
      }else{
        if(REQ_CANCEL_LIST[url]){
          // 存在保存检验单的过期时间
          obj = REQ_CANCEL_LIST[url]
        }else{
          // 数据出错 计算过期时间
          recordExpire(url,false,overTimespan)
        }
      }

      if(obj){
        if(nowDate > obj.expireDate){
          // 已超过过期时间 可请求 重新计算过期时间
          console.log('已超过过期时间 可请求',url,new Date())
          recordExpire(url,false,overTimespan)
        }else{
          // 未超过过期时间 返回
          if(cancel_callback){
            Dialog.alert({
                title: '提示',
                message: '1分钟内只能提交一次，还有' + parseInt((obj.expireDate - nowDate) / 1000) + '秒' 
            }).then(() => {
                // 将loading去掉
                cancel_callback()
            });
          }else{
            console.log('1分钟内只能查询一次',url,'还有' +  parseInt((obj.expireDate - nowDate) / 1000) + '秒' )
          }
          return true;
        }
      }else{
        console.log('第一次请求')
      }
    }else{
      // 第一次请求 可请求 计算过期时间
      recordExpire(url,false,overTimespan)
    }
  }
  
  // 计算过期时间
  function recordExpire(url,isOld,overTimespan){
    var REQ_CANCEL_LIST = localStorage['REQ_CANCEL_LIST'] ? 
      JSON.parse(localStorage['REQ_CANCEL_LIST']) : {}

    if(isOld){
      REQ_CANCEL_LIST = {}
    }

    if(!overTimespan || overTimespan == ""){
      overTimespan = 59*1000
    }

    var obj = {
      url:url,
      expireDate:new Date().getTime() + parseInt(overTimespan)
    }

    console.log('更新超时时间',url,new Date())

    REQ_CANCEL_LIST[url] = obj

    localStorage['REQ_CANCEL_LIST'] = JSON.stringify(REQ_CANCEL_LIST)
  }

  if(isBack){
    return ; 
  }

  !params && (params = {});
  let config = {
      method: method,
      url: `${env[baseUrl]}${url}`,
      timeout: 20000,
      headers: {
          systemId: constant.systemId,
          // device: 'APP'
          device: window.reqDeviceType,
      }
  };
  // 设置超时
  if(timeout){
      config.timeout = timeout;
  }
  // 定义请求头
  if(!isLogin){
      // config.headers = {
      //     'authorization': _public.getStorage('token'),
      //     'uid': _public.getStorage('userInfo').id,
      //     'systemId': constant.systemId,
      //     'device': 'APP'
      // };
      config.headers.authorization = _public.getStorage('token');
      config.headers.uid = _public.getStorage('userInfo').id;
  }
  // 定义传参方法
  method = method.toUpperCase();
  if (method == 'GET') {
      if(isOriginalGET){
          // 传统GET方法传参
          config.params = params;
      } else {
          // 现有地址栏拼接字符串方法传参
          config.url += `/${encodeURIComponent(JSON.stringify(params))}`
      }
  } else {
      config.data = params;
  }

  // 加入时间戳
  //config.url += `?${Date.parse(new Date())}`;

  return axios(config);
}


export default {
  req,
  req2
};


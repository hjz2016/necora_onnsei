import {
  req
} from './req';

export default {
  auth_getData: (data) => req('auth', 'GET', '/', data, 1, null, 1), //获取网站概况
  // getToken: (data) => req('auth', 'get', 'account/register', data, 1, null, 1), //获取登录token
  // login: (data) => req('auth', 'post', 'account/login', data, null, null, 1), //登录新接口
}

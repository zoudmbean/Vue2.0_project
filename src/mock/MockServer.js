/*
* MockJS用于模拟ajax请求
* */
import Mock from 'mockjs'
import data from './data'

// 根据经纬度获取商铺列表
Mock.mock('/shops',{"result":"SUCCESS","data":data.shops});

// 获取一次性验证码
Mock.mock('/sendcode',{"result":"SUCCESS","data":data.sendcode});

// 手机号登陆
// Mock.mock('/login_sms',{"result":"SUCCESS","data":data.login_sms});
Mock.mock('/login_sms', (options) =>{
  // 最佳实践，将请求和参数都打印出来，以便调试
  return Mock.mock(data.login_sms);
});

// 用户名密码登录
Mock.mock('/login_pwd', (options) =>{
  // 最佳实践，将请求和参数都打印出来，以便调试
  return Mock.mock(data.login_pwd);
});

// 获取用户信息
Mock.mock('/userinfo', {"result":"SUCCESS","data":data.userInfo});

// 获取用户信息
Mock.mock('/logout', {"result":"SUCCESS"});


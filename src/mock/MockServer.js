/*
* MockJS用于模拟ajax请求
* */
import Mock from 'mockjs'
import data from './data'
import shop from './shop'

// 1、根据经纬度获取位置详情
Mock.mock('/position',{"result":"SUCCESS","data":data.position});

// 2、获取食品分类列表
Mock.mock('/index_category',{"result":"SUCCESS","data":data.foodCategory});

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

// 获取商家信息
Mock.mock('/info',{"result":"SUCCESS","data":data.info})

// 获取商家商品
Mock.mock('/goods',{"result":"SUCCESS","data":data.goods})

// 获取商家商品
Mock.mock('/ratings',{"result":"SUCCESS","data":data.ratings})

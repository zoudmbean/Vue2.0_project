/*
* MockJS用于模拟ajax请求
* */
import Mock from 'mockjs'
import data from './data'

// 根据经纬度获取商铺列表
Mock.mock('/shops',{"result":"SUCCESS","data":data.shops});


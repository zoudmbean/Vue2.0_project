/*
* 入口JS
* */
import Vue from 'vue'
import App from './App'

import router from './router/route.js'
import store from './store'

import './mock/mockServer' // 加载mockServer即可

/*
* 解决重复路由报错的问题
* */
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

/*
* 主入口
* */
new Vue({
  el:'#app',
  render:h => h(App),
  router,
  store, // 使用上vuex
})

/*
* 入口JS
* */
import Vue from 'vue'
import App from './App'

// 引入mint-ui
import {Button} from 'mint-ui'

import router from './router/route.js'
import store from './store'

import './mock/mockServer' // 加载mockServer即可
import loading from './common/imgs/loading.gif'
import './fiters' // 加载过滤器

/*
* 解决重复路由报错的问题
* */
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

// 注册全局组件
Vue.component(Button.name,Button);

/*
* 主入口
* */
new Vue({
  el:'#app',
  render:h => h(App),
  router,
  store, // 使用上vuex
})

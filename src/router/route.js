import Vue from 'vue'
import VueRouter from 'vue-router'

import MSite from '../pages/MSite/MSite'
import Order from '../pages/Order/Order'
import Profile from '../pages/Profile/Profile'
import Search from '../pages/Search/Search'
import Login from '../pages/Login/Login'
import Shop from '../pages/Shop/Shop'
import ShopRatting from '../pages/Shop/ShopRatting/ShopRatting'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo'

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    {
      path:'/msite',
      component:MSite,
      meta:{
        showFooter:true
      }
    },
    {
      path:'/order',
      component: Order,
      meta:{
        showFooter:true
      }
    },
    {
      path:'/profile',
      component:Profile,
      meta:{
        showFooter:true
      }
    },
    {
      path:'/search',
      component:Search,
      meta:{
        showFooter:true
      }
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/',
      redirect:'/msite'
    },
    {
      path:'/shop',
      component:Shop,
      children:[
        {
          path:'goods',
          component:ShopGoods
        },
        {
          path:'ratting',
          component:ShopRatting
        },
        {
          path:'info',
          component:ShopInfo
        },
        {
          path:"",
          redirect:'goods'
        }
      ]
    }
  ]
})

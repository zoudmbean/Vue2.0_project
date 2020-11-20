<template>
  <section class="msite">
    <!--首页头部-->
    <TopHeader :title="address.name">
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link class="header_login" slot="right" :to="userInfo._id ? '/userInfo' : '/login'">
        <span class="header_login_text">
          <span v-if="!userInfo._id">登录|注册</span>
          <i class="iconfont icon-person" v-else></i>
        </span>
      </router-link>
    </TopHeader>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(category,index) in categorysArr" :key="index+Math.random()">
            <a href="javascript:" class="link_to_food" v-for="c in category" :key="c.id">
              <div class="food_container">
                <img :src="c.image_url">
              </div>
              <span>{{c.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./msite_back.svg" alt="back" v-else/>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <!-- shopList不用vuex，用属性传值的方式来完成  原因是，练习一下传值问题 -->
      <ShopList :shops="shops"/>
    </div>
  </section>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  import {mapState,mapActions} from 'vuex'

  import TopHeader from '../../components/TopHeader/TopHeader'
  import ShopList from '../../components/shopList/ShopList'

  export default {
    name: 'MSite',
    mounted () {
      // 初始化分类
      this.getCategorys();
      // 初始化首页商家列表
      this.getShops();
    },
    computed:{
      ...mapState(['address','shops','categorys','userInfo']),
      categorysArr(){

        const { categorys } = this
        // 定义空的二维数组
        const arr = [];
        // 定义小数组
        let minArr = [];

        // 遍历categorys
        this.categorys.forEach(c => {
          // 如果minArr满了（最大元素个数为8个），置空
          if(minArr.length == 8){
            minArr = [];
          }
          // 如果minArr是空的, 将小数组保存到大数组中
          if(minArr.length == 0){
            arr.push(minArr);
          }
          // 将当前分类保存到小数组中
          minArr.push(c);
        });

        return arr;
      }
    },
    watch:{
      categorys(value){
        // 界面更新就立即创建swiper对象
        // $nextTick 表示一旦界面完成更新，就立即它的回调函数，注意，此语句要写在数据更新之后，一般与watch结合使用
        this.$nextTick(() => {
          // 初始化swiper
          new Swiper ('.swiper-container', {
            //direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },

            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar',
            },
          })
        });
      }
    },
    methods:{
      ...mapActions(['getShops','getCategorys'])
    },
    components:{
      TopHeader,
      ShopList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>

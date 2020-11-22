<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!-- 选中了才给样式 current -->
          <li class="menu-item" v-for="(good,index) in goods" :key="index">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}} </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul>
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food,index) in good.foods" :key="index">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content"><h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra"><span class="count">月售 {{food.sellCount}} 份</span> <span>好评率 {{food.rating}}%</span></div>
                  <div class="price"><span class="now">￥{{food.price}}</span></div>
                  <div class="price" v-if="food.oldPrice"><span class="old">￥{{food.oldPrice}}</span></div>
                  <div class="cartcontrol-wrapper"> CartControl</div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  // 引入better-scroll
  import BScroll from 'better-scroll'
  export default {
    name: 'ShopGoods',
    mounted () {
      // 在MSite中，通过watch与$nextTick监听列表展示执行某段代码
      // 这里使用另一种方式，回调函数+$nextTick的方式    当数据更新之后，在回调函数中执行需要执行的代码
      // 在接收方只需要调用函数，这里的回调函数就可以执行
      /*
      * // 异步获取商家商品列表   callback为传入的回调函数
          async getShopGoods({commit}, callback) {
            const result = await reqShopGoods()
            if (result.result === 'SUCCESS') {
              const goods = result.data
              commit(RECEIVE_GOODS, {goods})
              // 数据更新了, 通知一下组件（调用回调函数执行逻辑）
              callback && callback()
            }
          },
      * */
      this.$store.dispatch('getShopGoods',() => {
        this.$nextTick(() => {    // 列表数据更新显示之后执行
          // 需要列表显示之后创建对象
          /*官网写法
          * const bs = new BScroll('.wrapper', {
              pullUpLoad: true,
              scrollbar: true,
              pullDownRefresh: true
              // and so on
            })
          * */
          new BScroll('.menu-wrapper');
          new BScroll('.foods-wrapper');
        });
      })
    },
    computed: {
      ...mapState(['goods'])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>


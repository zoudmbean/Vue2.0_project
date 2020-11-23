<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!-- 选中了才给样式 current  当 index等于当前分类currentIndex下标的时候，显示 -->
          <li class="menu-item" v-for="(good,index) in goods" :key="index"
              :class="{current:index===currentIndex}"
          @click="clickMenuItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}} </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUl">
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
                  <div class="cartcontrol-wrapper">
                    <CarControl :food="food"/>
                  </div>
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
  import CarControl from '../../../components/CarControl/CarControl'
  export default {
    name: 'ShopGoods',
    data(){
      return {
        scrollY:0,      // 在滑动过程中，实时收集 Y 坐标
        tops:[],        // 列表第一次显示的后
      }
    },
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
          // 1. 初始化滚动条
          this._initScroll();
          // 2. 初始化tops
          this._initTops();
        });
      })
    },
    computed: {
      ...mapState(['goods']),
      // 计算得到当前分类的下标
      currentIndex(){       // 初始和相关数据发生了变化就会执行
        // 1.得到条件数据
        const {scrollY,tops} = this;

        // 2. 根据条件计算结果（当 当前scrollY = tops的某个元素的时候，返回其下标值）
        const index = tops.findIndex((top,index) => {

          // 当 当前scrollY 大于等于 tops中的某个元素并且小于其下一个top的时候，返回top
          return scrollY >= top && scrollY < tops[index + 1]

        });

        // 3. 返回
        return index;
      }
    },
    methods:{
      // 初始化tops
      _initTops(){
        // 1. 初始化tops
        const tops = [];
        let top = 0;      // 初始为0
        tops.push(top);
        // 2. 收集
        //    2.1 找到所有分类的li的伪装数组  这里使用$ref.foodsUl是为了缩小查找范围，从ref="foodsUl"的标签下开始查找
        //        const list = this.$ref.foodsUl.children;
        const list = this.$refs.foodsUl.getElementsByClassName("food-list-hook");
        //    2.2 将伪数组转成真数组
        let listArray = Array.prototype.slice.call(list);
        //    2.3 循环遍历，并计算每一个li标签的top坐标
        listArray.forEach( li => {
          /* 预备知识
          *   网页可见区域高：document.body.clientHeight
              网页正文全文高：document.body.scrollHeight
              网页可见区域高（包括边线的高）：document.body.offsetHeight
              网页被卷去的高：document.body.scrollTop
              屏幕分辨率高：window.screen.height
              *
              每个HTML元素都具有clientHeight offsetHeight scrollHeight offsetTop scrollTop 这5个和元素高度、滚动、位置相关的属性

              clientHeight和offsetHeight属性和元素的滚动、位置没有关系它代表元素的高度，
              其中：clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度。对于inline的元素这个属性一直是0，单位px，只读元素。
              offsetHeight：包括padding、border、水平滚动条，但不包括margin的元素的高度。对于inline的元素这个属性一直是0，单位px，只读元素。
              接下来讨论出现有滚动条时的情况：
                当本元素的子元素比本元素高且overflow=scroll时，本元素会scroll，这时：
                scrollHeight: 因为子元素比父元素高，父元素不想被子元素撑的一样高就显示出了滚动条，在滚动的过程中本元素有部分被隐藏了，
                scrollHeight代表包括当前不可见部分的元素的高度。而可见部分的高度其实就是clientHeight，也就是scrollHeight>=clientHeight恒成立。
                在有滚动条时讨论scrollHeight才有意义，在没有滚动条时scrollHeight==clientHeight恒成立。单位px，只读元素。
              scrollTop: 代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时scrollTop==0恒成立。单位px，可读可设置。
              offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
              offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
          *
          * */
          top += li.clientHeight    // 可见区域高
          tops.push(top);
        });

        // 3. 更新状态
        this.tops = tops;
      },
      // 初始化滚动条
      _initScroll(){
        // 需要列表显示之后创建对象
        /*官网写法
        * const bs = new BScroll('.wrapper', {
            pullUpLoad: true,
            scrollbar: true,
            pullDownRefresh: true
            // and so on
          })
        * */
        this.menuWrapper = new BScroll('.menu-wrapper',{
          click:true        // 让点击事件生效
        });

        /*
        * 食品列表滚动：
        *   配置对象属性有很多：
        *     probeType：默认值为0，表示不派发事件，可取值有1 2 3 三个值。
        *       作用：获取滚动位置的参数。1 非实时   2 在屏幕滚动的时候实时派发scroll事件  3 派发最频繁，只要有滑动就会派发，包括惯性滑动
        * */
        this.foodWrapper = new BScroll('.foods-wrapper',{
          click:true,
          probeType:2   // 惯性滑动不会触发
        });

        /*
          给food列表绑定滚动监听（派发事件）
        * 回调函数的参数可以是一个event，event中有xy坐标，也可以是{x,y}
        * */
        this.foodWrapper.on('scroll',({x,y}) => {
          // console.log(y);
          this.scrollY = Math.abs(y);
        });

        /*绑定滚动结果监听
          现在的问题是：当滚动惯性滑到到最后面的时候，因为probeType的值为2，所以，惯性滑动不会触发事件派发，因此tops中没有滚动结束时候的坐标值
          解决方式：
            方式一：将probeType的值改为3  该方式效果好，但是，性能消耗大
            方式二：添加滚动结束监听
        *
        * */
        this.foodWrapper.on('scrollEnd',({x,y}) => {
          this.scrollY = Math.abs(y);
        });
      },

      clickMenuItem(index){
        // 加上这句话，可以让左侧实时出效果
        this.scrollY = this.tops[index];
        // 滚动到哪里   参数  x  y  time
        // 作用于scrollEnd事件监听
        this.foodWrapper.scrollTo(0,-this.tops[index],100);   // 滚动的坐标是负数
      }
    },
    components:{
      CarControl
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


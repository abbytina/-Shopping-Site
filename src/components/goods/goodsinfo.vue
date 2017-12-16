<template>
  <div class="tmpl">
    <!-- 导航栏 -->
    <div class="section">
      <div class="location">
        <span>当前位置：</span>
        <a href="/index.html">首页</a> &gt;
        <a href="/goods.html">购物商城</a>
        <a href="/goods/42/1.html">商品详情</a>

      </div>
    </div>

    <!-- 商品详情 -->
    <div class="section">
      <div class="wrapper clearfix">
        <div class="wrap-box">
          <!--页面左边-->
          <div class="left-925">
            <div class="goods-box clearfix">
              <!--商品图片-->
              <div class="pic-box">

              </div>
              <!--/商品图片-->
              <div class="pic-box">
                <div class="magnifier" id="magnifier1">
                  <div class="magnifier-container">
                    <div class="images-cover"></div>
                    <!--当前图片显示容器-->
                    <div class="move-view"></div>
                    <!--跟随鼠标移动的盒子-->
                  </div>
                  <div class="magnifier-assembly">
                    <div class="magnifier-btn">
                      <span class="magnifier-btn-left">&lt;</span>
                      <span class="magnifier-btn-right">&gt;</span>
                    </div>
                    <!--按钮组-->
                    <div class="magnifier-line">
                      <ul class="clearfix animation03">
                        <li v-for="item in info.imglist" :key="item.id">
                          <div class="small-img">
                            <img :src="item.original_path" />
                          </div>
                        </li>

                      </ul>
                    </div>
                    <!--缩略图-->
                  </div>
                  <div class="magnifier-view"></div>
                  <!--经过放大的图片显示容器-->
                </div>
              </div>
              <!--商品信息-->
              <div class="goods-spec">
                <h1 v-text="goodsinfo.title"></h1>
                <p class="subtitle" v-text="goodsinfo.sub_title"></p>
                <div class="spec-box">
                  <dl>
                    <dt>货号</dt>
                    <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                  </dl>
                  <dl>
                    <dt>市场价</dt>
                    <dd>
                      <s id="commodityMarketPrice">{{goodsinfo.market_price}}元</s>
                    </dd>
                  </dl>
                  <dl>
                    <dt>销售价</dt>
                    <dd>
                      <em class="price" id="commoditySellPrice">{{goodsinfo.sell_price}}元</em>
                    </dd>
                  </dl>
                </div>

                <div class="spec-box">
                  <dl>
                    <dt>购买数量</dt>
                    <dd>
                      <el-input-number v-model="num1" @change="buyCount" :min="1" :max="goodsinfo.stock_quantity">
                      </el-input-number>
                      <span class="stock-txt">
                      库存
                      <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                      </span>
                    </dd>
                  </dl>
                  <dl>
                    <dd>
                      <div class="btn-buy" id="buyButton">
                        <button class="buy">立即购买</button>
                        <button ref="btnaddcar" class="add" @click="addCar">加入购物车</button>
                      </div>
                    </dd>
                  </dl>
                </div>

              </div>
              <!--/商品信息-->
            </div>

            <div id="goodsTabs" class="goods-tab bg-wrap">
              <!--选项卡-->
              <Affix>
                <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                  <ul>
                    <!-- @click=" "里可以放函数或表达式 -->
                    <li @click="istabShow = true">
                      <a v-bind="{class:(istabShow ? 'selected': '' )}" href="javascript:;">商品介绍</a>
                    </li>
                    <li @click="istabShow = false">
                      <a v-bind="{class:(!istabShow?'selected':'')}" href="javascript:;" class="">商品评论</a>
                    </li>
                  </ul>
                </div>
              </Affix>
              <!--选项卡-->

              <!--选项内容-->
              <div class="entry" v-show="istabShow">
                <div style="padding:5px" v-html="goodsinfo.content"></div>
              </div>

              <div class="" v-show="!istabShow">
                <!--网友评论-->
                <div class="comment-box">
                  <!--取得评论总数-->
                  <form id="commentForm" name="commentForm" class="form-box" url="/tools/submit_ajax.ashx?action=comment_add&amp;channel_id=2&amp;article_id=98">
                    <div class="avatar-box">
                      <i class="iconfont icon-user-full"></i>
                    </div>
                    <div class="conn-box">
                      <div class="editor">
                        <textarea id="txtContent" v-model="commentTxt" name="txtContent" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                        <span class="Validform_checktip"></span></div>
                      <div class="subcon">
                        <input id="btnSubmit" name="submit" @click="postComment" type="button" value="提交评论" class="submit">
                        <span class="Validform_checktip"></span></div>
                    </div>
                  </form>
                  <!--  评论列表区域 -->
                  <ul id="commentList" class="list-box">
                    <p v-show="commentList.length<=0" style="margin:5px 0 15px 69px;
                    line-height:42px;
                    text-align:center;
                    border:1px solid #f7f7f7;">暂无评论，快来抢沙发吧！</p>
                    <li v-for="item in commentList" :key="item.id">
                      <div class="avatar-box">
                        <i class="iconfont icon-user-full"></i>
                      </div>
                      <div class="inner-box">
                        <div class="info"><span>匿名用户</span>
                          <span>{{item.add_time | datefmt}}</span>
                        </div>
                        <p>{{item.content}}</p>
                      </div>
                    </li>
                  </ul>
                  <!--放置页码-->
                  <div class="page-box" style="margin:5px 0 0 62px">
                    <!-- 使用elementUI的分页组件替代 -->
                    <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="pageIndex" :page-sizes="[2,5,10,20,30]"
                      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalcount">
                    </el-pagination>
                  </div>
                  <!--/放置页码-->
                </div>

                <!--/网友评论-->
              </div>
            </div>
          </div>
          <!--/页面左边-->

          <!--页面右边-->
          <div class="left-220">
            <div class="bg-wrap nobg">
              <div class="sidebar-box">
                <h4>推荐商品</h4>
                <ul class="side-img-list">

                  <li v-for="item in info.hotgoodslist" :key="item.id">
                    <div class="img-box">
                      <router-link v-bind="{to:'/site/goodsinfo/'+item.id}">
                        <img :src="item.img_url">
                      </router-link>
                    </div>
                    <div class="txt-box">
                      <router-link v-bind="{to:'/site/goodsinfo/'+item.id}">
                        {{item.title}}
                      </router-link>
                      <span>{{item.add_time | datefmt}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--/页面右边-->
        </div>
      </div>
    </div>

    <!-- 定义一个div是用来展示图片的 -->
    <transition @before-enter="benter" @enter="enter" @after-enter="aenter">

      <div v-if="info.imglist" class="img" ref="img" v-show="isshow">
        <img width="50" height="50" :src="info.imglist[0].thumb_path" alt="">
      </div>
    </transition>

  </div>
</template>

<script>
  // 步骤2:导入jqimgzoom这个插件js   相册
  import '../../../statics/jqplugins/jqimgzoom/js/magnifier.js';

  // 导入事件总线的相关数据
  import {
    vm,
    KEY
  } from '../../kits/bus.js';

  // 导入localStorageHelper.js
  import {
    setItem
  } from '../../kits/localStoragehelper.js'

  export default {
    data() {
      return {
        currentBuyCount: 1, // 购物车数量 默认为1
        offsetObj: {}, // div的offset位置
        lbcOffSet: {},
        pageIndex: 1,
        pageSize: 2,
        totalcount: 0, // 评论的总条数
        num1: 1,
        info: {}, //负责存储服务器响应回来的商品的相关数据
        goodsinfo: {},
        istabShow: true, //  tab栏切换  默认显示的是商品介绍
        commentTxt: '', //用户填写的评论数据
        commentList: [],
        isshow: false // div的显示隐藏
      }
    },
    methods: {
      // 全局事件总线完成goodsinfo和layout的传参(非父子关系组件间的传值)
      // 6. addCar方法   加入购物车
      addCar() {
        // 利用vm.$emit() 触发事件,将购买数量传入layout.vue组件
        // vm.$emit(KEY, this.currentBuyCount);
        // 换成vuex中的 this.$store.dispatch('changeCount',this.currentBuyCount)
        // this.$store.dispatch('changeCount',this.currentBuyCount);

        // 获取到当前商品id和购买的数量调用 localStroagehelper.js这个文件中的setItem方法来存储值
        var goodsobj = {
          gid: this.$route.params.goodsid,
          count: this.currentBuyCount
        };

        // 将当前购买商品的数量存储到localStroage中
        setItem(goodsobj);

        this.$store.dispatch('changeCount', goodsobj);
        // 将isshow设置为true，显示出图片
        this.isshow = true;
      },
      //  5. 定义动画进入的三个钩子函数
      benter(el) {
        // 设定动画的开始位置
        el.style.left = this.offsetObj.left + "px";
        el.style.top = this.offsetObj.top + "px";
        // console.log( el.style.left, el.style.top);
      },
      enter(el, done) {
        // 设定动画的结束位置，同时调用 el.offsetWidth 来达到刷新的目的
        el.offsetWidth;
        el.style.left = this.lbcOffSet.left + "px";
        el.style.top = this.lbcOffSet.top + "px";
        // console.log( el.style.left, el.style.top);
        // 调用done()，执行下一个动画
        done();
      },
      aenter(el) {
        // 动画结束
        // 隐藏 <div v-if="info.imglist"
        this.isshow = false;
      },
      // 2.0 elelentUI的inputnumber组件的触发事件
      // val:代表的是最新的这个数字
      buyCount(val) {
        // console.log(val);
        this.currentBuyCount = val;
      },
      // 1 根据url传入的商品id获取到商品的详情数据
      getinfo() {
        var url = '/site/goods/getgoodsinfo/';
        this.$ajax.get(url + this.$route.params.goodsid).then(res => {
          // console.log(res);
          this.info = res.data.message;
          this.goodsinfo = res.data.message.goodsinfo;
          // console.log(this.goodsinfo.content);

          if (!this.info.goodsinfo) {
            this.$message.error('传入的商品id非法');
          }
          // 应该是等待整个数据回来以后，才进行相册图片的渲染
          // 延迟200毫秒初始化 
          setTimeout(function () {
            $('#magnifier1').imgzoon({
              magnifier: '#magnifier1'
            });
          }, 200);
        });
      },
      // 2 提交评论 postComment
      postComment() {
        // 提交的url   /site/validate/comment/post/:tablename/:artid
        var url = '/site/validate/comment/post/goods/' + this.$route.params.goodsid;
        this.$ajax.post(url, {
          commenttxt: this.commentTxt
        }).then(res => {
          if (res.data.status == 1) { // 失败
            this.$message.error(res.data.message);
            return;
          }

          // 提交成功后，刷新一下评论数据 this.getCommentList()
          this.getCommentList();

          // 清空文本框的文本内容
          this.commentTxt = "";
        });
      },
      // 3 分页获取商品评论数据的方法
      getCommentList() {
        // 获取商品评论的url,其中pageIndex和pageSize参数从data中来
        // /site/comment/getbypage/:tablename/:artid?pageIndex=页码&pageSize=每页显示条数
        // tablename	频道名称 ,      artid	文章或者商品id
        // var url =
        //   "/site/comment/getbypage/goods/${this.$route.params.goodsid}?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}";
        var url =
          `/site/comment/getbypage/goods/${this.$route.params.goodsid}?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
        this.$ajax.get(url).then(res => {
          // console.log(res);
          // 将当前商品的已有评论数据赋值
          this.commentList = res.data.message;
          // console.log(commentList);
          // 获取评论数据的总条数
          this.totalcount = res.data.message.totalcount;
        });
      },
      // 4 定义分页组件需要的两个事件
      sizeChange(size) {
        this.pageSize = size;
        // 重新获取数据
        this.getCommentList();
      },
      pageChange(index) {
        this.pageIndex = index;
        // 重新获取数据
        this.getCommentList();
      }

    },
    // watch监听路由对象达到自动切换不同商品数据的展示功能
    watch: {
      '$route': function () {
        this.getinfo();
      }
    },
    mounted() {
      this.getinfo();
      // 获取评论数据
      this.getCommentList();
      // 利用jq获取购物车的offset
      setTimeout(() => {
        // 获取当前页面上的 加入购物车按钮 的位置
        var offsetObj = $(this.$refs.btnaddcar).offset();
        this.offsetObj = offsetObj;
        // console.log(offsetObj);
        // 将加入购物车按钮的位置赋值给图片div
        $(this.$refs.img).css("left", offsetObj.left).css("top", offsetObj.top);

        // 获取layout.vue组件中的id=layoutbuycar 这个dom对象
        var lbcOffSet = $("#layoutbuycar").offset();
        // console.log(lbcOffSet);
        this.lbcOffSet = lbcOffSet;
        // console.log(this.lbcOffSet);
      }, 200);
      // console.log(this.istabShow);

    }
  }
</script>
<style scoped>
  /* 步骤1：导入jqimgzoom中的css样式   相册   */

  @import url('../../../statics/jqplugins/jqimgzoom/css/magnifier.css');

  .img {
    border: 1px solid red;
    width: 50px;
    height: 50px;
    position: absolute;
    transition: all 0.3s;
  }
</style>
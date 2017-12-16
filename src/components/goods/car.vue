<template>
  <div class="tmpl">
    <div class="section">
      <div class="location">
        <span>当前位置：</span>
        <a href="/index.html">首页</a> &gt;
        <a href="/cart.html">购物车</a>
      </div>
    </div>

    <div class="section">
      <div class="wrapper">
        <div class="bg-wrap">
          <!--购物车头部-->
          <div class="cart-head clearfix">
            <h2>
              <i class="iconfont icon-cart"></i>我的购物车</h2>
            <div class="cart-setp">
              <ul>
                <li class="first active">
                  <div class="progress">
                    <span>1</span> 放进购物车
                  </div>
                </li>
                <li>
                  <div class="progress">
                    <span>2</span> 填写订单信息
                  </div>
                </li>
                <li class="last">
                  <div class="progress">
                    <span>3</span> 支付/确认订单
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--购物车头部-->
          <!--商品列表-->
          {{values}}
          <div class="cart-box">
            <input id="jsondata" name="jsondata" type="hidden">
            <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
              <tbody>
                <tr>
                  <th width="48" align="center">
                    <el-button type="success" size="small" @click="selectAll">{{selectTxt}}</el-button>
                  </th>
                  <th align="left" colspan="2">商品信息</th>
                  <th width="84" align="left">单价</th>
                  <th width="104" align="center">数量</th>
                  <th width="104" align="left">金额(元)</th>
                  <th width="54" align="center">操作</th>
                </tr>
                <tr v-show="goodslist.length<=0">
                  <td colspan="10">
                    <div class="msg-tips">
                      <div class="icon warning">
                        <i class="iconfont icon-tip"></i>
                      </div>
                      <div class="info">
                        <strong>购物车没有商品！</strong>
                        <p>您的购物车为空，
                          <a href="/index.html">马上去购物</a>吧！</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <!-- 遍历goodslist数组生成数据 -->
                <tr v-for="(item,index) in goodslist" :key="item.id">
                  <td width="48" align="center">
                    <!-- 全选 el-switch -->
                    <el-switch v-model="values[index]" on-text="已选" on-color="#13ce66" off-color="#ff4949" off-text="未选"></el-switch>
                  </td>
                  <td align="left" colspan="2">
                    <!-- 放商品的图和标题 -->
                    <img height="50" width="50" :src="item.img_url" :alt="item.title"> {{item.title}}
                  </td>
                  <td width="84" align="left">{{item.sell_price}}</td>
                  <td width="200" align="center">
                    <!-- 使用自己定义好组件 -->
                    <inputnumber v-bind:obj="{gid:item.id,count:item.buycount}" @msg="getinputnumber"></inputnumber>
                  </td>
                  <td width="104" align="left">
                    {{ item.buycount * item.sell_price}}
                  </td>
                  <td width="54" align="center">
                    <a href="javascript:void(0)" @click="delData(item.id)">删除</a>
                  </td>
                </tr>
                <tr>
                  <th align="right" colspan="8">
                    已选择商品
                    <b class="red" id="totalQuantity">{{selectedCount}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                    <span class="red">￥</span>
                    <b class="red" id="totalAmount">{{getAmount}}</b>元
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <!--/商品列表-->
          <!--购物车底部-->
          <div class="cart-foot clearfix">
            <div class="right-box">
              <button class="button">继续购物</button>

              <button class="submit" @click="shopping">立即结算</button>

            </div>
          </div>
          <!--购物车底部-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 按需引入
  import {
    getItem,
    setItemReplace,
    remoteItem
  } from '../../kits/localStoragehelper.js';
  // 导入inputnumber.vue组件
  import inputnumber from '../subcom/inputnumber.vue';
  export default {
    // 注册子组件
    components: {
      inputnumber
    },
    data() {
      return {
        goodslist: [], // 购买商品的数据
        values: [], // 控制每行数据的选择状态
        selectedCount: 0, // 选中的商品总件数
        selectTxt: '全选',
        isselected: false,
      }
    },
    methods: {
      //  1 获取购物车中商品的数据
      getgoodslist() {
        //  1.0  从localStroage中获取到用户购买的商品id
        // goodsObj的格式：{商品id:购买数量} 
        var goodsObj = getItem();
        // console.log(goodsObj); {90: 56, 91: 8}
        // 遍历goodsObj对象中的key，变成一个字符串用逗号分隔
        var idArr = [];
        for (var key in goodsObj) {
          // console.log(key);  // 90 91
          idArr.push(key);
        }
        // console.log(idArr); //  ["90", "91"]
        var ids = idArr.join(","); // ids=[id,id,id,id]
        // console.log(ids); // 90,91

        var url = '/site/comment/getshopcargoods/' + ids;
        // 请求数据
        this.$ajax.get(url).then(res => {
          console.log(res);
          // 发现接口中返回的对象中有一个属性buycount 购买数量 ,但是这个值是存储在客户端的
          // 所以应该手动的将goodsObj中的对应的商品购买数量赋值过去

          res.data.message.forEach((item, index) => {
            // console.log(item,index);
            item.buycount = goodsObj[item.id];
            // console.log(item.buycount, goodsObj[item.id]);

            // 将values中的值的个数一一初始化
            this.values[index] = false;
          });
          // 渲染数据
          this.goodslist = res.data.message;

        });
      },
      // 2 删除购物信息 delData(item.id)
      delData(goodsid) {
        // console.log(goodsid);
        // 1.0 根据传入的商品id从this.goodslist中查找出索引
        var index = this.goodslist.findIndex(item => item.id == goodsid);

        // 2.0 删除goodslist中的当前索引的数据 // delete this.goodslist[index];
        this.goodslist.splice(index, 1);
        // 3.0 删除this.values中的当前索引的数据
        this.values.splice(index, 1);

        // 4.0 修改localStroage中的数据
        remoteItem(goodsid);

        // 5.0 触发vuex的changeCount重新重置layout.vue上面购物车数量的更新
        this.$store.dispatch('changeCount', {});

      },
      // 3 getinputnumber 接受子组件中传回来的值
      // obj的格式：{gid:商品id,count:修改以后的值}
      getinputnumber(obj) {
        // 修改localStorage中当前商品对于的购买数量
        // 获取当前localstorage中的当前商品
        setItemReplace(obj);
        // 将goodslist中当前商品对应的buycount值更新
        var index = this.goodslist.findIndex(
          function (item) {
            return item.id = obj.gid;
          }
        );

        // 根据索引修改这个对象中的buycount值
        this.goodslist[index].buycount = obj.count;
        // console.log(obj);
      },
      // 4 定义全选和反选的方法
      selectAll() {
        // 将isselected 取反
        this.isselected = !this.isselected;

        if (this.isselected) {
          this.selectTxt = "反选";
        } else {
          this.selectTxt = "全选";
        }

        //  将 this.isselected 的值赋值给this.values中的所有索引的值
        for (var i = 0; i < this.values.length; i++) {
          // 注意点：通过索引修改一个数组中的某个值后不会触发视图的使用位置的值的
          this.values[i] = this.isselected;
        }
        // 修改一个数据的某个索引值一定要通过splice的方式才能触发重新刷新
        // 可以将数组的内容改变一下也会触发
        // 这两段代码就是用来触发vue中的视图刷新的
        this.values.push(false);
        this.values.pop();
      },
      // 5 点击立即结算按钮跳转到订单页面
      shopping() {
        // 1.0 获取当前car.vue中选择的商品id
        var goodsids = [];
        // 首先查找this.values中的true所在的索引
        //  values: [], // 控制每行数据的选择状态

        this.values.forEach((item, index) => {
          // 如果item为true的话，这个index就是选中的商品的索引，那么应该从this.googdslist中找到当前索引
          // 中的商品id
          if (item == true) {
            goodsids.push(this.goodslist[index].id);
          }
        });

        // 2.0 判断用户是否有至少选择一个商品
        if (goodsids.length <= 0) {
          this.$message.error('请至少选择一个需要购买的商品');
          // 阻断下面代码的继续执行
          return;
        }

        // 2.0 跳转到shopping.vue组件同时将商品id传入
        this.$router.push({
          name: 'shopping',
          params: {
            ids: goodsids.join(',')
          }
        });
      }
    },
    computed: { // 计算
      getAmount() {
        // 1 计算出当前选中的商品总件数
        // 特点：计算属性所依赖的this.values数组中的值发生改变就会自动重新执行
        var trueArr = this.values.filter(item => item);
        this.selectedCount = trueArr.length;

        // 2. 统计选中商品的总金额
        var totalcount = 0;
        // 计算选中的某个商品的总价格： 商品单价 * 购买数量
        // 计算所有选中的商品总价格 = this.values中的所有的true的索引位置在this.goodslist这个数组中的对象
        // 重新遍历this.values这个数组，找到所有true的索引
        this.values.forEach((item, index) => {
          // 判断item==true
          if (item) {
            totalcount += (this.goodslist[index].buycount *
              this.goodslist[index].sell_price);
          }
        });
        return totalcount;
      }
    },
    mounted() {
      this.getgoodslist();
    }
  }
</script>
<style scoped>

</style>
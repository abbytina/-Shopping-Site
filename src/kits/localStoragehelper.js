// 业务：负责结合加入购物车这个业务来操作localStorate的数据

// 1 定义全局KEY
const KEY = "buyGoods";

// 2. 从localStorage中获取到数据
export function getItem() {
  var jsonString = localStorage.getItem(KEY);

  // 如果localStorage中没有这个key对应的数据则返回一个空对象
  if (!jsonString) {
    return {};
  }
  // 如果有值,将这个字符串转换成对象返回
  return JSON.parse(jsonString);
}

// 3. 设置localStorage中的数据    gobj:{gid:91,count:1}
export function setItem(gobj) {
  // 3.1 从localStorage中获取购买商品的对象
  var obj = getItem();
  // 3.2  判断gobj.gid的值在obj中是否存在
  if (obj[gobj.gid]) { // 存在
    // obj{
    //   91:1
    // }
    // obj.91 = obj.91 + 1
    obj[gobj.gid] = obj[gobj.gid] + gobj.count;
  } else {
    // 如果不存在，则动态向ob对象中添加一个商品的购买数量
    // 等价于  obj.91 = 1;
    obj[gobj.gid] = gobj.count;
  }
  // 3.3 将 obj 存储到ocalStorage中
  localStorage.setItem(KEY, JSON.stringify(obj));

}

// 4 删除localStorage数据
export function remoteItem(goodsid) {
  var obj = getItem();
  delete obj[goodsid];
  // 2.0 将obj存储会localStorage中
  localStorage.setItem(KEY, JSON.stringify(obj));  
}

// 5 覆盖一个值
export function setItemReplace(gobj) {
  console.log(gobj);
  // 1.0 从localStorage中获取购买商品的对象
  var obj = getItem();
  // console.log(obj);
  obj[gobj.gid] = gobj.count;
  // 2.0 将obj存储会localStorage中
  localStorage.setItem(KEY, JSON.stringify(obj));

}
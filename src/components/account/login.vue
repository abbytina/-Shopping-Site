<template>
  <div class="tmpl">
    <div class="section">
      <div class="location">
        <span>当前位置：</span>
        <a href="/index.html">首页</a> &gt;
        <a href="/login.html">会员登录</a>
      </div>
    </div>
    <div class="section">
      <div class="wrapper">
        <div class="bg-wrap">
          <div class="nav-tit">
            <a class="selected" href="javascript:;">账户登录</a>
            <i>|</i>
            <a href="/register.html">免费注册</a>
          </div>
          <el-form :model="form" :rules="rules" ref="form">
            <form id="loginform" name="loginform" class="login-box">
                <el-form-item label="账号" prop="user_name" >
                  <input type="text" v-model="form.user_name" class="input-box">
                </el-form-item>
                <el-form-item label="密码" prop="password" >
                  <input type="password" v-model="form.password" class="input-box">
                </el-form-item>
              <div class="btn-box">
                <input id="btnSubmit" name="btnSubmit" type="button" @click="submitvalidate" value="立即登录">
              </div>
              <div id="msgtips" class="tip-box"></div>
              <input id="turl" name="turl" type="hidden" value="http://localhost:8020/cart.html">
              <!--记住上一页网址-->
            </form>
          </el-form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import {
    vm
  } from '../../kits/bus.js'
  export default {
    data() {
      return {
        form: {
          user_name: "ivanyb5",
          password: "123"
        },
        rules: {
          user_name: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 触发表单  登录
      submitvalidate() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 验证通过 ， 提交表单
            var url = "/site/account/login";
            this.$ajax.post(url, this.form).then(res => {
              console.log(res);
              if (res.data.status == 1) {
                // 响应错误
                this.$message.error(res.data.message);
                return;
              }
              // 成功
              // 正常处理以后应该跳转到上次的来源页面
              // 去localStroage中获取到key = "currentPath"的数据
              var path = localStorage.getItem('currentPath');
              console.log(path);
              this.$router.push({
                path: path
              });
              // 在localStroage中存储一个 logined=true 表示登录成功了
              localStorage.setItem('logined', true);
              // console.log(11);
              // 触发全局事件总线的事件
              vm.$emit('changelogin', true);
              // console.log(22);
            });


          } else {
            this.$message.error('表单验证失败');
          }
        });
      }
    }
  }
</script>
<style scoped>

</style>
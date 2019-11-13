<template>
  <div class="login">
    <!-- elemengtUI card 卡片组件 -->
    <el-card class="login-card">
      <div class="title">
        <img src="../../assets/img/logo_index.png" alt />
      </div>
      <!-- 表单 -->
      <!-- model 属性 要绑定表单数据对象 rules 表示绑定校验规则对象 ref属性（属性名随便写） -->
      <el-form style="margin-top:30px">
        <!-- 一个表单域就是一个form-item -->
        <el-form-item>
          <!-- 放置表单组件 -->
          <!-- 手机号 -->
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 验证码和发送验证码 -->
          <el-input style="width:280px"></el-input>
          <el-button style="float:right" plain>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <!-- 勾选同意框  -->
          <el-checkbox>我已阅读并同意用户协议及条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.login {
  background-image: url("../../assets/img/login_bg.jpg");
  background-size: cover;
  height: 100vh; // vh表示的是占当前屏幕的百分比
  display: flex;
  justify-content: center;
  align-items: center;
  .login-card {
    width: 440px;
    height: 360px;
    .title{
      text-align: center;
      img{
        height: 45px;
      }
    }
  }
}
</style>

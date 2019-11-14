<template>
  <div class="login">
    <!-- elemengtUI card 卡片组件 -->
    <el-card class="login-card">
      <div class="title">
        <img src="../../assets/img/logo_index.png" alt />
      </div>
      <!-- 表单 -->
      <!-- model 属性 要绑定表单数据对象 rules 表示绑定校验规则对象 ref属性（属性名随便写） -->
      <el-form ref="formObj" style="margin-top:30px" :model="loginForm" :rules="loginRules">
        <!-- 一个表单域就是一个form-item -->
        <el-form-item prop="mobile">
          <!-- 放置表单组件 -->
          <!-- 手机号 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入您的手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- 验证码和发送验证码 -->
          <el-input v-model="loginForm.code" style="width:280px" placeholder="请输入您收到的验证码"></el-input>
          <el-button style="float:right" plain>发送验证码</el-button>
        </el-form-item>
        <el-form-item prop="checked">
          <!-- 勾选同意框  -->
          <el-checkbox v-model="loginForm.checked">我已阅读并同意用户协议及条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        // 要校验的整个表单数据
        mobile: '', // 手机号
        code: '', // 验证码
        checked: false // 是否勾选协议
      },
      loginRules: {
        // key （要校验的字段名）:value(数组=>多条或者1条或者没有规则)
        mobile: [{ required: true, message: '请输入您的手机号码' }, {
          pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码'
        }],
        code: [{ required: true, message: '请输入你的验证码' }, {
          pattern: /^\d{6}$/, message: '请输入六位数字'
        }],
        checked: [{ validator: function (rule, value, callback) {
          // rule 代表当前的规则 没啥用
          // value 代表当前值=>表单字段checked的值
          // callback 回调函数
          if (value) {
            // 如果是true 就是选中了 通过校验
            callback() // 直接执行 callback 表示直接通过
          } else {
            // 没有选中 不通过校验
            callback(new Error('你必须无条件被我坑'))
          }
        } }]
      }
    }
  },
  methods: {
    login () {
      // this.$refs.formObj 获取el-form 的对象实力
      this.$refs.formObj.validate(function (isOK) {
        if (isOK) {
          // 如果为true 继续下一步 调用接口 登录
          this.$axios({
            url: '/authorizations',
            data: this.loginForm,
            method: 'post'
          }).then(result => {
            window.localStorage.setItem('user-token', result.data.data.token)
          })
        }
      })
    }
  }

}
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

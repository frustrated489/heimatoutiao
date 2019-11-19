<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账户信息</span>
      </div>
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
          >
            <img width="100" :src="user.photo" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input type="textarea" v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  methods: {
    onSubmit () {
      console.log('保存')
    },
    loadUserProfile () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        this.user = res.data.data
      }).catch(err => {
        console.log(err)
        this.$message.error('获取数据失败')
      })
    }
  }
}
</script>

<style scoped>
</style>

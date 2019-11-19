<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
      </div>
      <div>
        <el-radio-group v-model="type" @change="onFind">
          <el-radio-button label="全部">全部</el-radio-button>
          <el-radio-button label="收藏">收藏</el-radio-button>
        </el-radio-group>
        <el-upload
          class="upload-demo"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="uploadHeaders"
          name="image"
          :on-success="onUploadSuccess"
          :show-file-list="false"
          style="float: right; padding: 3px 0"
        >
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
        <el-button
          style="float: right; margin-right: 10px;"
          type="success"
          @click="onUpload"
        >自己请求上传图片</el-button>

        <!--
          表单元素有个属性叫 hidden，可以隐藏它
          file 类型的 input 的 change 事件，当选择文件发生改变的时候触发
        -->
        <input type="file" hidden ref="file" @change="onFileChange" />
      </div>
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          v-for="item in images"
          :key="item.id"
          class="col-item"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.url" class="image" height="200" />
            <div style="padding: 14px;" class="action">
              <div class="bottom clearfix">
                <i
                  :class="{'el-icon-star-on' : item.is_collected,
                'el-icon-star-off': !item.is_collected}"
                  @click="onCollect(item)"
                ></i>
                <i class="el-icon-delete-solid" @click="onDelete(item)"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
const token = window.localStorage.getItem('user-token')
export default {
  name: 'MediaIndex',
  components: {},
  props: {},
  data () {
    return {
      images: [],
      type: '全部',
      // 给上传组件使用的请求头
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  methods: {
    loadImages (isCollect = false) {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: isCollect // 是否获取收藏图片
        }
      })
        .then(res => {
          this.images = res.data.data.results
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 该函数是 radio的change 事件处理函数
    // 通过文档我们得知，事件函数有个毁掉参数：选中的Radio label值
    // 所以我们可以声明一个形参来接收使用
    onFind (value) {
      this.loadImages(value !== '全部')
    },
    // 收藏 取消收藏
    onCollect (item) {
      this.$axios({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: item.is_collected
        }
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          // 更新视图展示
          item.is_collected = !item.is_collected
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败')
        })
    },
    // 删除图片
    onDelete (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios({
            method: 'DELETE',
            url: `/user/images/${item.id}`
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 更新列表
              this.loadImages(this.type !== '全部')
            })
            .catch(err => {
              console.log(err)
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onUploadSuccess () {
      // 刷新图片列表
      this.loadImages(this.type !== '全部')
    },
    onUpload () {
      // 手动触发 DOM 的点击事件
      this.$refs.file.click()
    },
    onFileChange () {
      // 获取用户选择的那个文件对象
      const fileObj = this.$refs.file.files[0]
      // 创建一个表单数据对象
      const formData = new FormData()
      // 手动往表单数据中添加成员
      formData.append('image', fileObj)
      // 请求上传
      this.$axios({
        method: 'POST',
        url: '/user/images',
        // 我们常见的两种 Content-Type
        // application/json axios默认会设置
        // multipart/form-data 常用语文件上传
        // 错误的写法
        // 如果你提交的 data 是一个普通对象，axios 会自动把 Content-Type 设置为 application/json
        // data: {
        //   image: fileObj
        // }
        // 我们这里接口要求 Content-Type 为 multipart/form-data，所以需要使用 FormData 对象
        // 如果 data 提供的是一个 FormData ，那么 axios 会把  Content-Type 设置为 multipart/form-data
        data: formData
      }).then(res => {
        console.log(res)
        // 上传成功，更新数据列表
        this.loadImages(this.type !== '全部')
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.col-item {
  margin-bottom: 20px;
  .action {
    display: flex;
    justify-content: center;
    font-size: 24px;
    i {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="item in images" :key="item.id" class="col-item">
          <el-card :body-style="{ padding: '0px' }">
            <img
              :src="item.url"
              class="image"
              height="200"
            />
            <div style="padding: 14px;" class="action">
              <div class="bottom clearfix">
                <i :class="{'el-icon-star-on' : item.is_collected,
                'el-icon-star-off': !item.is_collected}"></i>
                <i class="el-icon-delete-solid"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MediaIndex',
  components: {},
  props: {},
  data () {
    return {
      images: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  methods: {
    loadImages () {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: false // 是否获取收藏图片
        }
      }).then(res => {
        this.images = res.data.data.results
      }).catch(err => {
        console.log(err)
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
      font-size: 20px;
      i {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
</style>

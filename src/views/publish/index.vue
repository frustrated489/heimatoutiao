<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $route.params.articleId ? '编辑文章' : '发布文章'}}</span>
      </div>
      <el-form ref="form" :model="article" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quill-editor
            v-model="article.content"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <!-- <el-form-item label="封面">
          <el-radio-group v-model="article.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="频道">
          <!-- <el-select placeholder="请选择频道" v-model="article.channel_id">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channels"
              :key="channel.id"
            ></el-option>
          </el-select> -->
          <!-- 我们自己封装的频道下拉列表
          下拉列表的选中状态受绑定数据的影响
          下拉列表切换选中也会改变绑定的数据 -->
          <channel-select v-model="article.channel_id"></channel-select>
          <channel-select v-model="article.channel_id"
          :include-all="false"></channel-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">发表</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 加载富文本编辑器的样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 加载富文本编辑器的核心组件
import { quillEditor } from 'vue-quill-editor'

// 1 加载
import ChannelSelect from '@/components/channel-select'
// 2 注册
// 3 使用
export default {
  name: 'PublishArticle',
  components: {
    // 注册局部组件
    quillEditor,
    ChannelSelect
  },
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      // channels: [],
      editorOption: {} // 富文本编辑器的配置选项对象
    }
  },
  created () {
    // this.loadChannels()
    // 添加和编辑使用的都是这个组件
    // 只有编辑才需要在初始化的时候，根据id 获取加载文章的内容
    if (this.$route.params.articleId) {
      this.loadArticle()
    }
  },
  methods: {
    loadArticle () {
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.articleId}`
      }).then(res => {
        this.article = res.data.data
      })
    },
    onSubmit (draft) {
      if (this.$route.params.articleId) {
        this.updateArticle(draft)
      } else {
        this.addArticle(draft)
      }
    },

    addArticle (draft) {
      this.$axios({
        method: 'POST',
        url: '/articles',
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        },
        params: {
          draft
        },
        data: this.article
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err, '保存失败')
        })
    },

    updateArticle (draft) {
      this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.articleId}`,
        params: {
          draft
        },
        data: this.article
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    }
    // loadChannels () {
    //   // 有些接口需要 token，有些接口不需要 token
    //   // 是否需要，应该由接口文档指示
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   })
    //     .then(res => {
    //       this.channels = res.data.data.channels
    //     })
    //     .catch(err => {
    //       console.log(err, '获取数据失败')
    //     })
    // }
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>

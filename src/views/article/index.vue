<template>
  <div class="article">
    <!-- 筛选数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="文章状态">
          <!--
            单选框组会把选中的 radio 的 label 同步给绑定的数据
           -->
          <el-radio-group v-model="filterForm.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
            <el-radio label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <!-- <el-select placeholder="请选择频道" v-model="filterForm.channel_id">
            <el-option label="所有频道" :value="null"></el-option>
            <el-option :label="channel.name" :value="channel.id" v-for="channel in channels" :key="channel.id"></el-option>
          </el-select> -->
          <channel-select v-model="filterForm.channel_id"></channel-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /筛选数据 -->
    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{totalCount}}条符合条件的内容</span>
      </div>
      <!-- el-table 表格组件
      data 表格的数组，要求是数组
      表格组件会使用 data数据，在内部自己进行遍历，我们不需要自己写什么 v-for
      你只需要告诉这个表格组件：
      data是啥
      表头名是什么
      列值是什么
      el-table-column 表格列组件
      prop 用来指定渲染哪个数据字段
      label 表头名称
      width 列宽
      表格列默认只能渲染普通文本，如果想要渲染点别的东西，需要自定义表格列
      scope.row 就相当于我们自己v-for的item

      注意：只有当你需要在自定义表格列末班中访问遍历项的时候才这么做-->
      <el-table v-loading="loading" :data="articles" style="width: 100%">
        <el-table-column prop="date" label="封面" width="180">
          <!-- 自定义表格列
          在 template 上声明 slot-scope="scope" ，然后就可以通过 scope.row 获取遍历项-->
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!--
              0 草稿
              1 待审核
              2 审核通过
              3 审核失败
              4 已删除
            -->
            <!-- <span v-show="scope.row.status ===0">草稿</span>
             <span v-show="scope.row.status ===1">待审核</span>
             <span v-show="scope.row.status ===2">审核通过</span>
             <span v-show="scope.row.status ===3">审核失败</span>
            <span v-show="scope.row.status ===4">已删除</span>-->
            <!-- <span>{{ articleStatus[scope.row.status].label }}</span> -->
            <el-tag
              type="articleStatus[scope.row.status].type"
            >{{ articleStatus[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布日期"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="$router.push('/publish/' + scope.row.id)">修改</el-button>
            <el-button type="danger"  @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /文章列表 -->
    <!-- 分页 -->
    <!--
      分页组件：
      他默认按照10条每页划分页码
      total 用来指定一共有多少条数据
      background 背景色
      layout 用来控制布局
    -->
    <el-pagination
      :disabled="loading"
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
import ChannelSelect from '@/components/channel-select'
export default {
  name: 'article-list',
  components: {
    ChannelSelect
  },
  data () {
    return {
      filterForm: {
        status: null,
        channel_id: null
        // begin_pubdate: '',
        // end_pubdate: ''
      },
      rangeDate: [], // 日期范围
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '2016-05-01',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '2016-05-03',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }
      // ],
      articles: [], // 文章数据列表
      articleStatus: [
        {
          type: '',
          label: '草稿'
        },
        {
          type: 'warning',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'danger',
          label: '审核失败'
        },
        {
          type: 'info',
          label: '已删除'
        }
      ],
      totalCount: 0, // 总记录数
      loading: true, // 表格的loading 状态
      // channels: [],// 频道列表
      page: 1 // 当前页码
    }
  },

  created () {
    // 初始化的时候加载第 1 页数据
    this.loadArticles(1)
    // 加载频道列表
    // this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      // 加载loading
      this.loading = true
      // 在我们的项目中，除了 /login 接口不需要token ，其他所有的接口都需要提供token才能请求,否则后端返回 401 错误
      // 我们这里的后端要求把token 放到请求头中
      // const token = window.localStorage.getItem('user-token')

      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: {
        //   // 添加请求头
        //   // 名字：值
        //   // 后端要求把token放到请求头中，使用一个名字叫：Authorization
        //   // 注意，token的格式要求： Bearer 用户token
        //   // 注意！！Bearer 后面有个空格
        //   Authorization: `Bearer ${token}`
        // },
        // Query 参数使用params传递
        params: {
          page, // 页码
          per_page: 10, // 每页大小 后端按照默认10条每页
          status: this.filterForm.status,
          channel_id: this.filterForm.channel_id, // 频道id 不传就是所有
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null
        }
      })
        .then(res => {
          this.articles = res.data.data.results

          this.totalCount = res.data.data.total_count
        })
        .catch(err => {
          console.log(err, '获取数据失败')
        })
        .finally(() => {
          // 停止loading
          this.loading = false
        })
    },
    // 该函数是分页组件的 current-change 事件处理函数
    // 该函数也不是我们调用的，我们只是写了里面的业务代码
    // current-change 事件：当页码改变的时候，分页组件会调用这个方法
    // 分页组件在调用的时候，会把当前页码传递给这个方法
    // 我们这里要做的就是声明一个参数接收使用即可
    onPageChange (page) {
      // 记录当前最新页码
      this.page = page
      // 请求加载指定页码的文章列表
      this.loadArticles(page)
    },
    // loadChannels () {
    //   // 有些接口需要 token，有些接口不需要 token
    //   // 是否需要，应该由接口文档指示
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   }).then(res => {
    //     this.channels = res.data.data.channels
    //   }).catch(err => {
    //     console.log(err, '获取数据失败')
    //   })
    // },
    onDelete (articleID) {
      this.$axios({
        method: 'DELETE',
        url: `/articles/${articleID}`
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // }
      }).then(res => {
        this.loadArticles(this.page)
      }).catch(err => {
        console.log(err, '删除失败')
      })
    }
  }
}
</script>

<style scoped lang="less">
.article {
  .box-card {
    margin-bottom: 20px;
  }
}
</style>

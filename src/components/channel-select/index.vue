<template>
  <div class="channel-select">
      <!-- element 的下拉列表组件
      它这个组件要求 v-model 绑定数据 -->

    <el-select placeholder="请选择频道"
    :value='value' @input="$emit('input',$event)">
    <!-- <el-select placeholder="请选择频道"
    :value='value' @input='onInput'> -->
      <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="channel in channels"
        :key="channel.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ChannelSelect',
  components: {},
  props: {
    value: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      channels: [] // 存储频道列表
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      // 有些接口需要 token，有些接口不需要 token
      // 是否需要，应该由接口文档指示
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    },
    onInput (data) { // data 是选中的 option 的 value
      // 发布一个自定义事件，由于父组件使用的 v-model 简写，所以这里的事件名称必须叫 input
      this.$emit('input', data)
    }
  }
}
</script>

<style>
</style>

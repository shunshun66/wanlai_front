<template>
  <content-module name="imgmanger">
    <el-breadcrumb separator="/" style="margin-bottom:.5rem">
      <el-breadcrumb-item to="/admin">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图片素材管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:10Px;"></div>
    <img-upload selectFlag="true" @onimgselect="imgSelect" previewFlag="true"></img-upload>
  </content-module>
</template>
<script>
  import { mapGetters } from 'vuex'
  import ImgUpload from 'components/ImgUpload'
  export default {
    data () {
      return {
      }
    },
    components: {
      ImgUpload
    },
    methods: {
      imgSelect (url) {
          console.log(url)
      }
    },
    computed: {
      ...mapGetters([
        'userRole'
      ])
    }
  }
</script>

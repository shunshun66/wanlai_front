<template>
    <div>
      <el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="imgList" list-type="picture-card" :on-success="uploadOk">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-dialog v-model="previwVisible" size="tiny"  @close="cancelForm">
        <img width="100%" :src="previewImageUrl" alt="">
      </el-dialog>
    </div>
</template>
<script>
  import { imgmng as imgmngRes } from 'resources'
  export default {
    props: {
      selectFlag:false,
      previewFlag:true
    },
    data () {
      return {
        imgList: [],
        uploadUrl: '/api/imgmng/imgupload/',
        previwVisible: false,
        previewImageUrl: '',
        progress: 0
      }
    },
    components: {
    },
    methods: {
      fetch () {
        imgmngRes.query().then(res => {
          this.setImgList(res.body.results)
        })
      },
      handleRemove (file, fileList) {
        if (!file) {
          return
        }
        console.log(file)
        this.$confirm(`将要删除该图片, 是否继续?`, this.$t('confirm.title'), {
          type: 'warning'
        }).then(() => {
          imgmngRes.delImg({ img_id: file.id }).then(res => {
              this.setImgList(res.results)
            })
          }).catch(() => {
          this.fetch()
        })
      },
      handlePreview (file) {
        if (this.previewFlag) {
          this.previwVisible = true
        }
        this.previewImageUrl = file.url
        if (this.selectFlag) {
          let url = file.url
          let minUrl = file.minurl
          if (file.response) {
            url = file.response.results.imgUrl
            minUrl = file.response.results.minImgUrl
          }
          this.$emit('onimgselect', {url, minUrl})
        }
      },
      uploadOk (res, file, fileList) {
        console.log(res)
        this.setImgList(res.results)
      },
      setImgList (resList) {
          if (resList && resList.length > 0) {
            const imgs = []
            resList.map(item => {
              const imgItem = {}
              imgItem['name'] = item.imgName
              imgItem['url'] = item.imgUrl
              imgItem['minurl'] = item.minImgUrl
              imgItem['id'] = item._id
              imgs.push(imgItem)
            })
            this.imgList = imgs
          }
      },
      saveImg (imgUrl, imgName) {
        imgmngRes.saveImg({ imgUrl: imgUrl }).then(res => {
          if (!res.data || !res.data.results) {
            this.$message.error('上传文件失败!');
          }
          const imgItem = {}
          imgItem['name'] = imgName
          imgItem['url'] = imgUrl
          imgItem['minurl'] = res.data.results.minImgUrl
          imgItem['id'] = res.data.results._id
          this.imgList.push(imgItem)
        })
      },
      cancelForm () {
        this.previwVisible = false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.fetch()
      })
    }

  }
</script>


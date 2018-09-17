<template>
  <content-module name="advertimg">
    <el-breadcrumb separator="/" style="margin-bottom:.5rem">
      <el-breadcrumb-item to="/admin">{{$t('advertimg.breadcrumb.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('advertimg.breadcrumb.current')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <data-table ref="advertimg" @page-change="fetch">
      <div slot="toolbar">
        <el-button type="primary"  icon="plus" @click.native="createAdvertImg">{{$t('operation.create')}}</el-button>
      </div>
      <el-table :data="advertimglist" border style="overflow:auto;" @sort-change="sortChange">
        <el-table-column property="imgIndex" :label="$t('advertimg.model.imgIndex')" sortable="custom" min-width="90"></el-table-column>
        <el-table-column property="imgName" :label="$t('advertimg.model.imgName')" min-width="120"></el-table-column>
        <el-table-column property="img_typename" :label="$t('advertimg.model.imgType')" sortable min-width="90"></el-table-column>
        <el-table-column property="position_typename" :label="$t('advertimg.model.positionType')" sortable min-width="90"></el-table-column>
        <el-table-column :label="$t('advertimg.model.imgUrl')" width="160" height="80">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" style="width:100%"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation.operation')" align="center" width="220">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click.native="deleteAdvertImg(scope.row)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="updateAdvertImg(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </data-table>
    <el-dialog :title="form._id?$t('advertimg.create.modifytitle') : $t('advertimg.create.title')"  :visible.sync="formVisible" @close="cancelForm" ref="creatDlg" id="dlgcreate">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form-item :label="$t('advertimg.model.imgName')" prop="imgName">
          <el-input v-model="form.imgName" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('advertimg.model.imgIndex')" prop="imgIndex">
          <el-input-number v-model="form.imgIndex"  :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('advertimg.model.imgType')" prop="imgType">
          <el-select v-model="form.imgType" filterable placeholder="请选择图片类型">
            <el-option v-for="(item,idx) in imgTypes" :key="idx" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('advertimg.model.positionType')" prop="positionType">
          <el-select v-model="form.positionType" filterable placeholder="请选择图片位置类型">
            <el-option v-for="(item,idx) in positionTypes" :key="idx"  :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('advertimg.model.imgUrl')" prop="imgUrl">
          <img v-if="imgVisibility" :src="form.imgUrl" style="width:200px" @click="handleIconClick"/>
          <el-button v-else type="primary" icon="el-icon-picture" @click="handleIconClick"></el-button>
        </el-form-item>
        <el-form-item :label="$t('advertimg.model.linkUrl')" prop="linkUrl">
          <el-input v-model="form.linkUrl" class="inputhalf"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible=false">{{$t('confirm.cancel')}}</el-button>
        <el-button type="primary" @click.native="saveForm">{{$t('confirm.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('advertimg.create.selectImage')" :visible.sync="imageFormVisible" @close="cancelImageForm">
      <img-upload :selectFlag="selectFlag" :previewFlag="previewFlag" @onimgselect="imgSelect"></img-upload>
    </el-dialog>
  </content-module>
</template>
<script>
import DataTable from 'components/DataTable'
import ImgUpload from 'components/ImgUpload'
import { advertmng as advertmngRes } from 'resources'
import locales from 'locales/advert'
import _ from 'lodash'
export default {
  locales,
  data () {
    var validateImgNo = (rule, value, callback) => {
       if (this.beforeImgNo === '' || this.beforeImgNo !== this.form.imgIndex) {
        for (var key in this.advertimglist) {
          if (this.advertimglist[key].imgIndex === this.form.imgIndex &&
               this.advertimglist[key].imgType === this.form.imgType) {
            callback(new Error('图片的序号已经存在'))
            return
          }
        }
      }
      callback()
    }
    var validateImgType = (rule, value, callback) => {
        if (this.beforeImgType !== this.form.imgType) {
          for (var key in this.advertimglist) {
            if (this.advertimglist[key].imgIndex === this.form.imgIndex &&
              this.advertimglist[key].imgType === this.form.imgType) {
              callback(new Error('图片的序号已经存在'))
              return
            }
          }
        }
      callback()
    }
    return {
      form: {
        imgName:'',
        imgUrl:'',
        imgIndex:'',
        imgType: '',
        positionType:'',
        minImgUrl:'',
        linkUrl:'',
      },
      advertimglist: [],
      rules: {
        imgName: [{
          required: true, message: this.$t('advertimg.rules.imgName'), trigger: 'blur'
        }],
        imgUrl: [{
          required: false, message: this.$t('advertimg.rules.imgUrl'), trigger: 'blur'
        }],
        imgIndex: [{
          validator: validateImgNo, trigger: 'blur'
        }],
        imgType: [{
          validator: validateImgType, trigger: 'change'
        }]
      },
      beforeImgNo: '',
      beforeImgType: '',
      formVisible: false,
      imageFormVisible: false,
      imgVisibility: true,
      runing: false,      // 是否正在执行
      butName: '确定',
      previewFlag: false,
      selectFlag: true,
      search: { },
      imgTypes: [
        {
            value: 'advert',
            label: '广告图片'
        },
        {
          value: 'other',
          label: '其他图片'
        }
      ],
      positionTypes: [
        {
          value: 'top',
          label: '页首'
        },
        {
          value: 'middle',
          label: '页中'
        },
        {
          value: 'bottom',
          label: '页脚'
        },
        {
          value: 'other',
          label: '其他位置'
        }
      ]
    }
  },
  components: {
    DataTable,
    ImgUpload
  },
  methods: {
    imgSelect ({url, minUrl}) {
      this.form.imgUrl = url
      this.form.minImgUrl = minUrl
      this.cancelImageForm()
    },
    handleIconClick (ev) {
      this.imageFormVisible = true
      this.imgVisibility = true
    },
    cancelImageForm () {
      this.imageFormVisible = false
    },
    fetch (current = 1) {
      this.$refs.advertimg.query(advertmngRes, current, { search: this.search }).then(list => {
        this.advertimglist = list
        _.forEach(this.advertimglist, function (item) {
            switch (item.imgType) {
              case 'advert':
                item['img_typename'] = '广告图片'
                break
              case 'other':
                item['img_typename'] = '其他图片'
                break
            }
            switch (item.positionType) {
              case 'top':
                item['position_typename'] = '页首'
                break
              case 'middle':
                item['position_typename'] = '页中'
                break
              case 'bottom':
                item['position_typename'] = '页脚'
                break
              case 'other':
                item['position_typename'] = '其他位置'
                break
            }
         })
      }).catch(err => {
        console.log(err)
      })
    },
    createAdvertImg () {
      this.initForm()
      this.form.imgIndex = this.$refs.advertimg.page.total + 1
      this.formVisible = true
      this.imgVisibility = false
    },
    cancelForm () {
      this.formVisible = false
      this.$refs.form.resetFields()
    },
    initForm () {
      for (var key in this.form) {
        this.form[key] = '';
      }
      delete this.form._id
      this.beforeImgNo = ''
      this.beforeImgType = ''
    },
    saveForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.runing = true
          this.butName = '执行中'
          let promise
          if (this.form._id) {
            promise = advertmngRes.update({ _id: this.form._id }, this.form)
          } else {
            promise = advertmngRes.save(null, this.form)
          }
          promise.then((res) => {
            this.cancelForm();
            this.$message({
              type: 'success',
              message: this.form._id ? this.$t('message.updated') : this.$t('message.created')
            });
            this.runing = false
            this.butName = '确定'
            this.initForm();
            this.fetch();
          }).catch((err) => {
            this.runing = false
            this.butName = '确定'
            const errMsg = this.form._id ? this.$t('message.updateFailed') : this.$t('message.createFailed')
            this.$message({
              type: 'error',
              message: err.status === 422 ? this.$t('devinfo.action.advertExisted') : errMsg
            })
          })
        }
      })
    },
    deleteAdvertImg (imginfo) {
      this.$confirm(`将要删除图片: ${imginfo.imgName} , 是否继续?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        advertmngRes.delete({ _id: imginfo._id }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
          this.fetch()
        })
      }).catch(() => {})
    },
    updateAdvertImg (imginfo) {
      this.initForm()
      Object.assign(this.form, imginfo)
      this.beforeImgNo = this.form.imgIndex
      this.beforeImgType = this.form.imgType
      this.formVisible = true
      if (this.form.imgUrl === '') {
        this.imgVisibility = false
      } else {
        this.imgVisibility = true
      }
    },
    // 改变序号的排序方式
    sortChange (item) {
      if (item.prop === 'imgIndex') {
        const tempList = _.sortBy(this.advertimglist, function (info) {
          const orderfield = info.imgType + info.imgIndex
          if (item.order === 'ascending') {
            return orderfield
          } else {
            return -orderfield
          }
        })
        this.advertimglist = tempList
      }
    }
  },
  computed: {
  },
  mounted () {
    this.$nextTick(() => {
      this.fetch()
    })
  }
}
</script>
<style lang="stylus">
  .inputhalf
    width 50%
  .halfFourtywidth
     width 100%
  #searchSelectId .el-input
     width 100%
  #btypeId .el-input
     width 100%
  #butcher_fac_idSelect .el-input
    width 100%
</style>

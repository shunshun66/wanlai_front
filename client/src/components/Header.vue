<template>
  <transition name="header">
    <header id="header" v-if="loggedIn">
      <h1></h1>
      <div class="nav" v-if="loggedIn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <span class="iconfont icon-user" style="margin-right:2px;vertical-align:middle;"></span>
            <img :src="userinfos.head_img_url" class="user-avatar" v-if="userinfos.head_img_url">
            <template v-else>
              {{username}}
              <i class="el-icon-caret-bottom el-icon-right"></i>
            </template>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showConfig">{{$t('header.settings')}}</el-dropdown-item>
            <el-dropdown-item @click.native="password.visible=true">{{$t('header.password')}}</el-dropdown-item>
            <el-dropdown-item @click.native="modifyUser">{{$t('header.userinfo')}}</el-dropdown-item>
            <el-dropdown-item @click.native="doLogout">{{$t('header.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- user settings -->
      <el-dialog :title="$t('header.settings')" :visible.sync="config.visible" width="50%"
        top="4%" @close="cancelConfig">
        <el-form class="noline" ref="config" label-position="top"
          :model="config.form" :rules="config.rules">
          <!--<el-form-item :label="$t('header.langSetting')" prop="lang">-->
            <!--<el-select v-model="config.form.lang">-->
              <!--<el-option v-for="lang in globalConfig.langs" :label="lang.label" :value="lang.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('header.pageLimit')" prop="pageLimit">
            <el-slider v-model="config.form.pageLimit" :min="1" :max="100" show-input></el-slider>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="config.visible=false">{{$t('confirm.cancel')}}</el-button>
          <el-button type="primary" @click.native="saveConfig">{{$t('confirm.ok')}}</el-button>
        </span>
      </el-dialog>
      <!-- change password -->
      <el-dialog :title="$t('header.password')" :visible.sync="password.visible" width="50%" @close="cancelPassword">
        <el-form label-position="top" :model="password.form"
          :rules="password.rules" ref="password">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('header._password.old')" prop="oldPassword">
                <el-input type="password" v-model="password.form.oldPassword"/>
              </el-form-item>
              <el-form-item :label="$t('header._password._new')" prop="password">
                <el-input type="password" v-model="password.form.password"/>
              </el-form-item>
              <el-form-item :label="$t('header._password.newConfirm')" prop="confirmPassword">
                <el-input type="password" v-model="password.form.confirmPassword"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('constant.desc')">
                <div>{{$t('header._password.description')}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="password.visible=false">{{$t('confirm.cancel')}}</el-button>
          <el-button type="primary" @click.native="changePassword">{{$t('confirm.ok')}}</el-button>
        </span>
      </el-dialog>
      <!-- 用户信息-->
      <el-dialog :title="$t('header.userinfo')" :visible.sync="userinf.visible" @close="cancelUser" width="50%">
        <el-form :model="userinf.form" :rules="userinf.rules" ref="userinf" label-width="120px"
                 :close-on-click-modal="false" :close-on-press-escape="false">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userinf.form.name" class="inputhalf"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="userinf.form.email" class="inputhalf"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="userinf.form.tel" class="inputhalf"></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="head_img_url">
            <el-card v-if="userinf.form.head_img_url" style="width: 271px;line-height: 0" :body-style="{ padding: '0px' }">
              <img  :src="userinf.form.head_img_url" style="width:100%; height: 100%" @click="handleIconClick('head')"></img>
            </el-card>
            <el-button v-else type="primary" icon="picture" @click="handleIconClick('head')"></el-button>
          </el-form-item>
          <el-form-item label="二维码图片" prop="qrImg">
            <el-card v-if="userinf.form.qrImg" style="width: 271px;line-height: 0" :body-style="{ padding: '0px' }">
              <img  :src="userinf.form.qrImg" style="width:100%; height: 100%" @click="handleIconClick('qr')"></img>
            </el-card>
            <el-button v-else type="primary" icon="picture" @click="handleIconClick('qr')"></el-button>
          </el-form-item>            
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click.native="userinf.visible=false">{{$t('confirm.cancel')}}</el-button>
        <el-button type="primary" @click.native="saveUser">{{$t('confirm.ok')}}</el-button>
      </span>
      </el-dialog>
      <el-dialog title="选择图片" :visible.sync="imageFormVisible" @close="cancelImageForm">
        <img-upload :selectFlag="selectFlag" :previewFlag="previewFlag" @onimgselect="imgSelect"></img-upload>
      </el-dialog>
    </header>
  </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { merge } from 'lodash'
import { user as userResource } from 'resources'
import locales from 'locales/header'
import ImgUpload from 'components/ImgUpload'
export default {
  locales,
  data () {
    return {
      config: {
        visible: false,
        form: {
          lang: '',
          pageLimit: 10
        },
        rules: {
          lang: [{ required: true }],
          pageLimit: [{ type: 'number', required: true }]
        }
      },
      password: {
        visible: false,
        form: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [{
            required: true, message: this.$t('header._password.rules.old'), trigger: 'blur'
          }],
          password: [{
            required: true, message: this.$t('header._password.rules._new'), trigger: 'blur'
          }],
          confirmPassword: [{
            required: true, message: this.$t('header._password.rules.newConfirm'), trigger: 'blur'
          }, {
            trigger: 'blur', message: this.$t('header._password.rules.notMatch'), validator: (rule, value, callback) => {
              if (value !== this.password.form.password) {
                callback(new Error(rule.message))
              } else {
                callback()
              }
            }
          }]
        }
      },
      userinf: {
        visible: false,
        form: {
          name: '',
          email: '',
          tel: '',
          head_img_url: '',
          qrImg: '' // 二维码图片
        },
        rules: { },
        uploadUrl: '/api/users/imgupload/'
      },
      imageFormVisible: false,
      previewFlag: false,
      selectFlag: true,
      uploadImgName: ''
    }
  },
  components: {
    ImgUpload
  },
  computed: {
    ...mapGetters([
      'username',
      'loggedIn',
      'userId',
      'globalConfig',
      'userinfos'
    ])
  },
  methods: {
    ...mapActions(['logout', 'updateGlobalConfig', 'initUserInfo']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      })
    },
    showConfig () {
      this.config.visible = true
    },
    cancelConfig () {
      this.config.form.lang = this.globalConfig.lang
      this.config.form.pageLimit = this.globalConfig.pageLimit
      this.config.visible = false
    },
    saveConfig () {
      this.updateGlobalConfig(this.config.form)
      this.config.visible = false
      this.$message.success(this.$t('message.save.ok'))
    },
    cancelPassword () {
      this.$refs.password.resetFields()
      merge(this.password.form, {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      })
      this.password.visible = false
    },
    changePassword () {
      this.$refs.password.validate(valid => {
        if (valid) {
          userResource.changePassword({ id: this.userId }, this.password.form).then(res => {
            this.$notify.success(this.$t('header._password.afterChange'))
            this.password.visible = false
            setTimeout(() => {
              this.doLogout()
            }, 2000)
          }).catch(() => {})
        }
      })
    },
    initUser () {
      for (var key in this.userinf.form) {
        this.userinf.form[key] = '';
      }
    },
    cancelUser () {
      this.initUser()
      this.userinf.visible = false
    },
    saveUser () {
      this.$refs.userinf.validate(valid => {
        if (valid) {
          const promise = userResource.update({ _id: this.userinf.form._id }, this.userinf.form)
          promise.then(() => {
            this.cancelUser()
            this.$message({
              type: 'success',
              message: this.$t('message.updated')
            })
            this.initUserInfo();
          }).catch((err) => {
               this.$message({
              type: 'error',
              message: err.status === 422 ? this.$t('user.action.userExisted') : this.$t('message.updateFailed')
            })
          })
        }
      })
    },
    modifyUser () {
      this.initUser()
      Object.assign(this.userinf.form, this.userinfos)
      this.userinf.visible = true
    },
    imgSelect (url) {
      if (this.uploadImgName === 'head') {
        this.userinf.form.head_img_url = url
      } else {
        this.userinf.form.qrImg = url
      }
      this.cancelImageForm()
    },
    handleIconClick (ev) {
      this.imageFormVisible = true
      this.uploadImgName = ev
    },
    cancelImageForm () {
      this.imageFormVisible = false
    }
  },
  created () {
    this.cancelConfig()
  }
}
</script>
<style lang="stylus">
@import "../assets/css/variable"
.header-enter-active
.header-leave-active
  transition all .5s
.header-enter
.header-leave-active
  margin-top -($header-height)
#header
  display flex
  flex-direction row
  align-items center
  justify-content space-between
  padding 0 1rem
  background-color $color-white
  h1
    float left
    height $header-height
    line-height @height
    margin 0
    font-weight normal
    > a
      color #fff
  .nav
    float right
    margin 0
    padding 0
  .inputhalf
    width 50%
  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  .avatar-uploader .el-upload:hover
    border-color: #20a0ff;
  .avatar-uploader-icon
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  .avatar
    width: 178px
    height: 178px
    display: block
  .user-avatar
     margin-left: 10px;
     width: 50px;
     border-radius: 50%;
     vertical-align: bottom;
</style>

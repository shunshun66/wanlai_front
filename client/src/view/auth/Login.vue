<template>
  <div class="login-wrapper" v-show="!loggedIn">
    <div class="bg"></div>
    <h1>{{$t('title')}}</h1>
    <el-form ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item prop="username">
        <el-input v-model="form.username" :placeholder="$t('login.username')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" :placeholder="$t('login.password')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="success"
          native-type="submit" :loading="loading">{{$t('login.button')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="lang">
      <el-button @click.native="forgetPwd" type="text">忘记密码</el-button>
    </div>
    <div style="position: absolute; height:260px; left:0; width:100%; background-color: #323232; bottom: 0px;border-top:5px solid #e1472f;overflow:hidden; clear: both; background:#323232;color:#969595;padding-top:40px; margin: 0 auto;">
      <div style="height:100%; width: 80%; margin-left: 20%;">
        <div style="height: 100%; width: 30%; float: left; margin-right: 20px; ">
          <h3>关于我们</h3>

          <p>凤岐茶社是山东省首家采用“互联网+众创空间”模式构建的创业服务机构，是科技部国家级众创空间、山东省首批创客之家、首批泉城众创空间。</p>
          <p>凤岐茶社旨在通过创新的互联网技术实现资本、产业、人才、技术资源的云端聚集，将京沪广深一线城市的优质创业资源引入山东，并通过局部导入的方式注入线下茶社，改善线下茶社创新创业的微环境，使其成为适合创业的温室，为创业者提供适合创业的微观环境和系统支撑。</p>
          <div class="footer-logo">

          </div>
        </div>
        <div style="height: 100%; width: 23%; float: left;">
          <div class="percent-one-half" style=" padding-left: 35%; padding-right: 0%;">
            <h3 id="gztitlle">关注我们</h3>
            <div class="tweet">
              <table>
                <tbody><tr>
                  <td>
                    <div style="width:78px; height:160px; float:left; text-align:center;margin-top:-80px;margin-left:-20px">
                      <div style="width:98px; height:98px;">
                        <img id="sina_qr" v-show="SinaShowFlag" style="width: 98px; height: 98px;" src="../../assets/images/sina_qr.png">
                      </div>
                      <a href="http://weibo.com/u/5307554330" target="_blank" title="在新浪微博上关注我们">
                        <img id="sina" @mouseover="SinaShowFlag = true" @mouseout="SinaShowFlag = false" src="../../assets/images/sina_foot.png" style="cursor:pointer;width:40px;height:40px;">
                      </a>
                    </div>
                  </td>
                  <td>
                    <div style="width:78px; height:160px; float:left; text-align:center;margin-top:-80px;">
                      <div style="width:98px; height:98px;">
                        <img id="weixin_qr" v-show="showFlag" style="width:98px; height:98px;" src="../../assets/images/weixin_qr.jpg">
                      </div>
                      <img id="weixin" @mouseover="showFlag = true" @mouseout="showFlag = false" src="../../assets/images/weixin_foot.png" style="cursor:pointer;width:40px;height:40px;">
                    </div>
                  </td>
                </tr>
                </tbody></table>
            </div>
          </div>
        </div>
        <div style="height: 100%; width: 33%; float: left;">
          <h3 style="padding-left: 40px;">联系我们</h3>
          <ul>
            <li style="border-bottom:1px dotted #6b6b6b;padding-bottom:10px;margin-bottom:10px;">地址: 济南市历下区趵突泉北路24号508室<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;济南市长清区大学城紫薇路数娱大厦C座9层</li>
            <li style="padding-bottom: 10px;margin-bottom:10px;">电话: 0531-88110998<br/>
              邮箱: <a style="color:#fff" href="mailto:">support@phoenixtea.org</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 忘记密码-->
    <el-dialog title="密码重置" v-model="userinf.visible" @close="cancelUser" size="tiny">
      <el-form :model="userinf.form" :rules="userinf.rules" ref="userinf" label-width="120px"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form-item label="手机号" prop="mobileTel">
          <el-input v-model="userinf.form.mobileTel" class="inputhalf"  @keypress.native="onlyTelNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="userinf.visible=false">{{$t('confirm.cancel')}}</el-button>
        <el-button type="primary" @click.native="saveUser">{{$t('confirm.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/login'
import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
import { user as userRes } from 'resources'
export default {
  components: { ElButton },
  locales,
  data () {
    var validateMobileTel = (rule, value, callback) => {
      const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
      if (!myreg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true, message: this.$t('login.username'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('login.password'), trigger: 'blur'
        }]
      },
      loading: false,
      loginError: false,
      showFlag: false,
      SinaShowFlag: false,
      userinf: {
        visible: false,
        form: {
          mobileTel: ''
        },
        rules: {
          mobileTel: [{
            required: true, message: '请输入手机号', trigger: 'blur'
          }, {
            validator: validateMobileTel, trigger: 'blur'
          }]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig'])
  },
  methods: {
    ...mapActions(['login', 'changeLang']),
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.login({
            username: this.form.username,
            password: this.form.password
          }).then((data) => {
            this.loading = false
            this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            this.$notify({
              title: this.$t('message.error'),
              message: err.message || this.$t('login.authFail'),
              type: 'error',
              duration: 1500
            })
            this.loading = false
            this.loginError = true
            setTimeout(() => {
              this.loginError = false
            }, 500)
          })
        }
      })
    },
    forgetPwd () {
      this.userinf.visible = true
    },
    cancelUser () {
      this.userinf.form.mobileTel = ''
      this.userinf.visible = false
    },
    saveUser () {
      this.$refs.userinf.validate(valid => {
        if (valid) {
          const promise = userRes.forgetPasswordByTel(this.userinf.form)
          promise.then((res) => {
            this.cancelUser()
            if (!res.data.err) {
              this.$message({
                type: 'success',
                message: '新密码已发送到手机，请查看手机短信'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.err
              })
            }
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err
            })
          })
        }
      })
    },
    downPrintdrive () {
      const downurl = 'static/drive/driver.zip'
      var elemIF = document.createElement('iframe')
      elemIF.src = downurl;
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF);
    },
    onlyTelNumber (event) {
      if (event.keyCode !== 45 && (event.keyCode < 48 || event.keyCode > 57)) {
        event.returnValue = false
      }
    }
  }
}
</script>
<style lang="stylus">
@import "../../assets/css/variable"
$input-width = 15rem
.login-wrapper
  align-self center;
  margin-bottom: 18%
  .bg
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    width 100%
    height 100%
    background-size cover
    background-position 100%
    background-image url('../../assets/images/login-bg.jpg')
  > h1
    position relative
    margin 0 0 1rem
    text-align center
    z-index 1
  > form
    width $input-width
    margin 0 auto
    .el-input__inner
      color $color-black-exact-light
      border-color $color-silver-light
      background-color transparent
      &:focus
        color $color-black
        border-color $color-black
  .login-button
    width 100%
    &.error
      animation shake .5s
  .el-button--text
    color: #13ce66
   .lang
    position fixed
    right 1.5rem
    bottom 18rem
    width 5rem
    .el-input__icon
      display none
    input
      height 1.75rem
      border none
      padding-right 10px
      text-align center
      color $color-white-dark
      background-color rgba(255,255,255,.4)
      &:hover
        color $color-white
        background-color rgba(255,255,255,.25)
    h3
    font-size: 16px
    font-weight: 300
    color: #fff
    line-height: 24px
    margin-bottom: 20px;
  ol, ul
    list-style: none
  .footer-logo
    background url(../../assets/images/logo.png) no-repeat scroll 0px 0
    width 250px
    height 35px;
    text-indent -9999px;
    display:block;
    position:relative;
  #gztitlle
    line-height 24px;
    margin-bottom 20px
.login-wrapper > form .el-input__inner {
  color: #fbfdff;
}
.login-wrapper .lang {
  width : 150px;
  display : flex;
}
</style>

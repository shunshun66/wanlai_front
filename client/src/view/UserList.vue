<template>
  <content-module name="users">
    <el-breadcrumb separator="/" style="margin-bottom:.5rem">
      <el-breadcrumb-item to="/dashboard">{{$t('user.breadcrumb.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('user.breadcrumb.current')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <data-table ref="users" @page-change="fetch">
      <div slot="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click.native="createUser">{{$t('operation.create')}}</el-button>
        <el-input placeholder="请输入查询内容" v-model="searchData" style="width: 50%">
          <el-select v-model="searchIndex" slot="prepend" placeholder="请选择" style="width: 120Px;">
            <el-option label="" value=""></el-option>
            <el-option label="姓名" value="name"></el-option>
            <el-option label="用户名" value="username"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click.native="searchUsers"></el-button>
        </el-input>
      </div>
      <el-table :data="users" border>
        <el-table-column property="name" :label="$t('user.model.name')" sortable min-width="120"></el-table-column>
        <el-table-column property="username" :label="$t('user.model.username')" sortable min-width="120"></el-table-column>
        <el-table-column property="rolename" :label="$t('user.model.role')" min-width="90"></el-table-column>
        <el-table-column property="mobileTel" :label="$t('user.model.mobileTel')" min-width="90"></el-table-column>
        <el-table-column property="companyName" :label="$t('user.model.companyName')" min-width="120"></el-table-column>
        <el-table-column property="companyID" :label="$t('user.model.companyID')" min-width="90"></el-table-column>
        <el-table-column :label="$t('operation.operation')" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click.native="deleteUser(scope.row)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="modifyUser(scope.row)"></el-button>
            <el-tooltip content="关联企业" placement="top">
              <el-button type="success" size="mini" icon="el-icon-circle-plus" @click.native="addSubCompanys(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </data-table>
    <el-dialog :title="$t('user.create.title')" :visible.sync="formVisible" @close="cancelForm">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form-item :label="$t('user.model.username')" prop="username">
          <el-input v-model="form.username" class="inputhalf" :disabled="form._id?true : false"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.name')" prop="name">
          <el-input v-model="form.name" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.role')" prop="role">
          <el-select v-model="form.role"  placeholder="请选择">
              <el-option v-for="(item, index) in roleOptions" :label="item.label" :value="item.value" :key="index">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.model.password')" prop="password" v-if="form._id?false : true">
          <el-input type="password" v-model="form.password" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.repassword')" prop="repassword" v-if="form._id?false : true">
          <el-input type="password" v-model="form.repassword" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.email')" prop="email">
          <el-input v-model="form.email" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.companyName')" prop="companyName">
          <el-input v-model="form.companyName" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.address')" prop="address">
          <el-input v-model="form.address" class="inputhalf"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.mobileTel')" prop="mobileTel">
          <el-input v-model="form.mobileTel" class="inputhalf" @keypress.native="onlyTelNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.tel')" prop="tel">
          <el-input v-model="form.tel" class="inputhalf"  @keypress.native="onlyTelNumber" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.model.head_img_url')" prop="head_img_url">
          <el-card v-if="form.head_img_url" style="width: 271px;line-height: 0" :body-style="{ padding: '0px' }">
            <img  :src="form.head_img_url" style="width:100%; height: 100%" @click="handleIconClick('head')"/>
          </el-card>
          <el-button v-else type="primary" icon="el-icon-picture" @click="handleIconClick('head')"></el-button>
        </el-form-item>
      </el-form>
      <div>
        <baidu-map :style="style"  :map-click="true" @ready="handler"
                    @dblclick="syncCenter"
                    :center="center"
                    :zoom="zoom"
                    @zoomend="syncZoom"
                    :scroll-wheel-zoom="true">
          <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"/>
          <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" :panel="false"></bm-local-search>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"/>
          <bm-marker :position="center" :dragging="true" @dragend="syncCenter"
                      animation="BMAP_ANIMATION_BOUNCE">
              <bm-label :content="form.name" :labelStyle="{color: 'red', fontSize : '14px'}" :offset="{width: -35, height: 30}"/>
          </bm-marker>
        </baidu-map>
        <el-form :inline="true">
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="keyword"></el-input>
          </el-form-item>            
          <el-form-item label="地区" prop="location">
            <el-input v-model="location"></el-input>
          </el-form-item>
        </el-form>          
      </div>      
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible=false">{{$t('confirm.cancel')}}</el-button>
        <el-button type="primary" @click.native="saveForm">{{$t('confirm.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('user.create.selectImage')" :visible.sync="imageFormVisible" @close="cancelImageForm">
      <img-upload :selectFlag="selectFlag" :previewFlag="previewFlag" @onimgselect="imgSelect"></img-upload>
    </el-dialog>
    <el-dialog :title="$t('user.create.addSubCompanys')" :visible.sync="subFormVisible" @close="cancelSubForm">
        <el-transfer filterable filter-placeholder="请输入企业名称" :titles="['未关联的企业', '已关联的企业']"
          v-model="subCompanys"
          :data="subCompanyList">
        </el-transfer>   
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="subFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="saveSubCompanys">确 定</el-button>
        </span>          
    </el-dialog>
  </content-module>
</template>
<script>
import DataTable from 'components/DataTable'
import ImgUpload from 'components/ImgUpload'
import { user as userRes } from 'resources'
import locales from 'locales/users'
import { mapGetters } from 'vuex'

export default {
  locales,
  data () {
    var validatePasswd = (rule, value, callback) => {
      if (this.form.password !== value) {
        callback(new Error('二次输入的密码不一致'))
      } else {
        callback()
      }
    }
    var validateMobileTel = (rule, value, callback) => {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
      if (!myreg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      search: {
      },
      form: {
        username: '',
        password: '',
        repassword: '',
        name: '',
        role: '',
        email: '',
        mobileTel: '',
        tel:'',
        head_img_url: '',
        companyName: '',
        companyID: '',
        address: '',
        longitude: 0, //  经度
        latitude: 0   //  纬度
      },
      style:{
        width:'100%',
        height: '300px'
      },
      center: {
        lng: 0,
        lat: 0
      },
      zoom: 15,
      labelContent: '',
      keyword: '',
      location: '',
      rules: {
        mobileTel: [{
          required: true, message: this.$t('user.rules.mobileTel'), trigger: 'blur'
        }, {
          validator: validateMobileTel, trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('user.rules.password'), trigger: 'blur'
        }],
        role: [{
          required: true, message: this.$t('user.rules.role'), trigger: 'blur'
        }],
        repassword: [{
          required: true, message: this.$t('user.rules.repassword'), trigger: 'blur'
        }, {
          validator: validatePasswd, trigger: 'blur'
        }],
        username: [{
          required: true, message: this.$t('user.rules.username'), trigger: 'blur'
        }],
        tel: [{
          required: true, message: this.$t('user.rules.tel'), trigger: 'blur'
        }],
        companyName: [{
          required: true, message: this.$t('user.rules.companyName'), trigger: 'blur'
        }],
        address: [{
          required: true, message: this.$t('user.rules.address'), trigger: 'blur'
        }]
      },
      formVisible: false,
      users: [],
      roleOptions: [
        {
          value: 'admin',
          label: '超级管理员'
        },
        {
          value: 'gov',
          label: '政府'
        },
        {
          value: 'company',
          label: '企业'
        }
      ],
      rolename: {
          admin: '超级管理员',
          gov: '政府',
          company: '企业'
      },
      searchData: '',
      searchIndex: '',
      imageFormVisible: false,
      previewFlag: false,
      selectFlag: true,
      uploadImgName: '',
      subFormVisible: false,
      subCompanys:[],
      subCompanyList:[]
    }
  },
  components: {
    DataTable,
    ImgUpload
  },
  methods: {
    fetch (current = 1) {
      this.$refs.users.query(userRes, current, { search: this.search }).then(list => {
        this.users = list.map(n => {
          n['rolename'] = this.rolename[n.role]
          return n
        })
      }).catch(err => {
        console.error(err)
      })
    },
    createUser () {
      this.initForm()
      this.formVisible = true
    },
    initForm () {
      for (var key in this.form) {
        this.form[key] = '';
      }
      this.zoom = 15
      this.center.lat = 0
      this.center.lng = 0   
      this.keyword = ''
      this.location = ''   
      delete (this.form._id)
    },
    searchUsers () {
      if (this.searchIndex === 'name') {
        this.search = { name : this.searchData }
      } else if (this.searchIndex === 'username') {
        this.search = { username : this.searchData }
      } else {
        this.search = {}
      }
      this.fetch()
    },
    cancelForm () {
      this.$refs.form.resetFields()
      this.formVisible = false
    },
    saveForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let promise
          if (this.form._id) {
            promise = userRes.update({ _id: this.form._id }, this.form)
          } else {
            promise = userRes.save(null, this.form)
          }
          promise.then(() => {
            this.cancelForm()
            this.$message({
              type: 'success',
              message: this.form._id ? this.$t('message.updated') : this.$t('message.created')
            })
            this.initForm();
            this.fetch()
          }).catch((err) => {
            const errMsg = this.form._id ? this.$t('message.updateFailed') : this.$t('message.createFailed')
            this.$message({
              type: 'error',
              message: err.status === 422 ? this.$t('user.action.userExisted') : errMsg
            })
          })
        }
      })
    },
    modifyUser (userinfo) {
      this.initForm()
      Object.assign(this.form, userinfo)
      this.center.lat = this.form.latitude
      this.center.lng = this.form.longitude
      this.zoom = 15
      if (this.BMap && this.map) {
        const point = new this.BMap.Point(this.form.longitude, this.form.latitude)
        this.map.centerAndZoom(point, this.zoom)
      }

      this.formVisible = true
    },
    deleteUser (user) {
      this.$confirm(`是否确定要删除用户: ${user.username}, 确定后将删除?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        userRes.delete({ _id: user._id }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
          this.fetch()
        })
      }).catch(() => {})
    },
    imgSelect (url) {
      if (this.uploadImgName === 'head') {
        this.form.head_img_url = url
      } 
      this.cancelImageForm()
    },
    handleIconClick (ev) {
      this.imageFormVisible = true
      this.imgVisibility = true
      this.uploadImgName = ev
    },
    cancelImageForm () {
      this.imageFormVisible = false
    },
    syncCenter (e) {
      // const { lng, lat } = e.target.getCenter()
      console.log(e)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this.form.longitude = e.point.lng //  经度
      this.form.latitude = e.point.lat //  纬度
    },
    syncZoom (e) {
      this.zoom = e.target.getZoom()
    },
    onlyTelNumber (event) {
      if (event.keyCode !== 45 && (event.keyCode < 48 || event.keyCode > 57)) {
        event.returnValue = false
      }
    },
    handler ({BMap, map}) {
      this.center.lat = this.form.latitude
      this.center.lng = this.form.longitude
      this.zoom = 15
      this.BMap = BMap
      this.map = map
    },
    addSubCompanys (scope) {
      this.subFormVisible = true
      const index = scope.$index
      const user = this.users[index]
      this.form._id = user._id
      this.getAllCompanys(user)
    },
    cancelSubForm () {
      this.subCompanys = []
      this.subCompanyList = []
      this.subFormVisible = false
    },
    saveSubCompanys() {
      const mySubCompanys = this.subCompanys
      userRes.updateCompanys({ id: this.form._id }, mySubCompanys).then( res => {
            this.cancelSubForm()
            this.$message({
              type: 'success',
              message: '关联企业成功'
            })
            this.fetch()
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: '关联企业失败'
            })
          })
    },
    getAllCompanys(user) {
      this.subCompanys = []
      this.subCompanyList = []
      const companys = user.subCompanys
      userRes.getCompanys().then( (res) => {
        if (!res.data || res.data.length === 0) {
          console.log('未获取到企业列表')
          return
        }
        res.data.forEach(element => {
             const companyItem = { label: element.companyName, key: element.companyID }
             for (const n in companys) {
               if (companys[n] === companyItem.key) {
                 this.subCompanys.push(companyItem.key)
                 break;
               }
             }
             if (companyItem.key !== user.companyID) {
               this.subCompanyList.push(companyItem)
             }
        });
      })
    }
  },
  computed: {
    ...mapGetters([
      'userRole'
    ])
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
  .el-checkbox {
    cursor: pointer;
    display: block;
    position: relative;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0;
  }    
  .el-transfer-panel__filter {
      text-align: center;
      margin: 15px;
      box-sizing: border-box;
      display: block;
      width: auto;
  }  
</style>

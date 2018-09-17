import Vue from 'vue'
// users resource
export const user = Vue.resource('user{/_id}', {}, {
  changePassword: { method: 'put', url: 'user{/id}/password' },
  forgetPassword: { method: 'post', url: 'user/forgetpwd' },
  getFarmers: { method: 'get', url: 'user/getall' },
  getCompanys: { method: 'get', url: 'user/companys' },
  updateCompanys: { method: 'put', url: 'user/modifySubcompanys{/id}' },
  forgetPasswordByTel: { method: 'post', url: 'user/forgetpwdByTel' }
})
// 区域码的获取
export const region = Vue.resource('regions{/_id}', {}, {
  getByjinpin: { method: 'get', url: 'regions/findByJinpin' },
  findByRegion: { method: 'get', url: 'regions/findByRegion' },
  getRegionbyId: { method: 'get', url: 'regions/findByRegionid' }
})

// 图片管理
export const imgmng = Vue.resource('imgmng{/_id}', {}, {
  delImg: { method: 'put', url: 'imgmng/delimg' },
  saveImg: { method: 'post', url: 'imgmng/saveimg' },
  getPolicy: { method: 'get', url: 'alioss' }
})

// 广告图片管理
export const advertmng = Vue.resource('banner{/_id}', {}, {
  getBannerById: { method: 'get', url: 'banner/getbannerById' }
})


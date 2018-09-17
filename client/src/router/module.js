export default [{
  path: '/dashboard',
  component: (resolve) => {
    import('../view/Dashboard.vue').then(resolve)
  }
}, {
  path: '/users',
  component: (resolve) => {
    import('../view/UserList.vue').then(resolve)
  }
}, {
  path: '/imgmanger',
  component: (resolve) => {
    import('../view/imgmng/imgManger.vue').then(resolve)
  }
}, {
  path: '/advertmanger',
  component: (resolve) => {
    import('../view/imgmng/advertMng.vue').then(resolve)
  }
}
]


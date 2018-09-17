<template>
  <transition name="menu">
    <div v-if="loggedIn" id="app-menu">
      <router-link class="logo-wrapper" to="/" exact>往来管理系统</router-link>
      <el-menu :default-active="$route.path" background-color="#324057" text-color="#fff" active-text-color="#ffd04b" :router="true" style="width:100%;">
        <el-menu-item index="/users" v-if="userRole === 'admin'"><i class="iconmoon-user-tie"></i>{{$t('menu.users')}}</el-menu-item>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-upload2"></i>素材管理</template>
          <el-menu-item index="/imgmanger">{{$t('menu.imgmanger')}}</el-menu-item>
          <el-menu-item index="/advertmanger">{{$t('menu.advertmanger')}}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import locales from 'locales/menu'
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'
export default {
  locales,
  computed: {
    ...mapGetters(['loggedIn', 'userRole'])
  },
  components: {
    [Menu.name]: Menu,
    [Submenu.name]: Submenu,
    [MenuItem.name]: MenuItem,
    [MenuItemGroup.name]: MenuItemGroup
  }
}
</script>
<style lang="stylus">
@import "../assets/css/variable"
@import "../assets/fonts/icommon.css"
.menu-enter-active
.menu-leave-active
  transition all .5s
.menu-enter
.menu-leave-active
  margin-left -($menu-width)
#app-menu
  width $menu-width
  min-width @width
  background-color $color-black-light
  overflow auto
  .logo-wrapper
    display block
    padding-left 1rem
    height $header-height
    line-height @height
    color #fff
    font-size 1.25rem
    background-color #435065
  .el-submenu
  .el-menu-item
    .iconfont
      margin-right 10px
  [class^="iconmoon"], [class*=" iconmoon"]
      margin-right 10px
</style>

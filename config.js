/**
 * Project config file includes dev/prod and frontend/backend
 */
var path = require('path')
var _ = require('lodash')
var backendBase = {
  // Root path of server
  root: path.normalize(__dirname),
  uploads: path.join(__dirname, '/client/dist/static/uploads'),
  download: path.join(__dirname, '/client/dist/static/download'),
  qrImg: path.join(__dirname, '/client/dist/mobile/images/'),
  // Server port
  port: process.env.PORT || 7001,

  baiduMapAK: 'QmZxA72IYTcCEkCiO6vFID7egs7FWjHT',
  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SECRET || 'wanlaifront'
  },

  // List of user roles
  userRoles: ['guest', 'users', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
}

var development = {
  frontend: {
    port: 8001,
    assetsRoot: path.resolve(__dirname, './client/src'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': { target: 'http://localhost:' + backendBase.port, changeOrigin: true },
      '/static': { target: 'http://localhost:' + backendBase.port, changeOrigin: true },
      '/static/download/**': { target: 'http://localhost:' + backendBase.port, changeOrigin: true },
      '/socket.io': { target: 'http://localhost:' + backendBase.port, changeOrigin: true, ws: true }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
var production = {
  frontend: {
    index: path.resolve(__dirname, './client/dist/index.html'),
    assetsRoot: path.resolve(__dirname, './client/dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
}

var config = process.env.NODE_ENV === 'production' ? production : development

module.exports = _.assign({}, config)

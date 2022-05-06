const path = require('path')
const Check = require('./plugins/check')
const Voives = require('./plugins/voices')

process.env.VUE_APP_LAST_UPDATE = Date.now()
process.env.BASE_URL = 'dev'

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        stylusOptions: {
          import: [path.join(__dirname, './setting/color.styl')]
        }
      }
    }
  },
  configureWebpack: () => {
    return {
      plugins: [
        new Check(),
        new Voives()
      ],
      performance: {
        hints: false
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial' // 只打包初始时依赖的第三方
            },
            corejs: {
              name: 'chunk-corejs', // 单独将 core-js 拆包
              priority: 15,
              test: /[\\/]node_modules[\\/]core-js[\\/]/
            }
          }
        }
      }
    }
  },
  devServer:{
    host:'192.168.1.118',
    port:8081,
    open:false,
    proxy:{
      // 192.168.1.118:8081/tongji/xxxx => https://openapi.baidu.com/rest/2.0/tongji/xxxx
      '/tongji':{
        target: 'https://openapi.baidu.com/rest/2.0',
        changeOrigin: true,
        ws:true,
        // pathRewrite: {
        //   // 重新路由  localhost:8888/api/login  => www.baidu.com/api/login
        //   '^/tongji': '' // 假设我们想把 localhost:8888/api/login 变成www.baidu.com/login 就需要这么做 
        // }
      },

      // '/tongji':{
      //   target: 'https://openapi.baidu.com/rest/2.0/tongji',
      //   changeOrigin: true,
      //   ws:true,
      //   pathRewrite: {
      //     // 重新路由  localhost:8888/api/login  => www.baidu.com/api/login
      //     '^/tongji': '' // 假设我们想把 localhost:8888/api/login 变成www.baidu.com/login 就需要这么做 
      //   }
      // }
    }
  }
}

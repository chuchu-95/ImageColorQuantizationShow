const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://127.0.0.1:8000',
  },
})

// vue.config.js
// const path = require('path');

// module.exports = {
//   configureWebpack: {
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, 'src/')
//       }
//     }
//   }
// }



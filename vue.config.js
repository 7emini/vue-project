const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        // 注册全局CSS
        additionalData: `@import "./src/styles/main.scss";`,
      },
    },
  },
  configureWebpack: {
    // element-plus 按需引入样式
    plugins: [require("unplugin-element-plus/webpack")({})],
  },

  devServer: {
    open: false, // 编译完成是否打开网页
    host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: false, // 开启热加载
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_DEV_TARGET, //API服务器的地址  http://www.web-jshtml.cn/api/v3
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_API}`]: "",
        },
      },
    },
  },
});
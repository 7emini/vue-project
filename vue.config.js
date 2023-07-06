const { defineConfig } = require("@vue/cli-service");

const path = require("path");

const resolve = (dir) => path.join(__dirname, dir);

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 注册全局CSS
        additionalData: `@import "./src/styles/main.scss";`,
      },
    },
    // requireModuleExtension: true,
  },
  configureWebpack: {
    // element-plus 按需引入样式
    plugins: [require("unplugin-element-plus/webpack")({})],
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@':path.resolve(__dirname, './src'),
        '@u':path.resolve(__dirname, './src/utils'),
        '@a':path.resolve(__dirname, './src/apis'),
        '@c':path.resolve(__dirname, './src/components'),

      }
    }
  },

  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/components/svgIcon/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/components/svgIcon/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
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

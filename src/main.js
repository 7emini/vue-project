import 'default-passive-events' //控制台warn解决[Violation] Added non-passive event listener to a scroll-blocking ‘mousewheel‘ event. Consi https://blog.csdn.net/Wildness_/article/details/123190078

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/permit";
import store from "./store";

import ElementUi from "./plugins/elementui";

// 批量导入svg文件
import "@/components/svgIcon/svg";

// svgicon
import SvgIcon from "@/components/svgIcon/Index.vue";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementUi);
app.component("svg-icon", SvgIcon);
app.mount("#app");


// element-plus的el-table组件ResizeObserver loop limit exceeded错误 https://juejin.cn/post/7234703748403839036
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}
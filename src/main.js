import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
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

import { getToken } from "@/utils/cookies";
import router from "./index";

router.beforeEach((to, from, next) => {
  // 如果没有保存token
  if (!getToken()) {
    // 如果目标路由名称不是login
    if (to.name !== "login") {
      next("login");
    }
    next();
  } else {
    // 已登陆用户无法再次登录
    if (to.name == "login") {
        // next(from);
        next(from);
    }
    next();
  }
});

router.afterEach((to, from) => {});

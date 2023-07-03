import { getToken } from "@/utils/cookies";
import router from "./index";

router.beforeEach((to, from)=>{
    // 如果没有保存token
    if (!getToken()){
        // 如果目标路由名称不是login
        if (to.name !== "login"){
            // 跳转到login路由
            return {
                name:"login"
            }
        }
    }
});

router.afterEach((to, from)=>{
});
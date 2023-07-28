import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "index",
    redirect: "console",
    hidden: true,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/Login.vue"),
    hidden: true,
  },
  {
    path: "/home",
    name: "home",
    meta: {
      title: "控制台",
      icon:"home",
    },
    component: () => import("../views/layout/Index.vue"),
    children: [
      {
        path: "/console",
        name: "console",
        meta: {
          title: "首页",
        },
        component: () => import("../views/console/Index.vue"),
      },
    ],
  },
  {
    path: "/news",
    name: "news",
    meta: {
      title: "信息管理",
      icon: "information",
    },
    component: () => import("../views/layout/Index.vue"),
    children: [
      {
        path: "/news-index",
        name: "news-index",
        meta: {
          title: "信息列表",
        },
        component: () => import("../views/info/Index.vue"),
      },
      {
        path: "/news-category",
        name: "news-category",
        meta: {
          title: "信息分类",
        },
        component: () => import("../views/info/Category.vue"),
      },
      {
        path: "/news-detailed",
        name: "news-detailed",
        meta: {
          title: "信息详情",
        },
        component: () => import("../views/info/Detailed.vue"),
      },
    ],
  },
  {
    path:"/system",
    meta: {
      title:"系统配置",
      icon:"system",
    },
    component:()=>import("../views/layout/Index"),
    children: [
      {
        path: "/user",
        name: "user",
        meta: {
          title: "用户列表",
        },
        component: () => import("../views/system/User.vue"),
      },
      {
        path: "/role",
        name: "role",
        meta: {
          title: "角色列表",
        },
        component: () => import("../views/system/Role.vue"),
      },
      {
        path: "/menu",
        name: "menu",
        meta: {
          title: "菜单列表",
        },
        component: () => import("../views/system/Menu.vue"),
      },
    ]
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/layout/Index.vue"),
    meta: {
      title: "测试",
      icon: "ceshi",
    },
    children: [
      {
        path: "/test1",
        component: () => import("../views/test/Test1.vue"),
        meta: {
          title: "测试1",
        },
      },
      {
        path: "/test2",
        component: () => import("../views/test/Test2.vue"),
        meta: {
          title: "测试2",
        },
      },
      {
        path: "/test3",
        component: () => import("../views/test/Test3.vue"),
        meta: {
          title: "测试3",
        },
      },
    ],
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;

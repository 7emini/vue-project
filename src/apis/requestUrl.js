const apiUrl = {
  info: {
    list: {
      url: "/news/getList/",
      method: "post",
    },
    info_status: {
      url: "/news/status/",
      method: "post"
    },
    delete: {
      url: "/news/delete/",
      method:"post",
    }
  },
  cascader: {
    category: {
      url: "/news/getCategoryAll/",
      method: "post",
    }
  },
  menu: {
    list: {
      url:"/menu/listsTree",
      method:"post",
    },
    delete: {
      url: "/menu/remove",
      method: "post",
    },
    hidden_status: {
      url:"/menu/statusHidden",
      method:"post",
    },
    disabled_status: {
      url:"/menu/statusDisabled",
      method:"post",
    }
  }
};

export default apiUrl;

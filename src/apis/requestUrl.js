const apiUrl = {
  info: {
    list: {
      url: "/news/getList/",
      method: "post",
    },
    info_status: {
      url: "/news/status/",
      method: "post"
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
    }
  }
};

export default apiUrl;

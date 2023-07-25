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
  }
};

export default apiUrl;

import instance from "@/utils/request";

/**
 * 添加父级分类
 * @param {*} data
 * @returns
 */

export function firstCategoryAdd(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data,
  });
}

/**
 * 添加子级分类
 * @param {*} data
 * @returns
 */
export function childCategoryAdd(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data,
  });
}

/**
 * 分类列表
 * @param {*} data
 * @returns
 */
export function getCategory(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/getCategoryAll/",
    data,
  });
}

/**
 * 编辑分类
 * @param {*} data
 * @returns
 */
export function categoryEdit(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/editCategory/",
    data,
  });
}

/**
 * 删除分类
 * @param {*} data
 * @returns
 */
export function categoryDelete(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/deleteCategory/",
    data,
  });
}

/**
 * 提交创建
 * @param {*} data
 * @returns
 */
export function infoCreate(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/add/",
    data,
  });
}

/**
 * 获取列表数据
 * @param {*} data
 * @returns
 */
export function getTableList(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/getList/",
    data,
  });
}

/**
 * 更改列表的发布状态
 * @param {*} data
 * @returns
 */
export function status(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/status/",
    data,
  });
}

/**
 * 更改列表的发布状态
 * @param {*} data
 * @returns
 */
export function deleteData(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/delete/",
    data,
  });
}

/**
 * 获取详情
 * @param {*} data
 * @returns
 */
export function getDetailed(data = {}) {
  return instance.request({
    method: "get",
    url: "/news/detailed/",
    params: data,
  });
}

export function infoEdit(data = {}) {
  return instance.request({
    method: "post",
    url: "news/editInfo/",
    data,
  });
}

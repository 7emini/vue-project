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


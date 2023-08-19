import request from '@/api/request'

/**
 * 查找文章列表
 * @param {number} start 第几页页
 * @param {number} limit 当前多少条数据
 * @param {object} data  查找对象{}
 * @returns
 */
export function findArticles(start, limit, data) {
  return request({
    url: `/lejuAdmin/productArticle/findArticles/${start}/${limit}`,
    method: 'post',
    data
  })
}

/**
 * 更新文章的 显示状态
 * @param {*object} data id和isSHow
 * @returns
 */
export function changeShowStatus(data) {
  return request({
    url: `/lejuAdmin/productArticle/changeShowStatus`,
    method: 'post',
    data
  })
}

/**
 * 删除当前 文章  需要传id
 * @param {number} id
 * @returns
 */
export function delThisArticle(id) {
  return request({
    url: `/lejuAdmin/productArticle/del/${id}`,
    method: 'DELETE'
  })
}

/**
 * 添加文章
 * @param {object} data
 * @returns
 */
export function addArticle(data) {
  return request({
    url: `/lejuAdmin/productArticle/addArticle`,
    method: 'post',
    data
  })
}

/**
 * 获取文章详情
 * @param {number} id
 * @returns
 */
export function productArticle(id) {
  return request({
    url: `/lejuAdmin/productArticle/productArticle/${id}`
  })
}

/**
 *编辑更新文章
 * @param {object} data
 * @returns
 */
export function updateArticle(data) {
  return request({
    url: `/lejuAdmin/productArticle/updateArticle`,
    method: 'post',
    data
  })
}


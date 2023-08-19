import request from '@/api/request'

/**
 * 品牌管理分页
 * @param {*} start
 * @param {*} limit
 * @returns
 */
export function findBrandByPage(start, limit) {
  return request({
    url: `/lejuAdmin/brand/findBrandByPage/${start}/${limit}`
  })
}

/**
 *获取品牌列表
 * @returns 品牌列表
 */
export function getfindAllBrand() {
  return request({
    url: `/lejuAdmin/brand/findAllBrand`
  })
}

/**
 * 设置品牌展示和隐藏
 * @param {*} data
 * @returns
 */
export function switchShowStatus(data) {
  return request({
    url: `/lejuAdmin/brand/switchShowStatus`,
    method: 'post',
    data
  })
}

/**
 * 删除当前品牌
 * @param {*} id
 * @returns
 */
export function delBrand(id) {
  return request({
    url: `/lejuAdmin/brand/delBrand/${id}`,
    method: 'DELETE'
  })
}
/**
 * 新增品牌
 * @param {*} data
 * @returns
 */
export function addBrand(data) {
  return request({
    url: `/lejuAdmin/brand/addBrand`,
    method: 'post',
    data
  })
}

/**
 * 更新品牌
 * @param {*} data
 * @returns
 */
export function updateBrand(data) {
  return request({
    url: `/lejuAdmin/brand/updateBrand`,
    method: 'post',
    data
  })
}

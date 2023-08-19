
import request from '@/api/request'

/**
 * 获取品牌列表
 * @returns
 */
export function findAllBrand() {
  return request({
    url: '/lejuAdmin/brand/findAllBrand'
  })
}

/**
 * 获取商品列表
 * @param {*} start
 * @param {*} limit
 * @param {*} data
 * @returns
 */
export function productsByPage(start, limit, data) {
  return request({
    url: `/lejuAdmin/product/productsByPage/${start}/${limit}`,
    method: 'post',
    data
  })
}

/**
 *获取所有分类列表
 * @returns 所有分类列表
 */
export function getAllCategory() {
  return request({
    url: `/lejuAdmin/category/getAllCategory`

  })
}

/**
 * 添加商品信息
 * @param {object} data
 * @returns
 */
export function addProductAndSkus(data) {
  return request({
    url: `/lejuAdmin/product/addProductAndSkus`,
    method: 'post',
    data
  })
}

/**
 *  获取当前产品的详细信息
 * @param {number} id
 * @returns  商品信息
 */
export function ProductDetail(id) {
  return request({
    url: `/lejuAdmin/product/productSkusDetail/${id}`
  })
}

/**
 * 删除当前产品
 * @param {number} id
 * @returns
 */
export function delProductDetail(id) {
  return request({
    url: `/lejuAdmin/product/del/${id}`,
    method: 'DELETE'
  })
}

/**
 * 更新商品信息
 * @param {object} data
 * @returns
 */
export function updateProductAndSkus(data) {
  return request({
    url: `/lejuAdmin/product/updateProductAndSkus`,
    method: 'post',
    data
  })
}

/**
 * 获取当前商品的sku库存
 * @param {number} id
 * @returns 当前商品的sku库存
 */
export function getSkusByProductId(id) {
  return request({
    url: `/lejuAdmin/sku/getSkusByProductId/${id}`
  })
}

/**
 * 删除sku信息
 * @param {number} id
 * @returns
 */
export function delSku(id) {
  return request({
    url: `/lejuAdmin/sku/delSku/${id}`,
    method: 'DELETE'
  })
}

/**
 * 更新sku库存信息
 * @param {object} data
 * @returns
 */
export function updateSkuInfo(data) {
  return request({
    url: `/lejuAdmin/sku/updateSkuInfo`,
    method: 'post',
    data
  })
}

/**
 * 添加sku库存信息
 * @param {object} data
 * @returns
 */
export function addProductSkus(data) {
  return request({
    url: `/lejuAdmin/sku/addProductSkus`,
    method: 'post',
    data
  })
}

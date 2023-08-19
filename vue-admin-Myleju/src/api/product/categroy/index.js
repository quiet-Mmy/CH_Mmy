
import request from '@/api/request'

/**
 * 获取所有分类
 * @returns  分类列表
 */
export function getAllCategory() {
  return request({
    url: '/lejuAdmin/category/getAllCategory'
  })
}

/**
 * 更新分类
 * @returns
 */
export function updateCategory(data) {
  return request({
    url: '/lejuAdmin/category/updateCategory',
    method: 'post',
    data
  })
}

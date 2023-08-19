import request from '@/api/request'

/**
 * 查询素材列表
 * @param {number} start
 * @param {number} limit
 * @returns object 返回素材列表
 */
export function findMaterialByPage(start, limit) {
  return request({
    url: `/lejuAdmin/material/findMaterialByPage/${start}/${limit}`
  })
}

/**
 * 删除当前所选的文章
 * @param {number} id
 * @returns
 */
export function delMaterial(id) {
  return request({
    url: `/lejuAdmin/material/delMaterial/${id}`,
    method: 'DELETE'
  })
}

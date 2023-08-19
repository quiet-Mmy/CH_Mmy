import request from '@/api/request'

/**
 * 获取角色列表
 * @param {*} start
 * @param {*} limit
 * @returns
 */
export function findrolesList(start, limit) {
  return request({
    url: `/admin/sysAuth/role/findRolesByPage/${start}/${limit}`
  })
}

/**
 * 获取角色明细
 * @param {*} id
 * @returns
 */
export function findRolePermissions(id) {
  return request({
    url: `/admin/sysAuth/role/findRolePermissions/${id}`
  })
}

/**
 * 获取全部角色信息
 * @returns
 */
export function findAllRoles() {
  return request({
    url: `/admin/sysAuth/role/findAllRoles`
  })
}

/**
 * 获取全部的菜单
 * @returns
 */
export function findAllMenus() {
  return request({
    url: `/admin/sysAuth/index/getInitMenus`
  })
}

/**
 * 删除角色信息
 * @param {*} id
 * @returns
 */
export function removeRole(id) {
  return request({
    url: `/admin/sysAuth/role/removeRole/${id}`,
    method: 'delete'
  })
}

/**
 * 新增角色信息
 * @param {*} data
 * @returns
 */
export function saveRolePermissions(data) {
  return request({
    url: `/admin/sysAuth/role/saveRolePermissions`,
    method: 'post',
    data
  })
}

/**
 * 更新角色和权限
 * @param {*} id
 * @returns
 */
export function updateRolePermissions(data) {
  return request({
    url: `/admin/sysAuth/role/updateRolePermissions`,
    method: 'put',
    data
  })
}

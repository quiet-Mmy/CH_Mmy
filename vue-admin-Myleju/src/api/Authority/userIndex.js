import request from '@/api/request'

/**
 * 获取用户管理列表
 * @param {*} start
 * @param {*} limit
 * @param {*} data
 * @returns  用户列表
 */
export function findUsersByPage(start, limit, data) {
  return request({
    url: `/admin/sysAuth/user/findUsersByPage/${start}/${limit}`,
    method: 'post',
    data
  })
}

/**
 *  获取当前用户的详细信息
 * @param {*} id
 * @returns
 */
export function user(id) {
  return request({
    url: `/admin/sysAuth/user/${id}`
  })
}

/**
 *
 * @returns 全部的角色列表
 */
export function findAllRoles() {
  return request({
    url: `/admin/sysAuth/role/findAllRoles`
  })
}

/**
 * 删除当前用户
 * @param {*} id
 * @returns
 */
export function removeUser(id) {
  return request({
    url: `/admin/sysAuth/user/removeUser/${id}`,
    method: 'delete'
  })
}

/**
 * 新增用户
 * @param {*} data
 * @returns
 */
export function saveUserRoles(data) {
  return request({
    url: `/admin/sysAuth/user/saveUserRoles`,
    method: 'post',
    data
  })
}

/**
 * 更新用户信息
 * @param {*} data
 * @returns
 */
export function updateUserRoles(data) {
  return request({
    url: `/admin/sysAuth/user/updateUserRoles`,
    method: 'put',
    data
  })
}


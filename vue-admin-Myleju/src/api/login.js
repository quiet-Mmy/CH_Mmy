import request from '@/api/request'

/**
 *
 * @param {object} data
 * @returns 用户登录  返回token
 */
export function login(data) {
  return request({
    url: '/lejuAdmin/index/login',
    method: 'post',
    data
  })
}

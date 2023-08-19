import request from '@/api/request'

/**
 *
 * @returns 查询所有菜单
 */
export function getInitMenus() {
  return request({
    url: `/admin/sysAuth/index/getInitMenus`
  })
}

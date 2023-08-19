import request from '@/api/request'

/**
 * 地址列表
 * @returns Arr
 */
export function addressList() {
  return request({
    url: '/lejuAdmin/companyAddress/addressList'
  })
}

/**
 * 设置默认 发货！ 地址
 * @param {id} data
 * @returns
 */
export function setSendOne(data) {
  return request({
    url: '/lejuAdmin/companyAddress/setSendOne',
    method: 'post',
    data
  })
}

/**
 * 新增地址
 * @param {object} data
 * @returns list
 */
export function save(data) {
  return request({
    url: '/lejuAdmin/companyAddress/save',
    method: 'post',
    data
  })
}

/**
 * 获取地址详情 用于回显
 * @param {number} id
 * @returns object
 */
export function getIdAddress(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`
  })
}

/**
 * 更新地址
 * @param {Object} data
 * @returns
 */
export function update(data) {
  return request({
    url: `/lejuAdmin/companyAddress/update`,
    method: 'post',
    data
  })
}

/**
 * 删除当前地址
 * @returns
 */
export function DELAddress(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`,
    method: 'DELETE'
  })
}


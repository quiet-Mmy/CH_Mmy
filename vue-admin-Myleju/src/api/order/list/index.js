import request from '@/api/request'

/**
 * 获取订单列表
 * @param {*} start
 * @param {*} limit
 * @param {*} data
 * @returns  根据状态返回列表
 */
export function findOrdersByPage(start, limit, data) {
  return request({
    url: `/lejuAdmin/order/findOrdersByPage/${start}/${limit}`,
    method: 'post',
    data
  })
}

/**
 * 获取订单详情
 * @param {number} id
 * @returns 订单详情
 */
export function orderDetail(id) {
  return request({
    url: `/lejuAdmin/order/orderDetail/${id}`
  })
}

/**
 * 确认发货  字段id一定要对上
 * @param {object} data
 * @returns
 */
export function sendDone(data) {
  return request({
    url: `/lejuAdmin/order/sendDone`,
    method: 'post',
    data
  })
}


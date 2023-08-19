import { LEJU_ADMIN_TOKEN, LEJU_ADMIN_USERINFO } from '@/constants/index'

/**
 * 设置 token
 * @param {*} token  string
 *
 */
export function setToken(token) {
  window.localStorage.setItem(LEJU_ADMIN_TOKEN, token)
}

/**
 * 获取token
 * @returns string 返回token值
 */
export function getToken() {
  return window.localStorage.getItem(LEJU_ADMIN_TOKEN)
}

/**
 * 清除 token
 */
export function removeToken() {
  window.localStorage.removeItem(LEJU_ADMIN_TOKEN)
}

/**
 *
 * @param {*} userinfo 储存当前的用户信息  设置为字符串
 */
export function setUserinfo(userinfo) {
  try {
    window.localStorage.setItem(LEJU_ADMIN_USERINFO, JSON.stringify(userinfo))
  } catch (error) {
    console.log(error)
  }
}

/**
 *
 * @returns 返回拿到的字符串转换成对象
 */
export function getUserinfo() {
  try {
    return JSON.parse(window.localStorage.getItem(LEJU_ADMIN_USERINFO))
  } catch (error) {
    console.log(error)
  }
}

/**
 * 移除当前的userinfo信息
 */
export function removeUserinfo() {
  window.localStorage.removeItem(LEJU_ADMIN_USERINFO)
}

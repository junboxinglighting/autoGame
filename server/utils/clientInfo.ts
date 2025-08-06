import type { H3Event } from 'h3'
import { getHeaders, getRequestURL } from 'h3'

/**
 * 获取客户端真实IP地址
 * @param event H3Event对象
 * @returns 客户端IP地址
 */
export function getClientIP(event: H3Event): string {
  // 获取各种可能的IP头信息
  const headers = getHeaders(event)
  
  // 按优先级检查不同的IP头
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ]
  
  for (const header of ipHeaders) {
    const value = headers[header]
    if (value) {
      const ip = Array.isArray(value) ? value[0] : value
      // x-forwarded-for 可能包含多个IP，取第一个
      const cleanIP = ip.split(',')[0].trim()
      if (cleanIP && isValidIP(cleanIP)) {
        return cleanIP
      }
    }
  }
  
  // 如果没有找到代理IP，使用连接IP
  const nodeReq = event.node.req
  const socketAddress = nodeReq.socket?.remoteAddress
  
  if (socketAddress && isValidIP(socketAddress)) {
    return socketAddress
  }
  
  // 默认返回本地IP
  return '127.0.0.1'
}

/**
 * 检查IP地址是否有效
 * @param ip IP地址字符串
 * @returns 是否为有效IP
 */
function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') {
    return false
  }
  
  // IPv4正则表达式
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6正则表达式（简化版）
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  
  // 检查是否为私有IP或本地IP
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    return true
  }
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * 获取用户代理字符串
 * @param event H3Event对象
 * @returns 用户代理字符串
 */
export function getUserAgent(event: H3Event): string {
  const headers = getHeaders(event)
  return (headers['user-agent'] as string) || 'Unknown'
}

/**
 * 获取请求的完整URL
 * @param event H3Event对象
 * @returns 完整URL
 */
export function getFullURL(event: H3Event): string {
  const url = getRequestURL(event)
  return url.toString()
}

/**
 * 检查请求是否来自本地
 * @param event H3Event对象
 * @returns 是否为本地请求
 */
export function isLocalRequest(event: H3Event): boolean {
  const ip = getClientIP(event)
  const localIPs = ['127.0.0.1', '::1', 'localhost']
  return localIPs.includes(ip) || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')
}

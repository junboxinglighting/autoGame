import { TokenGenerator } from '../utils/tokenGenerator'
import type { JWTPayload } from '~/types/api'

export default defineEventHandler(async (event) => {
  // 只对需要认证的路由进行验证
  const url = getRouterParam(event, 'url') || event.node.req.url
  
  // 排除不需要认证的路由
  const publicRoutes = [
    '/api/codes/validate',
    '/api/payment/process',
    '/api/blacklist/check'
  ]

  const isPublicRoute = publicRoutes.some(route => url?.startsWith(route))
  
  // 排除登录接口
  if (url === '/api/login' || isPublicRoute) {
    return
  }

  // 检查是否是管理员接口
  const isAdminRoute = url?.startsWith('/api/admin/')
  
  if (isAdminRoute) {
    try {
      // 获取Authorization头
      const authHeader = getHeader(event, 'authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
          statusCode: 401,
          statusMessage: '缺少认证令牌'
        })
      }

      const token = authHeader.substring(7) // 移除 'Bearer ' 前缀
      
      // 验证JWT令牌
      const payload = TokenGenerator.verifyJWT(token)
      
      // 将用户信息添加到上下文中
      event.context.user = payload
      
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: '无效的认证令牌'
      })
    }
  }
})

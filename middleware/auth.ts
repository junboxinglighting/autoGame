export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端检查
  if (process.client) {
    // 等待一个tick确保localStorage可用
    setTimeout(() => {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
      
      if (!token) {
        return navigateTo('/login')
      }
    }, 0)
  }
})

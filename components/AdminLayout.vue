<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">激活码管理系统</h1>
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                to="/admin"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/admin' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                仪表板
              </NuxtLink>
              <NuxtLink
                to="/admin/generate"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/admin/generate' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                生成激活码
              </NuxtLink>
              <NuxtLink
                to="/admin/list"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/admin/list' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                激活码列表
              </NuxtLink>
              <NuxtLink
                to="/admin/blacklist"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/admin/blacklist' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                黑名单管理
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                @click="logout"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div class="md:hidden" v-show="mobileMenuOpen">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/admin"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/admin' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            仪表板
          </NuxtLink>
          <NuxtLink
            to="/admin/generate"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/admin/generate' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            生成激活码
          </NuxtLink>
          <NuxtLink
            to="/admin/list"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/admin/list' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            激活码列表
          </NuxtLink>
          <NuxtLink
            to="/admin/blacklist"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/admin/blacklist' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            黑名单管理
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- 面包屑导航 -->
        <nav class="flex mb-6" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <NuxtLink
                to="/admin"
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                仪表板
              </NuxtLink>
            </li>
            <li v-if="$route.path !== '/admin'">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ getCurrentPageName() }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- 页面内容 -->
        <slot />
      </div>
    </main>

    <!-- Toast组件 -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

// 获取当前页面名称
const getCurrentPageName = () => {
  const pathMap: Record<string, string> = {
    '/admin': '仪表板',
    '/admin/generate': '生成激活码',
    '/admin/list': '激活码列表',
    '/admin/blacklist': '黑名单管理'
  }
  return pathMap[route.path] || '未知页面'
}

const logout = async () => {
  try {
    // 清除本地存储的token
    if (process.client) {
      localStorage.removeItem('admin_token')
      sessionStorage.removeItem('admin_token')
    }
    
    // 重定向到登录页面
    await router.push('/login')
    
    // 显示成功消息
    const toastStore = useToastStore()
    toastStore.addToast('success', '已成功退出登录')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 检查用户是否已登录
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
    }
  }
})
</script>

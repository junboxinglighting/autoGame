<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          激活码管理系统
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          请登录您的管理员账户
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                autocomplete="username"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast组件 -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest, LoginResponse } from '~/types/api'

// 页面元信息
definePageMeta({
  layout: false
})

const router = useRouter()
const toastStore = useToastStore()

const form = reactive<LoginRequest & { rememberMe: boolean }>({
  username: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)

const handleLogin = async () => {
  if (!form.username || !form.password) {
    toastStore.addToast('error', '请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    const response = await $fetch<{
      success: boolean
      data: LoginResponse
      message: string
    }>('/api/login', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password
      }
    })

    if (response.success && response.data) {
      // 保存token
      const storage = form.rememberMe ? localStorage : sessionStorage
      storage.setItem('admin_token', response.data.token)
      
      // 保存用户信息
      storage.setItem('admin_user', JSON.stringify(response.data.user))

      toastStore.addToast('success', '登录成功')
      
      // 重定向到管理页面
      await router.push('/admin')
    } else {
      toastStore.addToast('error', response.message || '登录失败')
    }

  } catch (error: any) {
    console.error('登录失败:', error)
    const message = error.data?.message || '登录失败，请检查用户名和密码'
    toastStore.addToast('error', message)
  } finally {
    loading.value = false
  }
}

// 检查是否已登录
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    if (token) {
      router.push('/admin')
    }
  }
})
</script>

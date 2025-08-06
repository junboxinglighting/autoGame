<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 页面头部 -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">仪表板</h1>
        <p class="mt-1 text-sm text-gray-600">
          激活码系统概览和统计数据
        </p>
      </div>

      <!-- 统计卡片 -->
      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="stats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- 总激活码数 -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    总激活码数
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.totalCodes.toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- 已激活数 -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    已激活数
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.activatedCodes.toLocaleString() }}
                  </dd>
                  <dd class="text-sm text-green-600">
                    激活率: {{ stats.activationRate }}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- 已过期数 -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    已过期数
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.expiredCodes.toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- 总收入 -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    总收入
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    ¥{{ stats.totalRevenue.toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 每日激活趋势 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">每日激活趋势</h3>
          <div v-if="loading" class="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div v-else-if="stats && stats.dailyStats.length > 0" class="h-64">
            <!-- 这里可以集成图表库如Chart.js或ECharts -->
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="stat in stats.dailyStats.slice(0, 10)" 
                :key="stat.date"
                class="flex justify-between items-center py-2 border-b"
              >
                <span class="text-sm text-gray-600">{{ stat.date }}</span>
                <div class="flex space-x-4 text-sm">
                  <span class="text-blue-600">生成: {{ stat.generated }}</span>
                  <span class="text-green-600">激活: {{ stat.activated }}</span>
                  <span class="text-purple-600">收入: ¥{{ stat.revenue }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            暂无数据
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
          <div class="space-y-3">
            <NuxtLink
              to="/admin/generate"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              生成激活码
            </NuxtLink>
            
            <NuxtLink
              to="/admin/list"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              查看激活码列表
            </NuxtLink>
            
            <NuxtLink
              to="/admin/blacklist"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
              黑名单管理
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { StatsResponse } from '~/types/api'

// 页面元信息
definePageMeta({
  middleware: 'auth'
})

const toastStore = useToastStore()
const loading = ref(true)
const stats = ref<StatsResponse | null>(null)

const fetchStats = async () => {
  try {
    const token = process.client ? 
      localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') : 
      null

    if (!token) {
      await navigateTo('/login')
      return
    }

    const response = await $fetch<{
      success: boolean
      data: StatsResponse
      message: string
    }>('/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      stats.value = response.data
    } else {
      toastStore.addToast('error', response.message || '获取统计数据失败')
    }

  } catch (error: any) {
    console.error('获取统计数据失败:', error)
    const message = error.data?.message || '获取统计数据失败'
    toastStore.addToast('error', message)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取统计数据
onMounted(() => {
  fetchStats()
})
</script>

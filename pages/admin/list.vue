<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 页面头部 -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <button
              @click="$router.push('/admin')"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              返回仪表板
            </button>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mt-3">激活码列表</h1>
          <p class="mt-1 text-sm text-gray-600">
            查看和管理所有激活码
          </p>
        </div>
      </div>

      <!-- 激活码列表组件 -->
      <ClientOnly>
        <CodeList />
        <template #fallback>
          <div class="flex justify-center items-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">正在加载激活码列表...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
// 页面元信息
definePageMeta({
  middleware: 'auth'
})
</script>

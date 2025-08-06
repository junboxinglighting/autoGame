<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          激活码管理系统
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          游戏脚本激活码管理平台
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            管理员登录
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-4">系统功能</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900">激活码管理</h4>
              <p class="text-sm text-gray-600 mt-1">生成、验证、查询激活码状态</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900">支付集成</h4>
              <p class="text-sm text-gray-600 mt-1">支持支付宝、微信支付</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900">黑名单管理</h4>
              <p class="text-sm text-gray-600 mt-1">设备、IP、激活码黑名单</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900">统计报表</h4>
              <p class="text-sm text-gray-600 mt-1">使用率、收入统计分析</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast组件 -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
// 页面元信息
definePageMeta({
  layout: false
})

// 检查是否已登录，如果已登录则重定向到管理页面
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    if (token) {
      navigateTo('/admin')
    }
  }
})
</script>

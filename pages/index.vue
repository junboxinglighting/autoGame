<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面头部 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">激活码管理系统</h1>
        <p class="mt-2 text-sm text-gray-600">游戏脚本激活码管理平台 - 无需登录模式</p>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总激活码</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ total || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">已激活</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ activatedCount || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">未使用</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ unusedCount || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">已过期/吊销</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ expiredRevokedCount || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 生成激活码表单 -->
        <div class="lg:col-span-1">
          <GenerateForm />
        </div>

        <!-- 激活码列表 -->
        <div class="lg:col-span-2">
          <CodeList />
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

// 使用store
const activationCodesStore = useActivationCodesStore()

// 统计数据状态
const stats = ref({
  totalCodes: 0,
  activatedCodes: 0,
  unusedCodes: 0,
  expiredRevokedCodes: 0
})

// 计算属性 - 从统计API获取的数据
const total = computed(() => stats.value.totalCodes)
const activatedCount = computed(() => stats.value.activatedCodes)
const unusedCount = computed(() => stats.value.unusedCodes)
const expiredRevokedCount = computed(() => stats.value.expiredRevokedCodes)

// 获取统计数据的函数
const fetchStats = async () => {
  try {
    console.log('开始获取统计数据')
    const response = await $fetch<{
      success: boolean
      data: {
        totalCodes: number
        activatedCodes: number
        expiredCodes: number
        revokedCodes: number
      }
      message: string
    }>('/api/admin/stats')

    if (response.success && response.data) {
      stats.value = {
        totalCodes: response.data.totalCodes,
        activatedCodes: response.data.activatedCodes,
        unusedCodes: response.data.totalCodes - response.data.activatedCodes - response.data.expiredCodes - response.data.revokedCodes,
        expiredRevokedCodes: response.data.expiredCodes + response.data.revokedCodes
      }
      console.log('统计数据获取成功:', stats.value)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 如果统计API失败，回退到store中的数据
    const codes = activationCodesStore.codes
    stats.value = {
      totalCodes: activationCodesStore.total,
      activatedCodes: codes.filter(code => code.status === '已激活').length,
      unusedCodes: codes.filter(code => code.status === '未使用').length,
      expiredRevokedCodes: codes.filter(code => code.status === '已过期' || code.status === '已吊销').length
    }
  }
}

// 页面加载时获取数据
onMounted(async () => {
  console.log('Index page mounted, 开始获取数据')
  
  // 确保在客户端执行
  if (!process.client) {
    console.log('Index page: 非客户端环境，跳过数据获取')
    return
  }
  
  // 等待一个tick确保DOM完全加载
  await nextTick()
  
  // 并行获取统计数据和激活码列表
  try {
    await Promise.all([
      fetchStats(),
      activationCodesStore.fetchCodes()
    ])
    console.log('Index page mounted, 数据获取完成')
  } catch (error) {
    console.error('Index page mounted, 数据获取失败:', error)
  }
})
</script>

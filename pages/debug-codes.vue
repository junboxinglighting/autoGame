<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">激活码列表调试</h1>
    
    <div class="mb-6 space-y-2">
      <button @click="testFetchDirectly" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        直接测试 API
      </button>
      <button @click="testStore" class="bg-green-500 text-white px-4 py-2 rounded mr-2">
        测试 Store
      </button>
      <button @click="clearData" class="bg-red-500 text-white px-4 py-2 rounded">
        清空数据
      </button>
    </div>

    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h3 class="font-bold mb-2">调试信息:</h3>
      <pre class="text-sm">{{ debugInfo }}</pre>
    </div>

    <div class="mb-6 p-4 bg-blue-50 rounded">
      <h3 class="font-bold mb-2">Store 状态:</h3>
      <p>Loading: {{ store.loading }}</p>
      <p>Codes length: {{ store.codes.length }}</p>
      <p>Total: {{ store.total }}</p>
      <p>Current page: {{ store.currentPage }}</p>
    </div>

    <div v-if="store.codes.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">激活码</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="code in store.codes.slice(0, 5)" :key="code.activationCode">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ code.activationCode }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ code.status }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">¥{{ code.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const store = useActivationCodesStore()
const debugInfo = ref('')

const testFetchDirectly = async () => {
  try {
    debugInfo.value = '开始直接 API 测试...'
    
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    debugInfo.value += `\n令牌: ${token ? '存在' : '不存在'}`
    
    const response = await $fetch('/api/codes/list?page=1&pageSize=5', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    debugInfo.value += `\nAPI 响应: ${JSON.stringify(response, null, 2)}`
  } catch (error) {
    debugInfo.value += `\nAPI 错误: ${error.message}`
  }
}

const testStore = async () => {
  try {
    debugInfo.value = '开始 Store 测试...'
    await store.fetchCodes()
    debugInfo.value += `\nStore 执行完成\n状态: loading=${store.loading}, codes=${store.codes.length}, total=${store.total}`
  } catch (error) {
    debugInfo.value += `\nStore 错误: ${error.message}`
  }
}

const clearData = () => {
  store.codes = []
  store.total = 0
  debugInfo.value = '数据已清空'
}
</script>

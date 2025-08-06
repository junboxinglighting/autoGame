<template>
  <div class="p-8">
    <h1>Debug Page</h1>
    
    <div class="mb-4">
      <h2>客户端环境检查:</h2>
      <p>process.client: {{ processClient }}</p>
      <p>Token存在: {{ tokenExists }}</p>
      <p>Token内容: {{ tokenContent }}</p>
    </div>
    
    <div class="mb-4">
      <h2>Store状态:</h2>
      <p>Loading: {{ activationCodesStore.loading }}</p>
      <p>Codes数量: {{ activationCodesStore.codes.length }}</p>
      <p>Total: {{ activationCodesStore.total }}</p>
    </div>
    
    <div class="mb-4">
      <button @click="testFetch" class="bg-blue-500 text-white px-4 py-2 rounded">
        手动获取数据
      </button>
    </div>
    
    <div class="mb-4">
      <h2>调试日志:</h2>
      <div class="bg-gray-100 p-4 max-h-64 overflow-y-auto">
        <div v-for="(log, index) in debugLogs" :key="index" class="text-sm">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activationCodesStore = useActivationCodesStore()
const debugLogs = ref<string[]>([])

const processClient = ref(process.client)
const tokenExists = ref(false)
const tokenContent = ref('')

const addLog = (message: string) => {
  debugLogs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const checkToken = () => {
  if (process.client) {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    tokenExists.value = !!token
    tokenContent.value = token ? token.substring(0, 20) + '...' : ''
    addLog(`Token检查: ${tokenExists.value ? '存在' : '不存在'}`)
  }
}

const testFetch = async () => {
  addLog('开始手动获取数据')
  try {
    await activationCodesStore.fetchCodes()
    addLog(`获取成功，数量: ${activationCodesStore.codes.length}`)
  } catch (error) {
    addLog(`获取失败: ${(error as Error).message}`)
  }
}

onMounted(() => {
  addLog('Debug页面挂载完成')
  checkToken()
  
  // 定期检查token状态
  setInterval(checkToken, 1000)
})
</script>

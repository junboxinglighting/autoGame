<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">激活码列表测试</h1>
    
    <div class="mb-4">
      <button @click="testFetch" class="bg-blue-500 text-white px-4 py-2 rounded">
        测试获取数据
      </button>
    </div>
    
    <div class="mb-4">
      <p>Loading: {{ loading }}</p>
      <p>Total: {{ total }}</p>
      <p>Codes count: {{ codes?.length || 0 }}</p>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      错误: {{ error }}
    </div>
    
    <pre class="bg-gray-100 p-4 rounded text-sm">{{ JSON.stringify(codes?.slice(0, 2), null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
// 移除认证检查用于测试
definePageMeta({
  middleware: () => {}
})

const activationCodesStore = useActivationCodesStore()

const loading = computed(() => activationCodesStore.loading)
const codes = computed(() => activationCodesStore.codes)
const total = computed(() => activationCodesStore.total)

const error = ref('')

const testFetch = async () => {
  try {
    error.value = ''
    await activationCodesStore.fetchCodes()
  } catch (e: any) {
    error.value = e.message
  }
}

onMounted(() => {
  testFetch()
})
</script>

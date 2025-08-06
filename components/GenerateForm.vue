<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-6">生成激活码</h2>
    
    <form @submit.prevent="generateCodes" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- 生成数量 -->
        <div>
          <label for="count" class="block text-sm font-medium text-gray-700">
            生成数量
          </label>
          <div class="mt-1">
            <input
              id="count"
              v-model.number="form.count"
              type="number"
              min="1"
              max="10000"
              required
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="请输入生成数量"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500">单次最多生成10000个激活码</p>
        </div>

        <!-- 价格 -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">
            单价（元）
          </label>
          <div class="mt-1">
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0.01"
              step="0.01"
              required
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="请输入单价"
            />
          </div>
        </div>

        <!-- 有效期 -->
        <div>
          <label for="expirationDays" class="block text-sm font-medium text-gray-700">
            有效期（天）
          </label>
          <div class="mt-1">
            <input
              id="expirationDays"
              v-model.number="form.expirationDays"
              type="number"
              min="1"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="留空表示永不过期"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500">留空表示永不过期</p>
        </div>

        <!-- 用户ID（可选） -->
        <div>
          <label for="userId" class="block text-sm font-medium text-gray-700">
            用户ID（可选）
          </label>
          <div class="mt-1">
            <input
              id="userId"
              v-model.number="form.userId"
              type="number"
              min="1"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="留空表示不绑定用户"
            />
          </div>
        </div>
      </div>

      <!-- 生成按钮 -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? '生成中...' : '生成激活码' }}
        </button>
      </div>
    </form>

    <!-- 生成结果 -->
    <div v-if="generatedCodes.length > 0" class="mt-8">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              生成成功！
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>成功生成 {{ generatedCodes.length }} 个激活码</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 激活码列表 -->
      <div class="mt-4">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-sm font-medium text-gray-900">生成的激活码</h4>
          <div class="space-x-2">
            <button
              @click="copyAllCodes"
              class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              复制全部
            </button>
            <button
              @click="exportCodes"
              class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              导出CSV
            </button>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="code in generatedCodes"
              :key="code"
              class="bg-white p-2 rounded border text-sm font-mono cursor-pointer hover:bg-gray-100"
              @click="copyCode(code)"
              :title="'点击复制: ' + code"
            >
              {{ code }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GenerateCodeRequest, GenerateCodeResponse } from '~/types/api'

interface FormData {
  count: number
  price: number
  expirationDays: number | null
  userId: number | null
}

const form = reactive<FormData>({
  count: 10,
  price: 1.00,
  expirationDays: null,
  userId: null
})

const loading = ref(false)
const generatedCodes = ref<string[]>([])
const toastStore = useToastStore()

const generateCodes = async () => {
  if (form.count <= 0 || form.count > 10000) {
    toastStore.addToast('error', '生成数量必须在1-10000之间')
    return
  }

  if (form.price <= 0) {
    toastStore.addToast('error', '价格必须大于0')
    return
  }

  loading.value = true
  
  try {
    const token = process.client ? 
      localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') : 
      null

    if (!token) {
      toastStore.addToast('error', '请先登录')
      await navigateTo('/login')
      return
    }

    const requestData: GenerateCodeRequest = {
      count: form.count,
      price: form.price,
      expirationDays: form.expirationDays || undefined,
      userId: form.userId || undefined
    }

    const { data } = await $fetch<{ success: boolean; data: GenerateCodeResponse; message: string }>('/api/admin/generate', {
      method: 'POST',
      body: requestData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (data) {
      generatedCodes.value = data.codes
      toastStore.addToast('success', `成功生成${data.totalCount}个激活码`)
      
      // 重置表单
      form.count = 10
      form.price = 1.00
      form.expirationDays = null
      form.userId = null
    }

  } catch (error: any) {
    console.error('生成激活码失败:', error)
    const message = error.data?.message || '生成激活码失败'
    toastStore.addToast('error', message)
  } finally {
    loading.value = false
  }
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    toastStore.addToast('success', '激活码已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    toastStore.addToast('error', '复制失败')
  }
}

const copyAllCodes = async () => {
  try {
    const text = generatedCodes.value.join('\n')
    await navigator.clipboard.writeText(text)
    toastStore.addToast('success', '所有激活码已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    toastStore.addToast('error', '复制失败')
  }
}

const exportCodes = () => {
  try {
    const csvContent = 'data:text/csv;charset=utf-8,激活码\n' + 
      generatedCodes.value.join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `激活码_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toastStore.addToast('success', 'CSV文件已导出')
  } catch (error) {
    console.error('导出失败:', error)
    toastStore.addToast('error', '导出失败')
  }
}
</script>

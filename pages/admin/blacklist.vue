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
          <h1 class="text-2xl font-bold text-gray-900 mt-3">黑名单管理</h1>
          <p class="mt-1 text-sm text-gray-600">
            管理激活码、设备和IP黑名单
          </p>
        </div>
      </div>

      <!-- 添加黑名单表单 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">添加黑名单</h2>
        
        <form @submit.prevent="addToBlacklist" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">类型</label>
              <select v-model="form.type" class="mt-1 form-select" required>
                <option value="">请选择类型</option>
                <option value="code">激活码</option>
                <option value="device">设备指纹</option>
                <option value="ip">IP地址</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ getValueLabel() }}
              </label>
              <input
                v-model="form.value"
                type="text"
                class="mt-1 form-input"
                :placeholder="getValuePlaceholder()"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">封禁原因</label>
              <input
                v-model="form.reason"
                type="text"
                class="mt-1 form-input"
                placeholder="请输入封禁原因"
                required
              />
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="adding"
              class="btn-primary"
            >
              {{ adding ? '添加中...' : '添加到黑名单' }}
            </button>
          </div>
        </form>
      </div>

      <!-- 黑名单列表 -->
      <div class="bg-white shadow rounded-lg">
        <!-- 筛选器 -->
        <div class="p-6 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">类型</label>
              <select v-model="queryType" @change="fetchBlacklist" class="mt-1 form-select">
                <option value="code">激活码</option>
                <option value="device">设备指纹</option>
                <option value="ip">IP地址</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">搜索值</label>
              <input
                v-model="searchValue"
                type="text"
                class="mt-1 form-input"
                placeholder="输入搜索内容"
              />
            </div>
            
            <div class="flex items-end space-x-2">
              <button
                @click="fetchBlacklist"
                class="btn-primary"
              >
                搜索
              </button>
              <button
                @click="clearSearch"
                class="btn-secondary"
              >
                清除
              </button>
            </div>
          </div>
        </div>

        <!-- 表格 -->
        <div class="overflow-x-auto">
          <table class="table-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ getValueLabel() }}</th>
                <th>封禁原因</th>
                <th>封禁时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="5" class="text-center py-8">
                  <div class="inline-flex items-center">
                    <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    加载中...
                  </div>
                </td>
              </tr>
              
              <tr v-else-if="blacklist.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500">
                  暂无黑名单数据
                </td>
              </tr>
              
              <tr v-else v-for="item in blacklist" :key="item.blacklistId" class="hover:bg-gray-50">
                <td>{{ item.blacklistId }}</td>
                <td>
                  <span class="font-mono text-sm">{{ item.value }}</span>
                </td>
                <td>{{ item.reason }}</td>
                <td>{{ formatDate(item.createdTime) }}</td>
                <td>
                  <button
                    @click="removeFromBlacklist(item)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    移除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="p-6 border-t border-gray-200">
          <div class="pagination">
            <div class="pagination-info">
              显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
            </div>
            
            <div class="pagination-nav">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="pagination-nav-item"
              >
                上一页
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="['pagination-nav-item', { 'current': page === currentPage }]"
              >
                {{ page }}
              </button>
              
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="pagination-nav-item"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { BlacklistAddRequest, BlacklistQueryParams, PaginationResponse } from '~/types/api'

// 页面元信息
definePageMeta({
  middleware: 'auth'
})

const toastStore = useToastStore()

// 表单数据
const form = reactive<BlacklistAddRequest>({
  type: 'code',
  value: '',
  reason: ''
})

const adding = ref(false)

// 查询参数
const queryType = ref('code')
const searchValue = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 黑名单数据
const blacklist = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const getValueLabel = () => {
  switch (form.type || queryType.value) {
    case 'code':
      return '激活码'
    case 'device':
      return '设备指纹'
    case 'ip':
      return 'IP地址'
    default:
      return '值'
  }
}

const getValuePlaceholder = () => {
  switch (form.type) {
    case 'code':
      return '请输入激活码'
    case 'device':
      return '请输入设备指纹'
    case 'ip':
      return '请输入IP地址'
    default:
      return '请输入值'
  }
}

const addToBlacklist = async () => {
  if (!form.type || !form.value.trim() || !form.reason.trim()) {
    toastStore.addToast('error', '请填写完整信息')
    return
  }

  adding.value = true

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
      message: string
    }>('/api/blacklist/add', {
      method: 'POST',
      body: form,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      toastStore.addToast('success', response.message || '添加成功')
      
      // 重置表单
      form.value = ''
      form.reason = ''
      
      // 刷新列表
      await fetchBlacklist()
    } else {
      toastStore.addToast('error', response.message || '添加失败')
    }

  } catch (error: any) {
    console.error('添加黑名单失败:', error)
    toastStore.addToast('error', error.data?.message || '添加失败')
  } finally {
    adding.value = false
  }
}

const fetchBlacklist = async () => {
  loading.value = true

  try {
    const token = process.client ? 
      localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') : 
      null

    if (!token) {
      await navigateTo('/login')
      return
    }

    const params: BlacklistQueryParams = {
      type: queryType.value as any,
      page: currentPage.value,
      pageSize: pageSize.value
    }

    if (searchValue.value.trim()) {
      params.value = searchValue.value.trim()
    }

    const response = await $fetch<{
      success: boolean
      data: PaginationResponse<any>
      message: string
    }>('/api/blacklist/list', {
      method: 'GET',
      query: params,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success && response.data) {
      blacklist.value = response.data.items
      total.value = response.data.total
      currentPage.value = response.data.page
    }

  } catch (error: any) {
    console.error('获取黑名单失败:', error)
    toastStore.addToast('error', error.data?.message || '获取黑名单失败')
  } finally {
    loading.value = false
  }
}

const clearSearch = async () => {
  searchValue.value = ''
  currentPage.value = 1
  await fetchBlacklist()
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await fetchBlacklist()
  }
}

const removeFromBlacklist = async (item: any) => {
  if (!confirm(`确定要从黑名单中移除"${item.value}"吗？`)) {
    return
  }

  try {
    const token = process.client ? 
      localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') : 
      null

    if (!token) {
      await navigateTo('/login')
      return
    }

    // 这里需要实现移除黑名单的API
    // await $fetch('/api/blacklist/remove', { ... })

    toastStore.addToast('success', '移除成功')
    await fetchBlacklist()

  } catch (error: any) {
    console.error('移除黑名单失败:', error)
    toastStore.addToast('error', '移除失败')
  }
}

const formatDate = (date: Date | string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 页面加载时获取数据
onMounted(async () => {
  await fetchBlacklist()
})
</script>

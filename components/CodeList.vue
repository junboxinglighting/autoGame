<template>
  <div class="bg-white shadow rounded-lg">
    <!-- 搜索和筛选 -->
    <div class="p-6 border-b border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">激活码</label>
          <input
            v-model="filters.code"
            type="text"
            class="mt-1 form-input"
            placeholder="输入激活码"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">状态</label>
          <select v-model="filters.status" class="mt-1 form-select">
            <option :value="undefined">全部状态</option>
            <option value="未使用">未使用</option>
            <option value="已激活">已激活</option>
            <option value="已过期">已过期</option>
            <option value="已吊销">已吊销</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">用户ID</label>
          <input
            v-model.number="filters.userId"
            type="number"
            class="mt-1 form-input"
            placeholder="输入用户ID"
          />
        </div>
        
        <div class="flex items-end space-x-2">
          <button
            @click="search"
            class="btn-primary"
          >
            搜索
          </button>
          <button
            @click="clearFilters"
            class="btn-secondary"
          >
            清除
          </button>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">
            已选择 {{ selectedCodes.length }} 项
          </span>
          <button
            v-if="selectedCodes.length > 0"
            @click="showRevokeModal = true"
            class="btn-danger"
          >
            批量吊销
          </button>
        </div>
        
        <div class="flex items-center space-x-2">
          <select v-model="pageSize" @change="changePageSize" class="form-select">
            <option :value="10">每页 10 条</option>
            <option :value="20">每页 20 条</option>
            <option :value="50">每页 50 条</option>
            <option :value="100">每页 100 条</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto">
      <table class="table-auto">
        <thead>
          <tr>
            <th class="w-4">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
                class="rounded border-gray-300"
              />
            </th>
            <th>激活码</th>
            <th>状态</th>
            <th>价格</th>
            <th>用户ID</th>
            <th>设备指纹</th>
            <th>激活时间</th>
            <th>过期时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="10" class="text-center py-8">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </div>
            </td>
          </tr>
          
          <tr v-else-if="codes.length === 0">
            <td colspan="10" class="text-center py-8 text-gray-500">
              暂无数据
            </td>
          </tr>
          
          <tr v-else v-for="code in codes" :key="code.activationCode" class="hover:bg-gray-50">
            <td>
              <input
                type="checkbox"
                :value="code.activationCode"
                v-model="selectedCodes"
                class="rounded border-gray-300"
              />
            </td>
            <td>
              <span class="font-mono text-sm">{{ code.activationCode }}</span>
            </td>
            <td>
              <span :class="getStatusClass(code.status)">
                {{ code.status }}
              </span>
            </td>
            <td>
              <span class="font-medium text-green-600">
                ¥{{ formatPrice(code.price) }}
              </span>
            </td>
            <td>{{ code.userId || '-' }}</td>
            <td>
              <span v-if="code.deviceFingerprint" class="font-mono text-xs truncate max-w-24">
                {{ code.deviceFingerprint }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(code.activationDate) }}</td>
            <td>{{ formatDate(code.expirationDate) }}</td>
            <td>{{ formatDate(code.createdTime) }}</td>
            <td>
              <div class="flex space-x-2">
                <button
                  @click="copyCode(code.activationCode)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                  title="复制激活码"
                >
                  复制
                </button>
                <button
                  v-if="code.status !== '已吊销'"
                  @click="revokeCode(code.activationCode)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  吊销
                </button>
              </div>
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

    <!-- 吊销确认模态框 -->
    <div v-if="showRevokeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">确认吊销</h3>
          <p class="text-sm text-gray-600 mb-4">
            确定要吊销选中的 {{ selectedCodes.length }} 个激活码吗？此操作不可撤销。
          </p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">吊销原因</label>
            <textarea
              v-model="revokeReason"
              class="form-textarea"
              rows="3"
              placeholder="请输入吊销原因"
              required
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showRevokeModal = false"
              class="btn-secondary"
            >
              取消
            </button>
            <button
              @click="confirmRevoke"
              :disabled="!revokeReason.trim() || revoking"
              class="btn-danger"
            >
              {{ revoking ? '吊销中...' : '确认吊销' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeDetailResponse } from '~/types/api'
import { ActivationCodeStatus } from '~/types/database'

const activationCodesStore = useActivationCodesStore()
const toastStore = useToastStore()

// 响应式数据
const codes = computed(() => activationCodesStore.codes)
const loading = computed(() => activationCodesStore.loading)
const total = computed(() => activationCodesStore.total)
const currentPage = computed(() => activationCodesStore.currentPage)
const totalPages = computed(() => activationCodesStore.totalPages)
const pageSize = ref(activationCodesStore.pageSize)

const filters = reactive({
  code: '',
  status: undefined as ActivationCodeStatus | undefined,
  userId: undefined as number | undefined,
  deviceFingerprint: '',
  startDate: '',
  endDate: ''
})

const selectedCodes = ref<string[]>([])
const showRevokeModal = ref(false)
const revokeReason = ref('')
const revoking = ref(false)

// 计算属性
const allSelected = computed(() => {
  return codes.value.length > 0 && selectedCodes.value.length === codes.value.length
})

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
const search = async () => {
  console.log('开始搜索，筛选条件:', filters)
  try {
    activationCodesStore.setFilters(filters)
    await activationCodesStore.fetchCodes()
    console.log('搜索完成，结果数量:', codes.value.length)
  } catch (error) {
    console.error('搜索失败:', error)
    toastStore.addToast('error', '搜索失败: ' + (error as Error).message)
  }
}

const clearFilters = async () => {
  Object.assign(filters, {
    code: '',
    status: undefined,
    userId: undefined,
    deviceFingerprint: '',
    startDate: '',
    endDate: ''
  })
  activationCodesStore.clearFilters()
  await activationCodesStore.fetchCodes()
}

const changePageSize = async () => {
  activationCodesStore.setPageSize(pageSize.value)
  await activationCodesStore.fetchCodes()
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    activationCodesStore.setPage(page)
    await activationCodesStore.fetchCodes()
  }
}

const toggleAll = () => {
  if (allSelected.value) {
    selectedCodes.value = []
  } else {
    selectedCodes.value = codes.value.map(code => code.activationCode)
  }
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    toastStore.addToast('success', '激活码已复制到剪贴板')
  } catch (error) {
    toastStore.addToast('error', '复制失败')
  }
}

const revokeCode = (code: string) => {
  selectedCodes.value = [code]
  showRevokeModal.value = true
}

const confirmRevoke = async () => {
  if (!revokeReason.value.trim()) {
    toastStore.addToast('error', '请输入吊销原因')
    return
  }

  revoking.value = true

  try {
    const response = await activationCodesStore.revokeCodes(selectedCodes.value, revokeReason.value)
    
    if (response.success) {
      toastStore.addToast('success', response.message || '吊销成功')
      selectedCodes.value = []
      showRevokeModal.value = false
      revokeReason.value = ''
    } else {
      toastStore.addToast('error', response.message || '吊销失败')
    }
  } catch (error: any) {
    console.error('吊销失败:', error)
    toastStore.addToast('error', error.data?.message || '吊销失败')
  } finally {
    revoking.value = false
  }
}

const getStatusClass = (status: string) => {
  const baseClass = 'status-badge'
  switch (status) {
    case '未使用':
      return `${baseClass} unused`
    case '已激活':
      return `${baseClass} activated`
    case '已过期':
      return `${baseClass} expired`
    case '已吊销':
      return `${baseClass} revoked`
    default:
      return baseClass
  }
}

const formatDate = (date: Date | string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const formatPrice = (price: any) => {
  if (price === null || price === undefined) return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) return '0.00'
  return numPrice.toFixed(2)
}

// 页面加载时获取数据
onMounted(async () => {
  console.log('CodeList mounted, 开始获取数据')
  
  // 确保在客户端执行
  if (!process.client) {
    console.log('CodeList: 非客户端环境，跳过数据获取')
    return
  }
  
  // 等待一个tick确保DOM完全加载
  await nextTick()
  
  // 额外等待确保localStorage可用
  setTimeout(async () => {
    try {
      await activationCodesStore.fetchCodes()
      console.log('CodeList mounted, 数据获取完成:', {
        loading: loading.value,
        codesLength: codes.value.length,
        total: total.value
      })
    } catch (error) {
      console.error('CodeList mounted, 数据获取失败:', error)
      toastStore.addToast('error', '数据加载失败: ' + (error as Error).message)
    }
  }, 100)
})
</script>

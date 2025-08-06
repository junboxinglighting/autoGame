import { defineStore } from 'pinia'
import type { CodeDetailResponse, CodeQueryParams, PaginationResponse } from '~/types/api'
import { ActivationCodeStatus } from '~/types/database'

export const useActivationCodesStore = defineStore('activationCodes', {
  state: () => ({
    codes: [] as CodeDetailResponse[],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 20,
    filters: {
      code: '',
      status: undefined as ActivationCodeStatus | undefined,
      userId: undefined as number | undefined,
      deviceFingerprint: '',
      startDate: '',
      endDate: ''
    } as Omit<CodeQueryParams, 'page' | 'pageSize'>
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.pageSize),
    hasFilters: (state) => {
      return !!(
        state.filters.code ||
        state.filters.status ||
        state.filters.userId ||
        state.filters.deviceFingerprint ||
        state.filters.startDate ||
        state.filters.endDate
      )
    }
  },

  actions: {
    async fetchCodes() {
      this.loading = true
      console.log('Store: fetchCodes 开始执行, process.client:', process.client)
      
      // 如果不是客户端环境，直接返回
      if (!process.client) {
        console.log('Store: 非客户端环境，跳过执行')
        this.loading = false
        return
      }
      
      try {
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')

        console.log('Store: 获取到的token:', token ? '存在' : '不存在')

        if (!token) {
          console.error('Store: 未找到认证令牌')
          throw new Error('未找到认证令牌')
        }

        const params: CodeQueryParams = {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.filters
        }

        // 移除空值
        Object.keys(params).forEach(key => {
          if (params[key as keyof CodeQueryParams] === '' || params[key as keyof CodeQueryParams] === null) {
            delete params[key as keyof CodeQueryParams]
          }
        })

        const response = await $fetch<{
          success: boolean
          data: PaginationResponse<CodeDetailResponse>
          message: string
        }>('/api/codes/list', {
          method: 'GET',
          query: params,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.success && response.data) {
          console.log('Store: 接收到数据', {
            items: response.data.items?.length || 0,
            total: response.data.total,
            page: response.data.page
          })
          this.codes = response.data.items
          this.total = response.data.total
          this.currentPage = response.data.page
          console.log('Store: 状态更新后', {
            codesLength: this.codes.length,
            total: this.total,
            currentPage: this.currentPage
          })
        } else {
          console.log('Store: 响应数据异常', response)
        }

      } catch (error: any) {
        console.error('获取激活码列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setPage(page: number) {
      this.currentPage = page
    },

    setPageSize(size: number) {
      this.pageSize = size
      this.currentPage = 1 // 重置到第一页
    },

    setFilters(filters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...filters }
      this.currentPage = 1 // 重置到第一页
    },

    clearFilters() {
      this.filters = {
        code: '',
        status: undefined,
        userId: undefined,
        deviceFingerprint: '',
        startDate: '',
        endDate: ''
      }
      this.currentPage = 1
    },

    async revokeCodes(codes: string[], reason: string) {
      try {
        const token = process.client ? 
          localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') : 
          null

        if (!token) {
          throw new Error('未找到认证令牌')
        }

        const response = await $fetch<{
          success: boolean
          data: any
          message: string
        }>('/api/admin/revoke', {
          method: 'POST',
          body: {
            codes,
            reason
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.success) {
          // 刷新列表
          await this.fetchCodes()
        }

        return response

      } catch (error: any) {
        console.error('吊销激活码失败:', error)
        throw error
      }
    }
  }
})

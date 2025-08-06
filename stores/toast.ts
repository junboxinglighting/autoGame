import { defineStore } from 'pinia'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[]
  }),

  actions: {
    addToast(type: Toast['type'], message: string, duration: number = 5000) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      
      const toast: Toast = {
        id,
        type,
        message
      }

      this.toasts.push(toast)

      // 自动移除toast
      setTimeout(() => {
        this.removeToast(id)
      }, duration)

      return id
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clearAllToasts() {
      this.toasts = []
    }
  }
})

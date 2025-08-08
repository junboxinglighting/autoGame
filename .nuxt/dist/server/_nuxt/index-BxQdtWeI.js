import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext, computed } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { d as defineStore, _ as _export_sfc } from "../server.mjs";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/hookable/dist/index.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unctx/dist/index.mjs";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/radix3/dist/index.mjs";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/defu/dist/defu.mjs";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/ufo/dist/index.mjs";
import "C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/klona/dist/index.mjs";
const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: []
  }),
  actions: {
    addToast(type, message, duration = 5e3) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const toast = {
        id,
        type,
        message
      };
      this.toasts.push(toast);
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
      return id;
    },
    removeToast(id) {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },
    clearAllToasts() {
      this.toasts = [];
    }
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "GenerateForm",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      count: 10,
      price: 1,
      expirationDays: null,
      userId: null
    });
    const loading = ref(false);
    const generatedCodes = ref([]);
    useToastStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow rounded-lg p-6" }, _attrs))}><h2 class="text-lg font-medium text-gray-900 mb-6">生成激活码</h2><form class="space-y-6"><div class="grid grid-cols-1 gap-6 sm:grid-cols-2"><div><label for="count" class="block text-sm font-medium text-gray-700"> 生成数量 </label><div class="mt-1"><input id="count"${ssrRenderAttr("value", unref(form).count)} type="number" min="1" max="10000" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="请输入生成数量"></div><p class="mt-2 text-sm text-gray-500">单次最多生成10000个激活码</p></div><div><label for="price" class="block text-sm font-medium text-gray-700"> 单价（元） </label><div class="mt-1"><input id="price"${ssrRenderAttr("value", unref(form).price)} type="number" min="0.01" step="0.01" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="请输入单价"></div></div><div><label for="expirationDays" class="block text-sm font-medium text-gray-700"> 有效期（天） </label><div class="mt-1"><input id="expirationDays"${ssrRenderAttr("value", unref(form).expirationDays)} type="number" min="1" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="留空表示永不过期"></div><p class="mt-2 text-sm text-gray-500">留空表示永不过期</p></div><div><label for="userId" class="block text-sm font-medium text-gray-700"> 用户ID（可选） </label><div class="mt-1"><input id="userId"${ssrRenderAttr("value", unref(form).userId)} type="number" min="1" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="留空表示不绑定用户"></div></div></div><div class="flex justify-end"><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(loading)) {
        _push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(loading) ? "生成中..." : "生成激活码")}</button></div></form>`);
      if (unref(generatedCodes).length > 0) {
        _push(`<div class="mt-8"><div class="bg-green-50 border border-green-200 rounded-md p-4"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div><div class="ml-3"><h3 class="text-sm font-medium text-green-800"> 生成成功！ </h3><div class="mt-2 text-sm text-green-700"><p>成功生成 ${ssrInterpolate(unref(generatedCodes).length)} 个激活码</p></div></div></div></div><div class="mt-4"><div class="flex justify-between items-center mb-3"><h4 class="text-sm font-medium text-gray-900">生成的激活码</h4><div class="space-x-2"><button class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"> 复制全部 </button><button class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"> 导出CSV </button></div></div><div class="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><!--[-->`);
        ssrRenderList(unref(generatedCodes), (code) => {
          _push(`<div class="bg-white p-2 rounded border text-sm font-mono cursor-pointer hover:bg-gray-100"${ssrRenderAttr("title", "点击复制: " + code)}>${ssrInterpolate(code)}</div>`);
        });
        _push(`<!--]--></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GenerateForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const useActivationCodesStore = defineStore("activationCodes", {
  state: () => ({
    codes: [],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 20,
    filters: {
      code: "",
      status: void 0,
      userId: void 0,
      deviceFingerprint: "",
      startDate: "",
      endDate: ""
    }
  }),
  getters: {
    totalPages: (state) => Math.ceil(state.total / state.pageSize),
    hasFilters: (state) => {
      return !!(state.filters.code || state.filters.status || state.filters.userId || state.filters.deviceFingerprint || state.filters.startDate || state.filters.endDate);
    }
  },
  actions: {
    async fetchCodes() {
      this.loading = true;
      console.log("Store: fetchCodes 开始执行, process.client:", false);
      {
        console.log("Store: 非客户端环境，跳过执行");
        this.loading = false;
        return;
      }
    },
    setPage(page) {
      this.currentPage = page;
    },
    setPageSize(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.currentPage = 1;
    },
    clearFilters() {
      this.filters = {
        code: "",
        status: void 0,
        userId: void 0,
        deviceFingerprint: "",
        startDate: "",
        endDate: ""
      };
      this.currentPage = 1;
    },
    async revokeCodes(codes, reason) {
      try {
        console.log("Store: 无认证模式，正在吊销激活码");
        const response = await $fetch("/api/admin/revoke", {
          method: "POST",
          body: {
            codes,
            reason
          }
        });
        if (response.success) {
          await this.fetchCodes();
        }
        return response;
      } catch (error) {
        console.error("吊销激活码失败:", error);
        throw error;
      }
    }
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CodeList",
  __ssrInlineRender: true,
  setup(__props) {
    const activationCodesStore = useActivationCodesStore();
    useToastStore();
    const codes = computed(() => activationCodesStore.codes);
    const loading = computed(() => activationCodesStore.loading);
    const total = computed(() => activationCodesStore.total);
    const currentPage = computed(() => activationCodesStore.currentPage);
    const totalPages = computed(() => activationCodesStore.totalPages);
    const pageSize = ref(activationCodesStore.pageSize);
    const filters = reactive({
      code: "",
      status: void 0,
      userId: void 0,
      deviceFingerprint: "",
      startDate: "",
      endDate: ""
    });
    const selectedCodes = ref([]);
    const showRevokeModal = ref(false);
    const revokeReason = ref("");
    const revoking = ref(false);
    const allSelected = computed(() => {
      return codes.value.length > 0 && selectedCodes.value.length === codes.value.length;
    });
    const visiblePages = computed(() => {
      const pages = [];
      const start = Math.max(1, currentPage.value - 2);
      const end = Math.min(totalPages.value, currentPage.value + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });
    const getStatusClass = (status) => {
      const baseClass = "status-badge";
      switch (status) {
        case "未使用":
          return `${baseClass} unused`;
        case "已激活":
          return `${baseClass} activated`;
        case "已过期":
          return `${baseClass} expired`;
        case "已吊销":
          return `${baseClass} revoked`;
        default:
          return baseClass;
      }
    };
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleString("zh-CN");
    };
    const formatPrice = (price) => {
      if (price === null || price === void 0) return "0.00";
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      if (isNaN(numPrice)) return "0.00";
      return numPrice.toFixed(2);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow rounded-lg" }, _attrs))}><div class="p-6 border-b border-gray-200"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-gray-700">激活码</label><input${ssrRenderAttr("value", unref(filters).code)} type="text" class="mt-1 form-input" placeholder="输入激活码"></div><div><label class="block text-sm font-medium text-gray-700">状态</label><select class="mt-1 form-select"><option${ssrRenderAttr("value", void 0)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, void 0) : ssrLooseEqual(unref(filters).status, void 0)) ? " selected" : ""}>全部状态</option><option value="未使用"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "未使用") : ssrLooseEqual(unref(filters).status, "未使用")) ? " selected" : ""}>未使用</option><option value="已激活"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "已激活") : ssrLooseEqual(unref(filters).status, "已激活")) ? " selected" : ""}>已激活</option><option value="已过期"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "已过期") : ssrLooseEqual(unref(filters).status, "已过期")) ? " selected" : ""}>已过期</option><option value="已吊销"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "已吊销") : ssrLooseEqual(unref(filters).status, "已吊销")) ? " selected" : ""}>已吊销</option></select></div><div><label class="block text-sm font-medium text-gray-700">用户ID</label><input${ssrRenderAttr("value", unref(filters).userId)} type="number" class="mt-1 form-input" placeholder="输入用户ID"></div><div class="flex items-end space-x-2"><button class="btn-primary"> 搜索 </button><button class="btn-secondary"> 清除 </button></div></div></div><div class="p-6 border-b border-gray-200"><div class="flex justify-between items-center"><div class="flex items-center space-x-4"><span class="text-sm text-gray-700"> 已选择 ${ssrInterpolate(unref(selectedCodes).length)} 项 </span>`);
      if (unref(selectedCodes).length > 0) {
        _push(`<button class="btn-danger"> 批量吊销 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2"><select class="form-select"><option${ssrRenderAttr("value", 10)}${ssrIncludeBooleanAttr(Array.isArray(unref(pageSize)) ? ssrLooseContain(unref(pageSize), 10) : ssrLooseEqual(unref(pageSize), 10)) ? " selected" : ""}>每页 10 条</option><option${ssrRenderAttr("value", 20)}${ssrIncludeBooleanAttr(Array.isArray(unref(pageSize)) ? ssrLooseContain(unref(pageSize), 20) : ssrLooseEqual(unref(pageSize), 20)) ? " selected" : ""}>每页 20 条</option><option${ssrRenderAttr("value", 50)}${ssrIncludeBooleanAttr(Array.isArray(unref(pageSize)) ? ssrLooseContain(unref(pageSize), 50) : ssrLooseEqual(unref(pageSize), 50)) ? " selected" : ""}>每页 50 条</option><option${ssrRenderAttr("value", 100)}${ssrIncludeBooleanAttr(Array.isArray(unref(pageSize)) ? ssrLooseContain(unref(pageSize), 100) : ssrLooseEqual(unref(pageSize), 100)) ? " selected" : ""}>每页 100 条</option></select></div></div></div><div class="overflow-x-auto"><table class="table-auto"><thead><tr><th class="w-4"><input type="checkbox"${ssrIncludeBooleanAttr(unref(allSelected)) ? " checked" : ""} class="rounded border-gray-300"></th><th>激活码</th><th>状态</th><th>价格</th><th>用户ID</th><th>设备指纹</th><th>激活时间</th><th>过期时间</th><th>创建时间</th><th>操作</th></tr></thead><tbody class="divide-y divide-gray-200">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="10" class="text-center py-8"><div class="inline-flex items-center"><svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 加载中... </div></td></tr>`);
      } else if (unref(codes).length === 0) {
        _push(`<tr><td colspan="10" class="text-center py-8 text-gray-500"> 暂无数据 </td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(codes), (code) => {
          _push(`<tr class="hover:bg-gray-50"><td><input type="checkbox"${ssrRenderAttr("value", code.activationCode)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCodes)) ? ssrLooseContain(unref(selectedCodes), code.activationCode) : unref(selectedCodes)) ? " checked" : ""} class="rounded border-gray-300"></td><td><span class="font-mono text-sm">${ssrInterpolate(code.activationCode)}</span></td><td><span class="${ssrRenderClass(getStatusClass(code.status))}">${ssrInterpolate(code.status)}</span></td><td><span class="font-medium text-green-600"> ¥${ssrInterpolate(formatPrice(code.price))}</span></td><td>${ssrInterpolate(code.userId || "-")}</td><td>`);
          if (code.deviceFingerprint) {
            _push(`<span class="font-mono text-xs truncate max-w-24">${ssrInterpolate(code.deviceFingerprint)}</span>`);
          } else {
            _push(`<span>-</span>`);
          }
          _push(`</td><td>${ssrInterpolate(formatDate(code.activationDate))}</td><td>${ssrInterpolate(formatDate(code.expirationDate))}</td><td>${ssrInterpolate(formatDate(code.createdTime))}</td><td><div class="flex space-x-2"><button class="text-blue-600 hover:text-blue-800 text-sm" title="复制激活码"> 复制 </button>`);
          if (code.status !== "已吊销") {
            _push(`<button class="text-red-600 hover:text-red-800 text-sm"> 吊销 </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="p-6 border-t border-gray-200"><div class="pagination"><div class="pagination-info"> 显示第 ${ssrInterpolate((unref(currentPage) - 1) * unref(pageSize) + 1)} - ${ssrInterpolate(Math.min(unref(currentPage) * unref(pageSize), unref(total)))} 条，共 ${ssrInterpolate(unref(total))} 条 </div><div class="pagination-nav"><button${ssrIncludeBooleanAttr(unref(currentPage) <= 1) ? " disabled" : ""} class="pagination-nav-item"> 上一页 </button><!--[-->`);
        ssrRenderList(unref(visiblePages), (page) => {
          _push(`<button class="${ssrRenderClass(["pagination-nav-item", { "current": page === unref(currentPage) }])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages)) ? " disabled" : ""} class="pagination-nav-item"> 下一页 </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showRevokeModal)) {
        _push(`<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"><div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"><div class="mt-3"><h3 class="text-lg font-medium text-gray-900 mb-4">确认吊销</h3><p class="text-sm text-gray-600 mb-4"> 确定要吊销选中的 ${ssrInterpolate(unref(selectedCodes).length)} 个激活码吗？此操作不可撤销。 </p><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2">吊销原因</label><textarea class="form-textarea" rows="3" placeholder="请输入吊销原因" required>${ssrInterpolate(unref(revokeReason))}</textarea></div><div class="flex justify-end space-x-3"><button class="btn-secondary"> 取消 </button><button${ssrIncludeBooleanAttr(!unref(revokeReason).trim() || unref(revoking)) ? " disabled" : ""} class="btn-danger">${ssrInterpolate(unref(revoking) ? "吊销中..." : "确认吊销")}</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CodeList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  __ssrInlineRender: true,
  setup(__props) {
    const toastStore = useToastStore();
    const toasts = computed(() => toastStore.toasts);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        name: "toast",
        class: "fixed top-4 right-4 z-50 space-y-2"
      }, _attrs))} data-v-9e01fb2c>`);
      ssrRenderList(unref(toasts), (toast) => {
        _push(`<div class="${ssrRenderClass([
          "px-6 py-4 rounded-lg shadow-lg text-white font-medium max-w-sm",
          {
            "bg-green-500": toast.type === "success",
            "bg-red-500": toast.type === "error",
            "bg-yellow-500": toast.type === "warning",
            "bg-blue-500": toast.type === "info"
          }
        ])}" data-v-9e01fb2c><div class="flex items-center justify-between" data-v-9e01fb2c><div class="flex items-center space-x-2" data-v-9e01fb2c>`);
        if (toast.type === "success") {
          _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-v-9e01fb2c><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-9e01fb2c></path></svg>`);
        } else if (toast.type === "error") {
          _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-v-9e01fb2c><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" data-v-9e01fb2c></path></svg>`);
        } else if (toast.type === "warning") {
          _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-v-9e01fb2c><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-9e01fb2c></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-v-9e01fb2c><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" data-v-9e01fb2c></path></svg>`);
        }
        _push(`<span data-v-9e01fb2c>${ssrInterpolate(toast.message)}</span></div><button class="ml-4 text-white hover:text-gray-200 focus:outline-none" data-v-9e01fb2c><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-v-9e01fb2c><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" data-v-9e01fb2c></path></svg></button></div></div>`);
      });
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Toast.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9e01fb2c"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useActivationCodesStore();
    const stats = ref({
      totalCodes: 0,
      activatedCodes: 0,
      unusedCodes: 0,
      expiredRevokedCodes: 0
    });
    const total = computed(() => stats.value.totalCodes);
    const activatedCount = computed(() => stats.value.activatedCodes);
    const unusedCount = computed(() => stats.value.unusedCodes);
    const expiredRevokedCount = computed(() => stats.value.expiredRevokedCodes);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GenerateForm = _sfc_main$3;
      const _component_CodeList = _sfc_main$2;
      const _component_Toast = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900">激活码管理系统</h1><p class="mt-2 text-sm text-gray-600">游戏脚本激活码管理平台 - 无需登录模式</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-white overflow-hidden shadow rounded-lg"><div class="p-5"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div></div><div class="ml-5 w-0 flex-1"><dl><dt class="text-sm font-medium text-gray-500 truncate">总激活码</dt><dd class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(total) || 0)}</dd></dl></div></div></div></div><div class="bg-white overflow-hidden shadow rounded-lg"><div class="p-5"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div><div class="ml-5 w-0 flex-1"><dl><dt class="text-sm font-medium text-gray-500 truncate">已激活</dt><dd class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(activatedCount) || 0)}</dd></dl></div></div></div></div><div class="bg-white overflow-hidden shadow rounded-lg"><div class="p-5"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div><div class="ml-5 w-0 flex-1"><dl><dt class="text-sm font-medium text-gray-500 truncate">未使用</dt><dd class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(unusedCount) || 0)}</dd></dl></div></div></div></div><div class="bg-white overflow-hidden shadow rounded-lg"><div class="p-5"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg></div></div><div class="ml-5 w-0 flex-1"><dl><dt class="text-sm font-medium text-gray-500 truncate">已过期/吊销</dt><dd class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(expiredRevokedCount) || 0)}</dd></dl></div></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-1">`);
      _push(ssrRenderComponent(_component_GenerateForm, null, null, _parent));
      _push(`</div><div class="lg:col-span-2">`);
      _push(ssrRenderComponent(_component_CodeList, null, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BxQdtWeI.js.map

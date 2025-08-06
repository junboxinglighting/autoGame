import { ActivationCodeStatus, PaymentMethod, ActivationResult } from './database'

// API 响应基础接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 分页参数接口
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应接口
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 生成激活码请求接口
export interface GenerateCodeRequest {
  count: number;
  price: number;
  expirationDays?: number; // 有效期天数，null表示永不过期
  userId?: number;
}

// 生成激活码响应接口
export interface GenerateCodeResponse {
  codes: string[];
  totalCount: number;
}

// 验证激活码请求接口
export interface ValidateCodeRequest {
  code: string;
  userId: number;
  deviceFingerprint: string;
  ip: string;
}

// 验证激活码响应接口
export interface ValidateCodeResponse {
  valid: boolean;
  token?: string;
  expiryTime?: Date;
  message?: string;
  statusCode?: number; // 1=成功, 2=失败, 3=激活码已被其他IP使用
}

// 激活码查询参数接口
export interface CodeQueryParams extends PaginationParams {
  code?: string;
  status?: ActivationCodeStatus;
  userId?: number;
  deviceFingerprint?: string;
  startDate?: string;
  endDate?: string;
}

// 激活码详情响应接口
export interface CodeDetailResponse {
  activationCode: string;
  status: ActivationCodeStatus;
  price: number;
  userId?: number;
  deviceFingerprint?: string;
  ip?: string;
  activationDate?: Date;
  expirationDate?: Date;
  createdTime: Date;
  lastModifiedTime: Date;
}

// 支付请求接口
export interface PaymentRequest {
  userId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  deviceFingerprint: string;
  count: number; // 购买激活码数量
  expirationDays?: number;
}

// 支付响应接口
export interface PaymentResponse {
  paymentId: number;
  payUrl?: string; // 支付链接
  qrCode?: string; // 支付二维码
}

// 支付回调接口
export interface PaymentCallback {
  paymentId: number;
  transactionId: string;
  status: 'success' | 'failed';
  amount: number;
  signature: string;
}

// 统计数据接口
export interface StatsResponse {
  totalCodes: number;
  activatedCodes: number;
  expiredCodes: number;
  revokedCodes: number;
  activationRate: number;
  totalRevenue: number;
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  generated: number;
  activated: number;
  revenue: number;
}

// 黑名单添加请求接口
export interface BlacklistAddRequest {
  type: 'code' | 'device' | 'ip';
  value: string;
  reason: string;
}

// 黑名单查询参数接口
export interface BlacklistQueryParams extends PaginationParams {
  type?: 'code' | 'device' | 'ip';
  value?: string;
  startDate?: string;
  endDate?: string;
}

// 吊销激活码请求接口
export interface RevokeCodeRequest {
  codes: string[];
  reason: string;
}

// 用户登录请求接口
export interface LoginRequest {
  username: string;
  password: string;
}

// 用户登录响应接口
export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    username: string;
    email: string;
  };
}

// JWT Token Payload 接口
export interface JWTPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

// 设备指纹生成参数接口
export interface DeviceFingerprintParams {
  userAgent: string;
  language: string;
  platform: string;
  screen: {
    width: number;
    height: number;
  };
  timezone: string;
}

// 导出请求接口
export interface ExportRequest {
  type: 'codes' | 'payments' | 'activations' | 'logs';
  format: 'csv' | 'excel';
  filters?: any;
  startDate?: string;
  endDate?: string;
}

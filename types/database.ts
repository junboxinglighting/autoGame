// 激活码状态枚举
export enum ActivationCodeStatus {
  UNUSED = '未使用',
  ACTIVATED = '已激活',
  EXPIRED = '已过期',
  REVOKED = '已吊销'
}

// 支付方式枚举
export enum PaymentMethod {
  ALIPAY = '支付宝',
  WECHAT = '微信支付'
}

// 支付状态枚举
export enum PaymentStatus {
  SUCCESS = '成功',
  FAILED = '失败',
  PROCESSING = '处理中'
}

// 激活结果枚举
export enum ActivationResult {
  SUCCESS = '成功',
  FAILED = '失败'
}

// 操作类型枚举
export enum OperationType {
  GENERATE = '生成',
  ACTIVATE = '激活',
  REVOKE = '吊销',
  EXPORT = '导出',
  MODIFY = '修改',
  LOGIN = '登录'
}

// 激活码表接口
export interface ActivationCode {
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

// 支付记录表接口
export interface PaymentRecord {
  paymentId: number;
  userId: number;
  activationCodeId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdTime: Date;
}

// 激活记录表接口
export interface ActivationRecord {
  activationId: number;
  activationCode: string;
  userId: number;
  deviceFingerprint: string;
  ip: string;
  activationTime: Date;
  result: ActivationResult;
  errorMessage?: string;
}

// 授权信息表接口
export interface AuthorizationInfo {
  tokenId: number;
  activationCode: string;
  tokenContent: string;
  effectiveTime: Date;
  expiryTime: Date;
  createdTime: Date;
}

// 操作日志表接口
export interface OperationLog {
  logId: number;
  operatorId: number;
  operationType: OperationType;
  target: string;
  detail?: string;
  ip: string;
  createdTime: Date;
}

// 黑名单表接口
export interface BlacklistCode {
  blacklistId: number;
  activationCode: string;
  reason: string;
  createdTime: Date;
}

export interface BlacklistDevice {
  blacklistId: number;
  deviceFingerprint: string;
  reason: string;
  createdTime: Date;
}

export interface BlacklistIP {
  blacklistId: number;
  ip: string;
  reason: string;
  createdTime: Date;
}

// 用户表接口
export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  createdTime: Date;
}

// 数据库配置接口
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

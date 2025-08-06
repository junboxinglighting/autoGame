import { defineEventHandler, getMethod, getQuery, createError } from 'h3'
import Database from '~/server/utils/database'
import type { ApiResponse } from '~/types/api'
import type { ActivationCodeStatus } from '~/types/database'

interface CodeQueryResponse {
  activationCode: string
  status: ActivationCodeStatus
  isValid: boolean
  remainingDays?: number
  remainingHours?: number
  expirationDate?: Date | null
  activationDate?: Date | null
  message: string
  statusCode: number  // 新增：1=查询成功，2=查询失败
}

export default defineEventHandler(async (event): Promise<ApiResponse<CodeQueryResponse>> => {
  try {
    // 只允许GET请求
    if (getMethod(event) !== 'GET') {
      return {
        success: false,
        data: {
          activationCode: '',
          status: '未知' as ActivationCodeStatus,
          isValid: false,
          message: '方法不允许，仅支持GET请求',
          statusCode: 2
        },
        message: '方法不允许，仅支持GET请求'
      }
    }

    // 获取查询参数
    const query = getQuery(event)
    const { code } = query

    // 验证激活码参数
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return {
        success: false,
        data: {
          activationCode: '',
          status: '未知' as ActivationCodeStatus,
          isValid: false,
          message: '激活码参数不能为空',
          statusCode: 2
        },
        message: '激活码参数不能为空'
      }
    }

    const activationCode = code.trim()
    console.log(`查询激活码: ${activationCode}`)

    const db = Database

    // 查询激活码信息
    const codeInfo = await db.queryOne<{
      activationCode: string
      status: ActivationCodeStatus
      activationDate: Date | null
      expirationDate: Date | null
      createdTime: Date
    }>(
      'SELECT activationCode, status, activationDate, expirationDate, createdTime FROM activation_code WHERE activationCode = ?',
      [activationCode]
    )

    if (!codeInfo) {
      return {
        success: false,
        data: {
          activationCode: activationCode,
          status: '未知' as ActivationCodeStatus,
          isValid: false,
          message: '激活码不存在',
          statusCode: 2
        },
        message: '激活码不存在'
      }
    }

    const now = new Date()
    let isValid = false
    let remainingDays: number | undefined
    let remainingHours: number | undefined
    let message = ''

    // 根据状态判断有效性并计算剩余时间
    switch (codeInfo.status) {
      case '未使用':
        if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) > now) {
          isValid = true
          const timeDiff = new Date(codeInfo.expirationDate).getTime() - now.getTime()
          remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
          remainingHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          message = `激活码有效，剩余${remainingDays}天${remainingHours}小时`
        } else {
          message = '激活码已过期'
        }
        break

      case '已激活':
        if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) > now) {
          isValid = true
          const timeDiff = new Date(codeInfo.expirationDate).getTime() - now.getTime()
          remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
          remainingHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          message = `激活码已激活且有效，剩余${remainingDays}天${remainingHours}小时`
        } else {
          message = '激活码已激活但已过期'
        }
        break

      case '已过期':
        message = '激活码已过期'
        break

      case '已吊销':
        message = '激活码已被吊销'
        break

      default:
        message = '激活码状态未知'
        break
    }

    const responseData: CodeQueryResponse = {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      isValid,
      remainingDays,
      remainingHours,
      expirationDate: codeInfo.expirationDate,
      activationDate: codeInfo.activationDate,
      message,
      statusCode: 1  // 查询成功
    }

    console.log(`激活码查询结果:`, {
      code: activationCode,
      status: codeInfo.status,
      isValid,
      remainingDays,
      message
    })

    return {
      success: true,
      data: responseData,
      message: '查询成功'
    }

  } catch (error: any) {
    console.error('查询激活码失败:', error)
    
    return {
      success: false,
      data: {
        activationCode: '',
        status: '未知' as ActivationCodeStatus,
        isValid: false,
        message: '服务器内部错误',
        statusCode: 2
      },
      message: '服务器内部错误'
    }
  }
})

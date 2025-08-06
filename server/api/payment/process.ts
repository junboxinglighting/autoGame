import Database from '~/server/utils/database'
import { CodeGenerator } from '~/server/utils/codeGenerator'
import type { PaymentRequest, PaymentResponse, PaymentCallback, ApiResponse } from '~/types/api'
import { PaymentStatus, PaymentMethod, ActivationCodeStatus } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<PaymentResponse | any>> => {
  try {
    const method = getMethod(event)
    
    if (method === 'POST') {
      return await handlePaymentRequest(event)
    } else if (method === 'PUT') {
      return await handlePaymentCallback(event)
    } else {
      throw createError({
        statusCode: 405,
        statusMessage: '方法不允许'
      })
    }

  } catch (error: any) {
    console.error('支付处理失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})

// 处理支付请求
async function handlePaymentRequest(event: any): Promise<ApiResponse<PaymentResponse>> {
  const body = await readBody<PaymentRequest>(event)
  
  // 验证输入参数
  if (!body.userId || !body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的支付参数'
    })
  }

  if (!body.paymentMethod || !Object.values(PaymentMethod).includes(body.paymentMethod)) {
    throw createError({
      statusCode: 400,
      statusMessage: '不支持的支付方式'
    })
  }

  if (!body.count || body.count <= 0 || body.count > 10000) {
    throw createError({
      statusCode: 400,
      statusMessage: '激活码数量必须在1-10000之间'
    })
  }

  const db = Database
  
  // 预生成激活码（但不插入激活码表，等支付成功后再插入）
  const codes = CodeGenerator.generateBatch(body.count)
  
  // 计算过期时间
  let expirationDate: Date | null = null
  if (body.expirationDays && body.expirationDays > 0) {
    expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + body.expirationDays)
  }

  // 创建支付记录
  const paymentResult = await db.query(
    `INSERT INTO payment_record 
     (userId, amount, paymentMethod, paymentStatus, createdTime) 
     VALUES (?, ?, ?, ?, NOW())`,
    [
      body.userId,
      body.amount,
      body.paymentMethod,
      PaymentStatus.PROCESSING
    ]
  )

  const paymentId = (paymentResult as any).insertId

  // 创建临时的激活码关联记录（存储在缓存或临时表中）
  // 这里简化处理，实际项目中可能需要使用Redis等缓存
  const tempData = {
    paymentId,
    codes,
    expirationDate,
    userId: body.userId
  }
  
  // 模拟生成支付链接（实际需要调用支付宝/微信支付API）
  const payUrl = generatePaymentUrl(paymentId, body.amount, body.paymentMethod)
  const qrCode = generateQRCode(payUrl)

  return {
    success: true,
    data: {
      paymentId,
      payUrl,
      qrCode
    },
    message: '支付订单创建成功'
  }
}

// 处理支付回调
async function handlePaymentCallback(event: any): Promise<ApiResponse<any>> {
  const body = await readBody<PaymentCallback>(event)
  
  // 验证签名（实际需要根据支付宝/微信的签名规则验证）
  if (!verifyPaymentSignature(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的支付回调签名'
    })
  }

  const db = Database
  
  // 查询支付记录
  const paymentRecord = await db.queryOne<any>(
    'SELECT * FROM payment_record WHERE paymentId = ?',
    [body.paymentId]
  )

  if (!paymentRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: '支付记录不存在'
    })
  }

  if (paymentRecord.paymentStatus !== PaymentStatus.PROCESSING) {
    return {
      success: true,
      message: '支付状态已处理'
    }
  }

  if (body.status === 'success') {
    await db.transaction(async (connection) => {
      // 更新支付记录
      await connection.query(
        `UPDATE payment_record 
         SET paymentStatus = ?, transactionId = ? 
         WHERE paymentId = ?`,
        [PaymentStatus.SUCCESS, body.transactionId, body.paymentId]
      )

      // 这里需要从缓存中获取预生成的激活码
      // 简化处理，重新生成（实际项目中应该从缓存获取）
      const codes = CodeGenerator.generateBatch(10) // 这里应该从缓存获取实际数量
      
      // 批量插入激活码
      const insertPromises = codes.map(code => 
        connection.query(
          `INSERT INTO activation_code 
           (activationCode, status, userId, expirationDate, createdTime, lastModifiedTime) 
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            code,
            ActivationCodeStatus.UNUSED,
            paymentRecord.userId,
            null // 这里应该从缓存获取实际过期时间
          ]
        )
      )

      await Promise.all(insertPromises)

      // 为每个激活码创建支付关联
      const linkPromises = codes.map(code =>
        connection.query(
          'UPDATE payment_record SET activationCodeId = ? WHERE paymentId = ?',
          [code, body.paymentId]
        )
      )

      await Promise.all(linkPromises)
    })

    return {
      success: true,
      message: '支付成功，激活码已生成'
    }
  } else {
    // 支付失败
    await db.query(
      `UPDATE payment_record 
       SET paymentStatus = ? 
       WHERE paymentId = ?`,
      [PaymentStatus.FAILED, body.paymentId]
    )

    return {
      success: false,
      message: '支付失败'
    }
  }
}

// 生成支付链接（模拟）
function generatePaymentUrl(paymentId: number, amount: number, method: PaymentMethod): string {
  const baseUrl = method === PaymentMethod.ALIPAY ? 
    'https://openapi.alipay.com/gateway.do' : 
    'https://api.mch.weixin.qq.com/pay/unifiedorder'
  
  return `${baseUrl}?paymentId=${paymentId}&amount=${amount}&method=${method}`
}

// 生成二维码（模拟）
function generateQRCode(url: string): string {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
}

// 验证支付签名（模拟）
function verifyPaymentSignature(callback: PaymentCallback): boolean {
  // 实际需要根据支付宝/微信的签名规则验证
  return true
}

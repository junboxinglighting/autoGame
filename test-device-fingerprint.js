console.log('🔬 开始测试激活码验证接口（简化版）- 设备指纹验证...')

// 测试数据
const testData = {
  code: 'SAAQISKUCXEXAGVCL66GBMPURPJE385D',
  userId: 2,
  deviceFingerprint: 'device-fingerprint-001',
  ip: '192.168.1.100'
}

async function testValidateAPI() {
  try {
    console.log('📤 发送请求:', JSON.stringify(testData, null, 2))
    
    const response = await fetch('http://localhost:3000/api/codes/validate-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📦 响应状态:', response.status, response.statusText)
    
    const result = await response.json()
    console.log('📄 响应内容:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('✅ 测试成功!')
      console.log('🎯 状态码:', result.data?.statusCode)
      console.log('💬 消息:', result.data?.message)
      
      // 测试相同设备指纹再次验证
      console.log('🔄 测试相同设备指纹再次验证...')
      const sameDeviceResponse = await fetch('http://localhost:3000/api/codes/validate-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const sameDeviceData = await sameDeviceResponse.json()
      console.log('相同设备指纹测试结果:', sameDeviceData.data?.statusCode, sameDeviceData.data?.message)
      
      if (sameDeviceData.data?.statusCode === 1) {
        console.log('✅ 相同设备指纹验证正常工作!')
      } else {
        console.log('❌ 相同设备指纹验证异常!')
      }
      
      // 测试不同设备指纹验证
      console.log('🔄 测试不同设备指纹验证...')
      const differentDeviceData = { ...testData, deviceFingerprint: 'device-fingerprint-different' }
      const differentDeviceResponse = await fetch('http://localhost:3000/api/codes/validate-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(differentDeviceData)
      })
      
      const differentDeviceResult = await differentDeviceResponse.json()
      console.log('不同设备指纹测试结果:', differentDeviceResult.data?.statusCode, differentDeviceResult.data?.message)
      
      if (differentDeviceResult.data?.statusCode === 3) {
        console.log('✅ 设备指纹冲突检测正常工作!')
      } else {
        console.log('❌ 设备指纹冲突检测异常!')
      }
      
    } else {
      console.log('❌ 测试失败!')
      console.log('🚫 错误:', result.message)
      console.log('🎯 状态码:', result.data?.statusCode)
      console.log('💬 详细消息:', result.data?.message)
    }
  } catch (error) {
    console.error('❌ 请求错误:', error.message)
  }
}

testValidateAPI()

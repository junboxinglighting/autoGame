// 测试激活码验证接口
console.log('🔬 开始测试激活码验证接口...')

// 测试数据
const testData = {
  code: 'MUPUME3IXCQHEEUYZJJGMZQ94IKLNAXF',
  userId: 2,
  deviceFingerprint: 'test-device-002',
  ip: '192.168.1.101'
}

async function testValidateAPI() {
  try {
    console.log('📤 发送请求:', JSON.stringify(testData, null, 2))
    
    const response = await fetch('http://localhost:3000/api/codes/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    console.log('📦 响应状态:', response.status, response.statusText)
    
    const data = await response.json()
    console.log('📄 响应内容:', JSON.stringify(data, null, 2))
    
    if (response.ok && data.success) {
      console.log('✅ 测试成功!')
      console.log('🎯 状态码:', data.data?.statusCode)
      console.log('💬 消息:', data.data?.message)
      
      // 测试相同IP再次验证
      console.log('🔄 测试相同IP再次验证...')
      const sameIpResponse = await fetch('http://localhost:3000/api/codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const sameIpData = await sameIpResponse.json()
      console.log('相同IP测试结果:', sameIpData.data?.statusCode, sameIpData.data?.message)
      
      if (sameIpData.data?.statusCode === 1) {
        console.log('✅ 相同IP验证正常工作!')
      } else {
        console.log('❌ 相同IP验证异常!')
      }
      
      // 测试不同IP验证
      console.log('🔄 测试不同IP验证...')
      const differentIpData = { ...testData, ip: '192.168.1.200' }
      const differentIpResponse = await fetch('http://localhost:3000/api/codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(differentIpData)
      })
      
      const differentIpResult = await differentIpResponse.json()
      console.log('不同IP测试结果:', differentIpResult.data?.statusCode, differentIpResult.data?.message)
      
      if (differentIpResult.data?.statusCode === 3) {
        console.log('✅ IP冲突检测正常工作!')
      } else {
        console.log('❌ IP冲突检测异常!')
      }
      
    } else {
      console.log('❌ 测试失败!')
      console.log('🚫 错误:', data.message)
      console.log('🎯 状态码:', data.data?.statusCode)
      console.log('💬 详细消息:', data.data?.message)
    }
  } catch (error) {
    console.error('❌ 请求错误:', error.message)
  }
}

testValidateAPI()

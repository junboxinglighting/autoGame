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
    
    const result = await response.json()
    console.log('📄 响应内容:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('✅ 测试成功!')
      console.log('🎯 状态码:', result.data?.statusCode)
      console.log('💬 消息:', result.data?.message)
      
      if (result.data?.token) {
        console.log('🔑 Token:', result.data.token.substring(0, 50) + '...')
      }
      
      // 测试相同IP再次验证
      console.log('\n🔄 测试相同IP再次验证...')
      await testWithSameIP()
      
      // 测试不同IP验证
      console.log('\n🔄 测试不同IP验证...')
      await testWithDifferentIP()
      
    } else {
      console.log('❌ 测试失败!')
      console.log('🚫 错误:', result.message)
      console.log('🎯 状态码:', result.data?.statusCode)
      console.log('💬 详细消息:', result.data?.message)
    }
    
  } catch (error) {
    console.error('💥 请求失败:', error.message)
  }
}

async function testWithSameIP() {
  try {
    const sameIPData = { ...testData, deviceFingerprint: 'test-device-same' }
    
    const response = await fetch('http://localhost:3000/api/codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sameIPData)
    })
    
    const result = await response.json()
    console.log('相同IP测试结果:', result.data?.statusCode, result.data?.message)
    
    if (result.data?.statusCode === 1) {
      console.log('✅ 相同IP验证正常工作!')
    } else {
      console.log('❌ 相同IP验证异常!')
    }
    
  } catch (error) {
    console.error('相同IP测试失败:', error.message)
  }
}

async function testWithDifferentIP() {
  try {
    const differentIPData = { 
      ...testData, 
      deviceFingerprint: 'test-device-different',
      ip: '192.168.1.200' 
    }
    
    const response = await fetch('http://localhost:3000/api/codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(differentIPData)
    })
    
    const result = await response.json()
    console.log('不同IP测试结果:', result.data?.statusCode, result.data?.message)
    
    if (result.data?.statusCode === 3) {
      console.log('✅ IP冲突检测正常工作!')
    } else {
      console.log('❌ IP冲突检测异常!')
    }
    
  } catch (error) {
    console.error('不同IP测试失败:', error.message)
  }
}

// 运行测试
testValidateAPI()

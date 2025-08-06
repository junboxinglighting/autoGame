// validate-simple 接口完整测试示例
console.log('🔬 validate-simple 接口测试示例')
console.log('=' .repeat(50))

// 测试配置
const API_BASE_URL = 'http://localhost:3000'
const ENDPOINT = '/api/codes/validate-simple'

// 测试用的激活码（需要先生成）
const TEST_CODE = 'ZMJEZPJPWTMF5BMT2YEN3AZHC867D63F'

// 测试场景1: 首次激活
async function testFirstActivation() {
  console.log('\n📋 测试场景1: 首次激活')
  console.log('-'.repeat(30))
  
  const testData = {
    code: TEST_CODE,
    userId: 2,
    deviceFingerprint: 'device-first-001',
    ip: '192.168.1.100'
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📤 请求数据:', JSON.stringify(testData, null, 2))
    console.log('📦 响应状态:', response.status, response.statusText)
    console.log('📄 响应结果:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data.statusCode === 1) {
      console.log('✅ 首次激活成功')
    } else {
      console.log('❌ 首次激活失败')
    }
    
    return result.success
    
  } catch (error) {
    console.error('💥 测试失败:', error.message)
    return false
  }
}

// 测试场景2: 相同IP重复验证
async function testSameIPValidation() {
  console.log('\n📋 测试场景2: 相同IP重复验证')
  console.log('-'.repeat(30))
  
  const testData = {
    code: TEST_CODE,
    userId: 2,
    deviceFingerprint: 'device-same-002',
    ip: '192.168.1.100' // 相同IP
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📤 请求数据:', JSON.stringify(testData, null, 2))
    console.log('📦 响应状态:', response.status, response.statusText)
    console.log('📄 响应结果:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data.statusCode === 1) {
      console.log('✅ 相同IP验证通过')
    } else {
      console.log('❌ 相同IP验证失败')
    }
    
    return result.success
    
  } catch (error) {
    console.error('💥 测试失败:', error.message)
    return false
  }
}

// 测试场景3: 不同IP冲突检测
async function testDifferentIPConflict() {
  console.log('\n📋 测试场景3: 不同IP冲突检测')
  console.log('-'.repeat(30))
  
  const testData = {
    code: TEST_CODE,
    userId: 2,
    deviceFingerprint: 'device-different-003',
    ip: '192.168.1.200' // 不同IP
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📤 请求数据:', JSON.stringify(testData, null, 2))
    console.log('📦 响应状态:', response.status, response.statusText)
    console.log('📄 响应结果:', JSON.stringify(result, null, 2))
    
    if (!result.success && result.data.statusCode === 3) {
      console.log('✅ IP冲突检测正常')
    } else {
      console.log('❌ IP冲突检测异常')
    }
    
    return result.data.statusCode === 3
    
  } catch (error) {
    console.error('💥 测试失败:', error.message)
    return false
  }
}

// 测试场景4: 无效激活码
async function testInvalidCode() {
  console.log('\n📋 测试场景4: 无效激活码测试')
  console.log('-'.repeat(30))
  
  const testData = {
    code: 'INVALID000000000000000000000000000',
    userId: 2,
    deviceFingerprint: 'device-invalid-004',
    ip: '192.168.1.100'
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📤 请求数据:', JSON.stringify(testData, null, 2))
    console.log('📦 响应状态:', response.status, response.statusText)
    console.log('📄 响应结果:', JSON.stringify(result, null, 2))
    
    if (!result.success && result.data.statusCode === 2) {
      console.log('✅ 无效激活码检测正常')
    } else {
      console.log('❌ 无效激活码检测异常')
    }
    
    return result.data.statusCode === 2
    
  } catch (error) {
    console.error('💥 测试失败:', error.message)
    return false
  }
}

// 测试场景5: 参数验证
async function testParameterValidation() {
  console.log('\n📋 测试场景5: 参数验证测试')
  console.log('-'.repeat(30))
  
  const testCases = [
    {
      name: '缺少code参数',
      data: {
        userId: 2,
        deviceFingerprint: 'device-005',
        ip: '192.168.1.100'
      }
    },
    {
      name: '无效激活码格式',
      data: {
        code: 'invalid-format',
        userId: 2,
        deviceFingerprint: 'device-005',
        ip: '192.168.1.100'
      }
    },
    {
      name: '缺少userId',
      data: {
        code: TEST_CODE,
        deviceFingerprint: 'device-005',
        ip: '192.168.1.100'
      }
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n🔍 测试: ${testCase.name}`)
    
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.data)
      })
      
      const result = await response.json()
      
      console.log('📦 响应状态:', response.status)
      console.log('📄 错误信息:', result.statusMessage || result.message)
      
      if (response.status === 400) {
        console.log('✅ 参数验证正常')
      } else {
        console.log('❌ 参数验证异常')
      }
      
    } catch (error) {
      console.error('💥 测试失败:', error.message)
    }
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始运行所有测试...\n')
  
  const results = []
  
  // 运行测试
  results.push(await testFirstActivation())
  results.push(await testSameIPValidation()) 
  results.push(await testDifferentIPConflict())
  results.push(await testInvalidCode())
  await testParameterValidation()
  
  // 测试结果统计
  console.log('\n' + '='.repeat(50))
  console.log('📊 测试结果统计')
  console.log('='.repeat(50))
  
  const passedTests = results.filter(result => result).length
  const totalTests = results.length
  
  console.log(`✅ 通过测试: ${passedTests}/${totalTests}`)
  console.log(`❌ 失败测试: ${totalTests - passedTests}/${totalTests}`)
  
  if (passedTests === totalTests) {
    console.log('🎉 所有核心测试通过！')
  } else {
    console.log('⚠️  部分测试失败，请检查')
  }
  
  console.log('\n💡 测试完成！')
  console.log('📖 详细文档请查看: docs/validate-simple-接口文档.md')
}

// 状态码说明
function printStatusCodes() {
  console.log('\n📋 状态码说明:')
  console.log('  1 - 验证成功 (首次激活成功 或 IP验证通过)')
  console.log('  2 - 验证失败 (激活码不存在、已过期、状态无效)')
  console.log('  3 - IP冲突 (激活码已被其他IP使用)')
}

// 运行测试
if (require.main === module) {
  printStatusCodes()
  runAllTests().catch(console.error)
}

module.exports = {
  testFirstActivation,
  testSameIPValidation,
  testDifferentIPConflict,
  testInvalidCode,
  testParameterValidation,
  runAllTests
}

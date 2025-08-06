// 测试URL形式的激活码验证接口

// 测试参数
const testParams = {
  code: 'FB8GDDR6NEPZJWTVQFFK7D4RWQUIDACC',
  userId: 2,
  deviceFingerprint: 'device-url-test-001',
  ip: '192.168.1.100'
}

// 构建测试URL
const baseURL = 'http://localhost:3000/api/codes/validate-url'
const urlParams = new URLSearchParams({
  code: testParams.code,
  userId: testParams.userId.toString(),
  deviceFingerprint: testParams.deviceFingerprint,
  ip: testParams.ip
})

const testURL = `${baseURL}?${urlParams.toString()}`

console.log('🔗 URL形式的激活码验证接口测试')
console.log('=' .repeat(60))

console.log('\n📋 测试参数:')
console.log('激活码:', testParams.code)
console.log('用户ID:', testParams.userId)
console.log('设备指纹:', testParams.deviceFingerprint)
console.log('IP地址:', testParams.ip)

console.log('\n🔗 完整测试URL:')
console.log(testURL)

console.log('\n📖 URL参数说明:')
console.log('- code: 激活码（32位大写字母数字）')
console.log('- userId: 用户ID（正整数）')
console.log('- deviceFingerprint: 设备指纹（字符串）')
console.log('- ip: IP地址（IPv4或IPv6格式）')

// 执行GET请求测试
async function testGETRequest() {
  try {
    console.log('\n🚀 发送GET请求测试...')
    console.log('请求URL:', testURL)
    
    const response = await fetch(testURL)
    const result = await response.json()
    
    console.log('\n📦 响应状态:', response.status, response.statusText)
    console.log('📄 响应内容:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n✅ GET请求测试成功!')
      console.log('🎯 状态码:', result.data?.statusCode)
      console.log('💬 消息:', result.data?.message)
      
      // 测试相同设备指纹的URL请求
      console.log('\n🔄 测试相同设备指纹的URL请求...')
      const sameDeviceResponse = await fetch(testURL)
      const sameDeviceResult = await sameDeviceResponse.json()
      
      console.log('相同设备指纹URL测试结果:', sameDeviceResult.data?.statusCode, sameDeviceResult.data?.message)
      
      if (sameDeviceResult.data?.statusCode === 1) {
        console.log('✅ 相同设备指纹URL验证正常工作!')
      }
      
      // 测试不同设备指纹的URL请求
      console.log('\n🔄 测试不同设备指纹的URL请求...')
      const differentParams = new URLSearchParams({
        code: testParams.code,
        userId: testParams.userId.toString(),
        deviceFingerprint: 'device-url-different',
        ip: testParams.ip
      })
      const differentURL = `${baseURL}?${differentParams.toString()}`
      
      const differentResponse = await fetch(differentURL)
      const differentResult = await differentResponse.json()
      
      console.log('不同设备指纹URL测试结果:', differentResult.data?.statusCode, differentResult.data?.message)
      
      if (differentResult.data?.statusCode === 3) {
        console.log('✅ 设备指纹冲突检测正常工作!')
      }
      
    } else {
      console.log('\n❌ GET请求测试失败!')
      console.log('🚫 错误:', result.message)
    }
    
  } catch (error) {
    console.error('\n💥 请求失败:', error.message)
  }
}

// 执行POST请求测试（对比）
async function testPOSTRequest() {
  try {
    console.log('\n🔄 对比POST请求测试...')
    
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testParams)
    })
    
    const result = await response.json()
    
    console.log('📦 POST响应状态:', response.status)
    console.log('📄 POST响应内容:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('✅ POST请求也正常工作!')
    }
    
  } catch (error) {
    console.error('💥 POST请求失败:', error.message)
  }
}

console.log('\n💡 使用说明:')
console.log('1. 可以直接在浏览器地址栏输入上述URL进行测试')
console.log('2. 也可以用curl命令: curl "' + testURL + '"')
console.log('3. 接口同时支持GET和POST两种请求方式')

// 运行测试
if (require.main === module) {
  testGETRequest().then(() => {
    return testPOSTRequest()
  }).catch(console.error)
}

module.exports = { testGETRequest, testPOSTRequest, testURL }

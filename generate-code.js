async function generateCode() {
  try {
    const response = await fetch('http://localhost:3000/api/codes/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 2,
        price: 29.99,
        count: 1
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ 激活码生成成功!')
      console.log('激活码:', data.data.code)
      console.log('完整响应:', JSON.stringify(data, null, 2))
    } else {
      console.log('❌ 生成失败:', data.message)
    }
  } catch (error) {
    console.error('❌ 错误:', error.message)
  }
}

generateCode()

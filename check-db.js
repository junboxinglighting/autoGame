// 数据库表结构检查脚本
import mysql from 'mysql2/promise'

async function checkTableStructure() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root123',
      database: 'activation_code_system'
    })

    console.log('🔍 检查activation_record表结构...')
    const [tableStructure] = await connection.execute('DESCRIBE activation_record')
    console.log('表结构:', tableStructure)

    console.log('\n🔍 检查activation_codes表结构...')
    const [codesStructure] = await connection.execute('DESCRIBE activation_codes')
    console.log('表结构:', codesStructure)

    console.log('\n📊 检查activation_record中的数据...')
    const [recordData] = await connection.execute('SELECT * FROM activation_record LIMIT 5')
    console.log('记录数据:', recordData)

    console.log('\n📊 检查activation_codes中的数据...')
    const [codesData] = await connection.execute('SELECT * FROM activation_codes LIMIT 5')
    console.log('激活码数据:', codesData)

    await connection.end()
  } catch (error) {
    console.error('数据库检查失败:', error.message)
  }
}

checkTableStructure()

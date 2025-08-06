import bcrypt from 'bcryptjs'

const password = 'admin123'
const hash = '$2a$10$QxgqTUY9i7.nSZw18XxVHue6SI2fa.3QtwL8sF1btqo.oa2dzzQRG'

const isValid = await bcrypt.compare(password, hash)
console.log('Password validation result:', isValid)
console.log('Testing password:', password)
console.log('Against hash:', hash)

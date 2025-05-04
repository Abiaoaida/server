const express = require('express')
const app = express()
app.use(express.json())
//引入cookie-parser
const cookieParser = require('cookie-parser')
// 使用 cookie-parser 中间件
app.use(cookieParser())

//临时储存一个登陆的用户信息数组
const loginUser = [
  {
    username: 'admin',
    password: '123456'
  }
]
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
  // 允许携带 Cookie
  res.setHeader('Access-Control-Allow-Credentials', true)
  // 允许的请求方法
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  // 允许的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use((request, response, next) => {
  console.log('有人请求服务器1了')
  console.log('请求来自于', request.get('Host'))
  console.log('请求的地址', request.url)
  next()
})

app.post('/chat', (request, response) => {
  const formData = request.body
  console.log('Received form data:', formData)

  setTimeout(() => {
    formData.data.push({
      content: `hello,现在的时间是：${Date.now()}`,
      role: 'doubao'
    })
    const sjs = Math.random() * 100
    if (sjs > 50) {
      return response.json(formData)
    } else {
      return response.sendStatus(502)
    }
  }, 1000)
})

app.post('/ai', (request, response) => {
  const formData = request.body
  console.log('Received form data:', formData)

  setTimeout(() => {
    formData.data.push({
      content: `我是ai,现在的时间是：${Date.now()}`,
      role: 'doubao'
    })
    const sjs = Math.random() * 100
    if (sjs > 50) {
      return response.json(formData)
    } else {
      return response.sendStatus(502)
    }
    // response.sendStatus(502)
    // response.json(formData)
  }, 1000)
})
// 新增登录接口
app.post('/login', (request, response) => {
  const {
    data: { username, password }
  } = request.body
  const user = loginUser.find(u => u.username === username)

  if (!user) {
    return response.json({ code: 404, msg: '不存在该用户' })
  }

  if (user.password !== password) {
    return response.json({ code: 401, msg: '密码错误' })
  }
  // 登录成功，设置 Cookie
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 10)
  response.cookie('user', username, {
    httpOnly: true, // 仅允许通过 HTTP 协议访问，防止 JavaScript 脚本访问
    domain: 'localhost', // 域名设置
    expires: expirationDate
  })
  return response.json({
    code: 200,
    msg: '登录成功',
    user_info: { nickname: 'admin', email: 'abc', phone: '123456789' }
  })
})

app.listen(8080, err => {
  if (!err)
    console.log(
      '服务器1启动成功了,请求学生信息地址为:http://localhost:8080/students'
    )
})

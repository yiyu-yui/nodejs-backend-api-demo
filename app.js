const express = require("express")
const cors = require("cors")
const userRouter = require("./router/user")
const infoRouter = require('./router/userinfo')
const articleRouter = require("./router/article")
const Joi = require("joi")

// 1.创建web实例
const app = express()

// 2.配置cors跨域
app.use(cors())

// 3.配置解析x-www-form-urlencoded格式数据的中间件
app.use(express.urlencoded({ extended: false }))

// 5.优化处理res.send()
app.use((req,res,next) => {
  // status默认值为1，表示失败的情况
  // err可能是错误对象，或者字符串
  res.cc = (err,status=1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 6.在路由之前配置解析token的中间件
const expressJwt = require("express-jwt")
const config = require("./config")
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({path: [/^\/api/]}) )

// 4.导入路由对象
app.use('/api',userRouter)

// 7.导入用户信息模块
app.use('/my',infoRouter)

// 8.导入文章相关模块
app.use('/my/article',articleRouter)

// 6.定义全局错误级别中间件
app.use((err,req,res,next) => {
  if (err instanceof Joi.ValidationError) {
    // 用户名或密码验证失败导致的错误
    return res.cc(err)
  }
  // 身份认证失败错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  res.cc(err)
  next()
})

// 启动服务器
app.listen(3007,() => {
  console.log("Server Running at http://127.0.0.1:3007")
})
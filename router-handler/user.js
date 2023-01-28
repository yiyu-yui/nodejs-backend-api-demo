// 抽离路由处理函数

const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 用户注册
exports.register = (req,res) => {
  const userinfo = req.body
  // 校验表单数据
  if (!userinfo.username || !userinfo.password) {
    // return res.send({status: 1, message: '用户名或密码为空!'})
    return res.cc('用户名或密码为空！')
  }
  
  // 查询数据库，判断用户名是否被占用
  const sql = 'select * from ev_users where username=?'
  db.query(sql,userinfo.username,(err,results) => {
    if (err) { // 执行SQL语句失败
      // return res.send({ status:1, message: err.message })
      return res.cc(err)
    }
    if (results.length !== 0) {
      // return res.send({ status:1, message: '用户名被占用，请更换其他用户名' })
      return res.cc('用户名被占用，请更换其他用户名')
    }

    // 调用bcrypt.hashSync(明文，随机盐)对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 插入新用户
    const insertSQL = 'insert into ev_users set ?'
    db.query(insertSQL,{username: userinfo.username, password: userinfo.password},(err,results) => {
      if (err) {
        // return res.send({ status:1, message: err.message })
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册失败，请稍后重试！'})
        return res.cc('注册失败，请稍后重试！')
      }
      // res.send({status: 0, message: '注册成功'})
      res.cc('注册成功', 0)
    })
  })
}

// 登录
exports.login = (req,res) => {
  // 1.获取用户发送数据
  const userinfo = req.body
  // 2.根据用户名查询用户数据
  const sql = 'select * from ev_users where username=?'
  db.query(sql,userinfo.username,(err,results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('登录失败！')
    }

    // 3.比对数据库中的密码和用户输入密码,bcrypt.compareSync(明文,加密)
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('登录失败')

    // 4.生成token发送给客户端
    // 4.1剔除password等敏感信息
    const user = {...results[0], password: '', user_pic: '' }
    // 4.2生成token字符串：jwt.sign(待加密对象, 密钥, {exprisesIn: 有效期})
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
    res.send({
      status: 0,
      message: '登录成功',
      token: `Bearer ${tokenStr}`
    })
  })
}
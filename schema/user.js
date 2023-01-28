// 定义验证规则
const joi = require("joi")

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required() // 6-12位非空字符串

// 定义验证规则对象
exports.register_schema = {
  // 表示对req.body中的数据进行验证
  body: {
    username,
    password
  }
}

// 更新用户信息时需要验证的信息
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

exports.password_schema = {
  body: {
    oldPwd: password, // 旧密码与password定义的规则一致
    newPwd: joi.not(joi.ref('oldPwd')).concat(password), // 新密码不等于旧密码，且遵循password规则
  }
}

exports.avatar_schema = {
  body: {
    // dataUri-base64格式字符串
    avatar: joi.string().dataUri().required(),
  }
}
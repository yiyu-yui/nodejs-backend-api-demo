const express = require("express")
const userHandler = require("../router-handler/user")
const expressJoi = require('@escook/express-joi')
const { register_schema } = require('../schema/user')

const router = express.Router()

// 注册新用户
router.post('/register',expressJoi(register_schema),userHandler.register)
// 登录
router.post('/login',expressJoi(register_schema),userHandler.login)

module.exports = router
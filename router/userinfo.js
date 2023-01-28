const express = require("express")
const userinfo_handler = require("../router-handler/userinfo")
const expressJoi = require("@escook/express-joi")
const { userinfo_schema, password_schema, avatar_schema } = require("../schema/user")

const router = express.Router()

// 获取用户信息
router.get('/userinfo',expressJoi(userinfo_schema),userinfo_handler.getUserInfo)
// 更新用户信息
router.post('/userinfo',expressJoi(userinfo_schema),userinfo_handler.updateUserInfo)
// 更新密码
router.post('/updatePassword',expressJoi(password_schema),userinfo_handler.updatePassword)
// 更新头像
router.post('/update/avatar',expressJoi(avatar_schema),userinfo_handler.updateAvatar)

module.exports = router
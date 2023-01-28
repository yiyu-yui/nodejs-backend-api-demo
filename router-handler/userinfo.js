const bcrypt = require("bcryptjs")
const db = require("../db/index")

// 获取用户基本信息
exports.getUserInfo = (req,res) => {
  // 查询用户信息
  const sql = 'select id,username,nickname,email from ev_users where id=?'
  // req.user是express-jwt解析token，身份认证成功后所挂载的
  db.query(sql,req.user.id,(err,results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) return res.cc('获取用户信息失败')

    // 获取用户信息成功
    res.send({
      status: 0,
      message: '查询成功',
      data: results[0],
    })
  })
}

// 更新用户信息
exports.updateUserInfo = (req,res) => {
  const body = req.body
  // 更新用户信息
  const sql = 'update ev_users set ? where id=?'
  db.query(sql,[req.body,req.body.id],(err,results) => {
    if(err) return res.cc(err)
    if (results.affectedRows !== 1) {
      return res.cc(err)
    }
    res.cc('更新用户信息成功',0)
  })
}

// 更新密码
exports.updatePassword = (req,res) => {
  // 1.查询旧密码
  const sql = 'select * from ev_users where id=?'
  db.query(sql,req.user.id,(err,results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) {
      return res.cc('操作失败，请重试！')
    }

    // 2.对比输入的旧密码是否与数据库中的密码一致
    const compareRes = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareRes) {
      return res.cc('旧密码输入错误！')
    }

    // 3.对新密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)

    // 4.更新密码
    const updateSql = 'update ev_users set password=? where id=?'
    db.query(updateSql,[newPwd,req.user.id],(err,results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) {
        return res.cc('更新密码失败，请重试！')
      }
      res.cc('更新密码成功！',0)
    })
  })
}

exports.updateAvatar = (req,res) => {
  // 更新头像的语句
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar,req.user.id], (err,results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) {
      return res.cc('更新头像失败')
    }
    res.cc('更新头像成功！',0)
  })
}
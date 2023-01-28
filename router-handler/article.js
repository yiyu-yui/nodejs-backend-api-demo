const db = require("../db/index")
const path = require("path")

// 查询文章分类数据
exports.getCategory = (req,res) => {
  // 查询未被删除的文章，查询结果降序排列
  const sql = 'select * from ev_article_cate where is_delete=0 order by id desc'
  db.query(sql,(err,results) => {
    if(err) return res.cc(err)
    res.send({
      status: 0,
      message: '查询文章分类成功',
      data: results,
    })
  })
}

// 新增文章分类接口
exports.addCategory = (req,res) => {
  const {name, alias} = req.body
  // 判断新增的分类是否已存在
  const sql = 'select * from ev_article_cate where name=? or alias=?'
  db.query(sql,[name,alias],(err,results) => {
    if (err) return res.cc(err)
    console.log(results)
    if (results.length === 2) {
      return res.cc('分类名称和分类别名被占用，请重新输入')
    }
    if (results.length === 1 && name === results[0].name && alias === results[0].alias) {
      return res.cc('分类名称与分类别名被占用，请重新输入')
    }
    if (results.length === 1 && name === results[0].name) {
      return res.cc('分类名称被占用，请重新输入')
    }
    if (results.length === 1 && alias === results[0].alias) {
      return res.cc('分类别名被占用，请重新输入')
    }
    
    // 插入新的分类
    const insertSql = 'insert into ev_article_cate set ?'
    db.query(insertSql,{ name, alias }, (err,results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) {
        return res.cc('新增文章分类失败')
      }
      res.cc('新增成功',0)
    })
  })
}

// 删除文章
exports.deleteCate = (req,res) => {
  // 将is_delete置为1，用标记删除替代真正的删除
  const sql = 'update ev_article_cate set is_delete=1 where id=?'
  db.query(sql,req.params.id,(err,results) => {
    if(err) return res.cc(err)
    console.log(results)
    if(results.affectedRows !== 1) {
      return res.cc('删除文章分类失败，请稍后重试')
    }
    res.cc('删除文章分类成功',0)
  })
}

// 查询特定id的文章分类数据
exports.getCateById = (req,res) => {
  const sql = 'select * from ev_article_cate where id=?'
  db.query(sql,req.params.id,(err,results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) {
      return res.cc('查询失败，请重试')
    }
    res.send({
      status: 0,
      message: '查询成功',
      data: results[0],
    })
  })
}

// 根据id更新文章数据
exports.updateCate = (req,res) => {
  const {id,name,alias} = req.body
  // 1.对提交数据查重：查询用户提交的id之外的数据是否有name、alias重复的
  const sql = 'select * from ev_article_cate where id!=? and (name=? or alias=?)'
  db.query(sql,[id,name,alias],(err,results) => {
    if(err) return res.cc(err)
    console.log('查询results：',results)
    if (results.length === 2) {
      return res.cc('分类名称与别名被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].name === name && results[0].alias === alias) {
      return res.cc('分类名称和别名被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].name === name) {
      return res.cc('分类名称被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].alias === alias) {
      return res.cc('分类别用被占用，请更换后重试！')
    }
    // 2.更新数据
    const updateSql = 'update ev_article_cate set ? where id=?'
    db.query(updateSql,[req.body,id],(err,results) => {
      console.log('更新results=',results)
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) {
        return res.cc('更新数据失败，请稍后重试！')
      }
      res.cc('更新数据成功',0)
    })
  })
}

// 发布文章内容接口
exports.addArticle = (req,res) => {
  // 1.判断是否上传封面
  if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('请上传封面图！')
  // 2.整理文章信息
  const articleInfo = {
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/upload',req.file.fieldname),
    pub_date: new Date(),
    author_id: req.user.id,
  }
  // 3.添加文章
  const sql = 'insert into ev_articles set ?'
  db.query(sql,articleInfo,(err,results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('添加文章失败，请稍后重试！')
    res.cc('添加成功',0)
  })
}

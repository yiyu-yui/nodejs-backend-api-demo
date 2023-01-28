const express =require("express")
const path = require("path")
const article_handler = require("../router-handler/article")
const expressJoi = require("@escook/express-joi")
const multer = require("multer") // 解析formdata格式的包
const { article_schema, deleteCate_schema, getCateById_schema, updateCate_schema, addArticle_schema } = require("../schema/article")
const { required } = require("joi")

const router = express.Router()

// 创建multer实例，dest指定文件的存放路径
const upload = multer({ dest: path.join(__dirname,'../upload')})

// 查询文章分类
router.get('/category',article_handler.getCategory)
// 新增文章分类
router.post('/addCate', expressJoi(article_schema), article_handler.addCategory)
// 删除文章
router.get('/deleteCate/:id',expressJoi(deleteCate_schema),article_handler.deleteCate)
// 获取特定id的数据
router.get('/cate/:id',expressJoi(getCateById_schema),article_handler.getCateById)
// 更新文章分类
router.post('/updateCate',expressJoi(updateCate_schema),article_handler.updateCate)

// 发布文章内容接口
// multer({dest: 下载路径}).single()用来解析formdata格式的表单数据
// 解析挂载：文件类型数据-req.file，文本类型数据-req.body
router.post('/addArticle',upload.single('cover_img'),expressJoi(addArticle_schema),article_handler.addArticle)

module.exports = router
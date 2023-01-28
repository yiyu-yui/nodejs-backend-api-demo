const joi = require("joi")

const name = joi.string().required()
const alias = joi.string().alphanum().required()
exports.article_schema = {
  body: {
    name,
    alias,
  }
}

const id = joi.number().integer().min(1).required()
exports.deleteCate_schema = {
  params: {
    id,
  }
}

exports.getCateById_schema = {
  params: {
    id,
  }
}

exports.updateCate_schema = {
  body: {
    id,
    name,
    alias,
  }
}


exports.addArticle_schema = {
  body: {
    title: joi.string().required(),
    cate_id: joi.number().integer().min(1).required(),
    content: joi.string().allow('').required(),
    state: joi.string().valid('已发布','草稿').required(),
  }
}
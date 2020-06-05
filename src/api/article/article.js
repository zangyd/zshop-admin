import request from '@/plugin/axios/request'

const url = '/v1/article'

/**
 * 添加一篇文章
 * @param {Object} data
 * @returns
 */
export function addArticleItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.article.item',
      ...data
    }
  })
}

/**
 * 编辑一篇文章
 * @param {Object} data
 * @returns
 */
export function setArticleItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.article.item',
      ...data
    }
  })
}

/**
 * 批量删除文章
 * @param {Array} article_id
 * @returns
 */
export function delArticleList(article_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.article.list',
      article_id
    }
  })
}

/**
 * 获取一篇文章
 * @param {Number} article_id
 * @returns
 */
export function getArticleItem(article_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.article.item',
      article_id
    }
  })
}

/**
 * 获取文章列表
 * @param {Object} data
 * @returns
 */
export function getArticleList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.article.list',
      ...data
    }
  })
}

/**
 * 批量设置文章置顶
 * @param {Array} article_id
 * @param {Number} is_top
 * @returns
 */
export function setArticleTop(article_id, is_top) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.article.top',
      article_id,
      is_top
    }
  })
}

/**
 * 批量设置文章是否显示
 * @param {Array} article_id
 * @param {Number} status
 * @returns
 */
export function setArticleStatus(article_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.article.status',
      article_id,
      status
    }
  })
}

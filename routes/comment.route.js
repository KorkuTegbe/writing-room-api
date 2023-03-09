const router = require('express').Router()
const commentController = require('../controllers/comment.controller')
const { authorize } = require('../middleware/authorize')

router.post('/:articleId', authorize, commentController.makeComment)
router.delete('/:commentId', authorize, commentController.deleteComment)
router.get('/:articleId', commentController.getCommentsOfAnArticle)


module.exports = router;
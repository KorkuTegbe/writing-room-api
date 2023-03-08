const router = require('express').Router();
const { authorize } = require('../middleware/authorize');
const uploader = require('../utils/upload')
const articleController = require('../controllers/article.controller')


router.post('/', authorize, uploader.array('media_urls', 4), articleController.draftArticle);
router.patch('/publish/:id', authorize, articleController.publishArticle)
router.patch('/:id', authorize, uploader.array('media_urls', 4), articleController.editArticle);
router.delete('/:id', authorize, articleController.deleteArticle);
router.get('/', authorize, articleController.getOwnerArticles)
router.get('/all', articleController.getAllArticles)
router.get('/:id', articleController.getAnArticle)


module.exports = router
require('express-async-errors');
const AppError = require('../utils/appError')
const db = require('../models');
const Article = db.articles;
const User = db.users;
const Comment = db.comments;


exports.makeComment = async (req, res) => {
    // get from req object
    const { articleId } = req.params
    const user = req.user
    
    // get article
    const article = await Article.findOne({
        where: { id: articleId, status: 'Published' }
    })

    if(!article){ 
        return res.status(404).json({
            status: 'fail',
            message: 'Article not found'
        })
    }

    const comment = await Comment.create({
        comment: req.body.comment,
        userId: user.id,
        articleId: article.id
    });
    res.status(200).json({ 
        status: 'success', 
        data: {
            comment
        } 
    });
};

exports.deleteComment = async (req, res) => {
    const comment = await Comment.destroy({
      where: {
        id: req.params.commentId,
        userId: req.user.id,
      },
    });
  
    // comment NOT FOUND
    if (!comment) {
        return res.status(404).json({
            status: 'fail',
            message: 'Comment not found'
        });
    }
  
    return res.status(200).json({ 
        message: "Comment deleted successfully" 
    });
};


exports.getCommentsOfAnArticle = async (req, res) => {
    // DESTRUCTURE  REQUEST PARAMS AND QUERY
    const { params:{ articleId },query:{orderBy} } = req; 
  
    const order = orderBy ? orderBy : "createdAt";
  
    const comments = await Comment.findAll({
      where: { articleId: articleId },
      order: [[order, "DESC"]],
    });
  
    const allComments = comments.map((comment) => {
        return comment;
    });
  
    res.status(200).json({ 
        status: 'success', 
        results: allComments.length,
        data: allComments, 
    });
};
    
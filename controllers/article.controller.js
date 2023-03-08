require('express-async-errors');
const AppError = require('../utils/appError')
const uploadToCloudinary = require('../utils/cloudinary');
const db = require('../models');
const Article = db.articles;
const User = db.users;
const Comment = db.comments;


// function to calculate reading time
const readingTime = (content) => {
    const wordCount = content.split(' ').length
    // assuming the average person reads 200 words a minute
    const wordsPerMin = wordCount / 200
    return Math.round(wordsPerMin) === 0 ? 1 : Math.round(wordsPerMin)
}

// draft article
exports.draftArticle = async (req,res) => {
    // destructure req
    const { title, content } = req.body;
    const user = req.user;
    const files = req.files
    const mediaURLs = [];
    // if media files
    if (files){
        for (let file of files) {
            const { path } = file;
            const url = await uploadToCloudinary(path);
            mediaURLs.push(url);
        }
    }

    const userId = user.id;
    const media_urls = mediaURLs ?? ''
    const reading_time = readingTime(content);

    const article = await Article.create({
        title, content,
        userId, reading_time, media_urls
    });

    res.status(201).json({
        status: 'success',
        message: 'Draft saved',
        data: { article }
    });
};

exports.publishArticle = async (req, res) => {
    const { id } = req.params

    // find article 
    const article = await Article.findOne({
        where: {
            id: id,
            userId: req.user.id,
        },
    })

    const status = article.status = 'Published'

    // const update = await Article.update({
    //     where: { status: 'Draft'},
    //     status
    // });

    const update = await Article.update(
        { status },
        {
          where: {
            id: article.id,
            status: 'Draft',
            userId: req.user.id,
          },
        }
    );
      

    res.status(201).json({
        status: 'success',
        message: 'Status updated',
        data: { article }
    });
}


// edit article
exports.editArticle = async (req, res) => {
    // destructure req
    const { title, content, status } = req.body;
    const user = req.user;
    const files = req.files
    const mediaURLs = [];

    // find article to be edited
    const article = await Article.findOne({
        where: {
            id: req.params.id,
            userId: user.id,
        },
    })

    // article not found
    if(!article) throw new AppError('Article not found', 404)

    // if media files
    if (files){
        for (let file of files) {
            const { path } = file;
            const url = await uploadToCloudinary(path);
            mediaURLs.push(url);
        }
    }

    // find new reading time
    const reading_time = readingTime(content);

    const updatedArticle = await article.update({
        media_url: mediaURLs,
        title, content, status, reading_time
    })

    res.status(200).json({
        status: 'success',
        message: 'Article updated successfully',
        data: { updatedArticle }
    })
}


// delete article
exports.deleteArticle = async (req, res) => {
    const article = await Article.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
      });
    
      // ARTICLE NOT FOUND
      if (!article) {
        throw new AppError("article not found", 404);
      }
    
      return res.status(200).json({ 
        status: 'success',
        message: "Article deleted successful" 
    });
}

//get owner draft articles
exports.getOwnerArticles = async (req, res) => {

    const articles = await Article.findAll({
      where: { 
        userId: req.user.id,
        // status:"Draft"
       },
    });
  
    res.status(200).json({ 
        status: 'success', 
        results: articles.length,
        data: { articles }, 
    });
};

exports.getAnArticle = async (req, res) => {
    const { id } = req.params;

    const article = await Article.findOne({
        where: { id, status: 'Published' },
        include: [
        {
            model: User,
            required: true,
            attributes: { exclude: ["password"] },
        },
        {
            model: Comment,
        },
        ],
    });

    if (!article) throw new AppError("article not found", 404);

    article.views += 1;
    await article.save();

    res.status(200).json({
        status: 'success',
        data: { article },
    });
}

// get all articles
exports.getAllArticles = async (req, res) => {
    const { limit, userId, status, orderBy } = req.query

    const queryObject = {};
    const findObject = {};

    queryObject.limit = limit ? Number(limit) : 10;

    findObject.status = status ? status : 'Published';

    if (userId) { findObject.userId = userId }

    const order = orderBy ? orderBy : 'updatedAt';

    const articles = await Article.findAll({
        where: { ...findObject }, 
        ...queryObject,
        order: [[order, 'DESC']],
        include: [
            {
                model: User,
                required: true,
                attributes: { exclude: ['password']},
            },
            {
                model: Comment,
            }
        ],
    });

    const allArticles = articles.map((article) => {
        const { comments } = article;

        article.commentsNo = comments.length

        return {
            article,
        };
    });

    res.status(200).json({
        status: 'success',
        results: allArticles.length,
        data: { allArticles }
    });
    
}
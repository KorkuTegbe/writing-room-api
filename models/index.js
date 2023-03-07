const logger = require("./../utils/logger");
  
const {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
  } = require("../config/db.config");
  const { Sequelize } = require("sequelize");
  
  // import the models here
  const userModel = require('./user.model');
  const articleModel = require('./article.model');
  const commentModel = require('./comment.model')
  // connect to Database

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
  });
  
  // add the models to db Object so it can be called when you import db
  const db = {};
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  db.users = userModel(sequelize, Sequelize.DataTypes);
  db.articles = articleModel(sequelize, Sequelize.DataTypes);
  db.comments = commentModel(sequelize, Sequelize.DataTypes);

  // create associations among tables
  (function createAssociations() {
    let User = db.users
    let Article = db.articles
    let Comment = db.comments

    // create userId column in article table
    User.hasMany(Article);
    Article.belongsTo(User) //links article to user

    // create userid column in comments table
    User.hasMany(Comment)
    Comment.belongsTo(User)

    // create articleid in comments table
    Article.hasMany(Comment)
    Comment.belongsTo(Article)

  })();
  
  // checking  if the connection is successfull
  sequelize
    .authenticate()
    .then(() => logger.info("database connected successfuly"))
    .catch((err) => logger.error("unable to connect", err));
  
  // sync the table
  db.sequelize
    .sync({ force: false })
    .then(() => logger.info("table sync successful"))
    .catch((err) => logger.error(err));
  
  module.exports = db;
  
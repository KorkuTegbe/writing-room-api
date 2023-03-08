module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define(
      "article",
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        media_urls: {
          type: DataTypes.JSON,
        },
        reading_time: {
          type: DataTypes.INTEGER,
        },
        likesNo: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        status:{
          type:DataTypes.ENUM,
          values:["Draft", "Published"],
          defaultValue: "Draft"
        },
        views: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        userId: {
          type: DataTypes.INTEGER
        },
      },
      {
        tableName: "articles",
      }
    );
    return Article;
  };
  
  
  
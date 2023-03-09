module.exports= (sequelize, DataTypes)=>{
    const Comment = sequelize.define('comment',{
        comment:{
            type: DataTypes.STRING,
            allowNull:false
        },
        userId: {
            type: DataTypes.INTEGER
        },
        articleId: {
            type: DataTypes.INTEGER
        },
    },
        {
            tableName: 'comments' 
        }
    )

    return Comment
}
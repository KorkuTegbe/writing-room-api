module.exports= (sequelize, DataTypes)=>{
    const Comment = sequelize.define('comment',{
        comment:{
            type: DataTypes.STRING,
            allowNull:false
        },
        
    },
        {
            tableName: 'comments' 
        }
    )

    return Comment
}
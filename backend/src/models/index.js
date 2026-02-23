import User from './User.js';
import Category from './Category.js';
import Article from './Article.js';
import Comment from './Comment.js';

// User - Article association (One-to-Many)
User.hasMany(Article, { as: 'articles', foreignKey: 'authorId' });
Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

// Category - Article association (One-to-Many)
Category.hasMany(Article, { as: 'articles', foreignKey: 'categoryId' });
Article.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

// Article - Comment association (One-to-Many)
Article.hasMany(Comment, { as: 'comments', foreignKey: 'articleId', onDelete: 'CASCADE' });
Comment.belongsTo(Article, { as: 'article', foreignKey: 'articleId' });

// User - Comment association (One-to-Many)
User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

export { User, Category, Article, Comment };

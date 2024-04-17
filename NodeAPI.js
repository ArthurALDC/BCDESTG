const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const { User, Post } = require('../models');

// Instancia Sequelize com a conexão separada
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Definição dos modelos User e Post
class User extends Model {
  static associate(models) {
    User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User',
});

class Post extends Model {
  static associate(models) {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

Post.init({
  title: DataTypes.STRING,
  content: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Post',
});

// Configuração das rotas
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ include: Post });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/posts', async (req, res) => {
  try { 
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = await Post.create({ title, content, userId });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para obter um post por ID
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para atualizar um post por ID
router.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, userId } = req.body;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    post.title = title;
    post.content = content;
    post.userId = userId;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para excluir um post por ID
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    await post.destroy();
    res.json({ message: 'Post excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;

const express = require('express');
const PostsController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const fileExtractor = require('../middleware/file');
const routes = express.Router();

routes.post('', checkAuth, fileExtractor, PostsController.createPost);

routes.put('/:id', checkAuth, fileExtractor, PostsController.updatePost);

routes.get('', PostsController.fetchPosts);

routes.get('/:id', PostsController.fetchPost);

routes.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = routes;

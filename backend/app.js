const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose
	.connect('mongodb+srv://shreyas:tgzRZRrPBlIk1sKD@cluster0-d5whv.mongodb.net/mean-stack?retryWrites=true', {
		useNewUrlParser: true
	})
	.then(() => {
		console.log('Connected to database');
	})
	.catch(() => {
		console.log('Failed to connect to database');
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	next();
});

app.use('/api/posts', router);
app.use('/api/user', userRoutes);

module.exports = app;

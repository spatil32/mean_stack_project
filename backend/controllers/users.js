const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
		const user = new User({
			email: req.body.email,
			password: hashedPassword
		});
		user
			.save()
			.then((result) => {
				res.status(201).json({
					message: 'User created!',
					result: result
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: 'Invalid authentication credentials!'
				});
			});
	});
};

exports.loginUser = (req, res, next) => {
	let userData;
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'Auth failed!'
				});
			}
			userData = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then((result) => {
			if (!result) {
				return res.status(401).json({
					message: 'Auth failed!'
				});
			}
			const token = jwt.sign({ email: userData.email, userId: userData._id }, 'mean_stack_secret', {
				expiresIn: '1h'
			});
			res.status(200).json({
				token: token,
				expiresIn: 3600,
				userId: userData._id
			});
		})
		.catch((err) => {
			return res.status(401).json({
				message: 'Auth failed!'
			});
		});
};

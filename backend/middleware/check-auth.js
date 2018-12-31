const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		console.log(token);
		const decodedToken = jwt.verify(token, 'mean_stack_secret');
		req.userData = { email: decodedToken.email, userId: decodedToken.userId };
		next();
	} catch (err) {
		res.status(401).json({
			message: 'Auth failed!!'
		});
	}
};

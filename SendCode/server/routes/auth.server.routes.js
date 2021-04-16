'use strict';

var express = require('express');
var router = express.Router();

var users = require('../controllers/users/users.authentication.server.controller'),
	auth = require('../controllers/users/users.authorization.server.controller'),
	password = require('../controllers/users/users.password.server.controller')

router.route('/signup')
	.post(users.signup);

router.route("/signin")
	.post(users.signin);


	


router.route('/change-password')
.patch(auth.hasAuthentcation(), users.changePassword);

router.route('/signout')
.delete(auth.hasAuthentcation(), users.signOut)


router.route('/forgot-password')
	.post(password.forgot);

router.route('/verifytoken')
	.post(password.validateResetToken);

router.route('/reset')
	.post(password.reset);

 
module.exports = router;

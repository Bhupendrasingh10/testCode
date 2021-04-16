'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	models = require('../../models'),
	async = require('async'),
	crypto = require('crypto'),
	nodemailer = require('nodemailer'),
	config = require('../../config.server'),
	jwt = require('jsonwebtoken');


const createToken = (userInfo) => {
	var token = jwt.sign({
		data: userInfo._id
	}, config.secret, {
		expiresIn: config.sessionExpire // in seconds
	});
	return token;
}

exports.forgot = function (req, res, next) {
	async.waterfall([
		// Generate random token
		function (done) {
			crypto.randomBytes(3, function (err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},

		function (token, done) {
			if (req.body.email) {
				models.users.findOne({
					email: req.body.email
				}, '-salt -password', function (err, user) {
					if (!user) {
						return res.status(200).send({
							success: false,
							message: 'No account with this email has been found.',
						});
					}
					else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
						user.save(function (err) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(200).send({
					success: false,
					message: 'Email field must not be blank'
				});
			}
		},
		function (token, user, done) {
			// console.log(`http://${req.headers.host}/auth/reset/${token}`);

			let emailHTML = `Hello ${user.firstName},<br>
			You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>
          Please paste this into testproject app to complete the process:\n\n
		  <b>${token}</b> <br>
		  Note: This code will expire in 1 hour \n\n
          'If you did not request this, please ignore this email and your password will remain unchanged.\n`
			done(null, emailHTML, user);
		},
		// If valid email, send reset email using service

		function (emailHTML, user, done) {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: '',
					pass: ''
				}
			});

			var mailOptions = {
				from: '',
				to: user.email,
				subject: 'Living Beauty Password Reset',
				html: emailHTML
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					res.status(200).send({
						success: true,
						message: 'An email has been sent to ' + user.email + ' with further instructions.',
					});
				}
				done(error);
			});
		}
	], function (err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {

	let resetToken = req.body.resetToken;
	if (!resetToken) {
		res.status(200).send({
			success: false,
			message: "Code is required."
		})
	}
	else {
		models.users.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpires: {
				$gt: Date.now()
			}
		}, function (err, user) {
			if (!user) {
				return res.status(200).send({
					success: false,
					message: "Invalid Code"
				})
			}
			else {
				return res.status(200).send({
					success: true,
					message: "Successfully Verified"
				})
			}

		});
	}
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	async.waterfall([
		function (done) {
			models.users.findOne({
				resetPasswordToken: req.body.resetToken,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function (err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
						user.password = req.body.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							if (err) {
								return res.status(200).send({
									success: false,
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								// var token = createToken(user)

								res.status(200).send({
									success: true,
									message: "Password Reset Successfully"
								});
							}
						});
					} else {
						return res.status(200).send({
							success: false,
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(200).send({
						success: false,
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},

		// If valid email, send reset email using service
		function (emailHTML, user, done) {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: '',
					pass: ''
				}
			});
			var mailOptions = {
				from: '',
				to: user.email,
				subject: 'Living Beauty Password Changed',
				html: emailHTML
			};
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					res.status(200).send({
						success: true,
						message: 'Password Reset Successful'
					});
				}
			});

		}
	], function (err) {
		if (err) return next(err);
	});
};


// exports.success = function (req, res) {
// 	// Init Variables
// 	res.render('password-changed')
// };


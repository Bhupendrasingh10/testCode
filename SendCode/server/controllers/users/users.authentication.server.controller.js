// 'use strict';

const bodyParser = require('body-parser');

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	models = require('../../models'),
	jwt = require('jsonwebtoken'),
	config = require('../../config.server')

const createToken = (userInfo) => {
	var token = jwt.sign({
		data: userInfo._id
	}, config.secret, {
		expiresIn: config.sessionExpire // in seconds
	});
	return token;
}

exports.signup = async function (req, response) {
	try {
		let body = req.body;
		if (!body.firstName || !body.lastName || !body.email || !body.password || !body.deviceType || !body.deviceToken)
		{
			return response.status(200).send({
				success: false,
				message: "Missing Fields",
			})
		}
		else{
		
			let emailExists = await models.users.findOne({ email: body.email });
		
			if (emailExists) {
			return response.status(200).send({
				success: false,
				message: "Email already exists",
			})
		}

		let userToCreate = {
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			password: body.password,
			roles: [2],
			deviceDetails:{
				deviceType:body.deviceType,
				deviceToken:body.deviceToken
			}
		}
		if (body.istestproject) {
			userToCreate.istestproject = body.istestproject
		}


		let user = await models.users.create(userToCreate);

		let token = createToken(user);

		response.status(200).send({
			success: true,
			message: "User added successfully.",
			data: {
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email,
				roles: user.roles,
				token: token,
				userId: user._id,
				istestproject: user.istestproject
			}
		})
	}
}
	catch (error) {
		response.status(200).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.signin = async function (req, response) {
	try {
		let { email, password, deviceType, deviceToken } = req.body;
		let body = req.body;
		let userInfo = null

		if (!email || !password || !deviceType || !deviceToken) {
			return response.status(200).send({
				success: false,
				message: "Authentication failed. Missing Parameters.",
			})
		}
		userInfo = await models.users.findOne({ email: email })

		if (!userInfo) {
			return response.status(200).send({
				success: false,
				message: "Authentication failed. User not found.",
			})
		}
		if(userInfo.isDeleted)
		{
			return response.status(200).send({
				success: false,
				message: "Your account has been deleted.",
			})
		}
		if (password && !userInfo.authenticate(password)) {
			return response.status(200).send({
				success: false,
				message: 'Authentication failed. Passwords did not match.'
			});
		}

		let updateToken =  {
			deviceDetails:{
				deviceType:body.deviceType,
				deviceToken:body.deviceToken
			}
		}
		
		

		let token = createToken(userInfo);

		response.status(200).send({
			success: true,
			message: "Signed In Successfully.",
			data: {
				firstName: userInfo.firstName || "",
				lastName: userInfo.lastName || "",
				roles: userInfo.roles,
				email: userInfo.email || "",
				token: token,
				userId: userInfo._id,
				istestproject: userInfo.istestproject
			}
		})
	} catch (error) {
		response.status(200).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.signOut = async (req, response) => {

	let removeToken = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { deviceDetails: [] } }, { new: true })

	response.status(200).send({
		success: true,
		message: "Signed Out Successfully"
	})

}



exports.changePassword = function (req, res) {
	// Init Variables

	var passwordDetails = req.body;
	if (req.userInfo) {
		// console.log(req.userInfo)
		if (passwordDetails.newPassword) {
			models.users.findById(req.userInfo._id, function (err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
							user.password = passwordDetails.newPassword;

							user.save(function (err) {
								if (err) {
									return res.status(200).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									var token = jwt.sign({
										data: user
									}, config.secret, {
										expiresIn: config.sessionExpire // in seconds
									});

									res.status(200).send({
										success: true,
										message: 'Password Changed Successfully!!',
										token: token,
									});
								}
							});
						} else {
							res.status(200).send({
								success: false,
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(200).send({
							success: false,
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(200).send({
						success: false,
						message: 'User Not Found'
					});
				}
			});
		} else {
			res.status(200).send({
				success: false,
				message: 'Please provide a new password'
			});
		}
	}
	else {
		res.status(200).send({
			success: false,
			message: 'User is not signed in'
		});
	}
};

'use strict';

const constants = require('../constansts');

/**
 * Module dependencies.
 */
let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
	crypto = require('crypto'),
	config = require('../config.server');

/**
 * A Validation function for local strategy password
 */
let validateLocalStrategyPassword = function (password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
let UserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		unique: true
    },
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
    profileImages:{
        type:String,
        // max :255,
        default: ""
    },
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
    },
    provider:{
        type: String,
    },
	salt: {
		type: String
	},
	roles: {
		type: [{
			type: Number,
			enum: [config.roles.admin, config.roles.user]
		}],
		required: "User must assigned a role"
	},

	deviceDetails:{
		deviceType: {
            type: Number,
             enum: [
               constants.DEVICE_TYPES.IOS,
               constants.DEVICE_TYPES.ANDROID
            ],
            default:constants.DEVICE_TYPES.ANDROID
        },
        deviceToken: { type: String, trim: true}
	},
	
    istestproject:{
        type:Boolean,
        default:false
    },
	isDeleted: {
		type: Boolean,
		default: false
    }
});
/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
	if (this.password && this.password.length > 3) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
};
UserSchema.index({ 'locationLongLat.coordinates': "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
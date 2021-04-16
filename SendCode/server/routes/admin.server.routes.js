"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    admin = require('../controllers/admin.server.controllers')

    router.route('/loginadmin')
	.post(admin.signInAdmin);

    router.route('/usersadmin')
    .get(auth.hasAuthentcation(),admin.getUsersAdmin);


    router.route('/resetpassword')
	.post(admin.resetAdmin);
    
    router.route('/deleteuser/:id')
    .patch(auth.hasAuthentcation(),admin.deleteUser);



module.exports = router
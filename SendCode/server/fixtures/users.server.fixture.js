'use strict';

let models = require('../models'),
    config = require('../config.server'),
    appConstants = require("../constansts");

let moreFunctions = {
    fixtureUser: async () => {
        try {
            let res = await models.users.findOne({ roles: { $in: [config.roles.admin] } })
            if (res === null) {
                console.log("Fixture Admin created successfully");
                let user = await models.users.create({
                    "email": "admin@admin.com",
                    "firstName": "Admin",
                    "lastName": "Admin",
                    "password": "test@123",
                    "phoneNumber":"0000000000",
                    "roles": [config.roles.admin],
                });
                console.log("Fixture user created successfully", user._id)
            }
        } catch (err) {
            console.log("error", err);
        }
    }
}

module.exports = moreFunctions;

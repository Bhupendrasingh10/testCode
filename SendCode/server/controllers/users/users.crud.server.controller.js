'use strict'

const { response } = require('express');

let _ = require('lodash'),
    models = require('../../models'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require('../../config.server'),
    path = require('path'),
    request = require("request"),
    Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(process.env.PWD, 'uploads'));
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    }),
    uploadAllTypeOfFiles = multer({
        storage: Storage
    }),
    documentImage = uploadAllTypeOfFiles.array('profileImage')

let crud = {

    uploadPhoto: (req, response) => {
        documentImage(req, response, (err) => {
            let profileImage = ''
            let profileImages = []
            console.log("err", err)
            if (req.files) {
                for (let index = 0; index < req.files.length; index++) {
                    profileImages.push(profileImage = config.serverUrl + req.files[index].filename)
                }
                response.status(200).send({
                    success: true,
                    message: "Success",
                    data: {
                        imagePath: profileImages
                    }
                })
            } else {
                return response.status(400).send({
                    success: false,
                    message: 'uploading failed.'
                })
            }
        })
    },
}
module.exports = crud
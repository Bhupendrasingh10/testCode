
const Models = require('../models');
const errorHandler = require('./errors.server.controller')

const aboutUs = async (req, res) => {

    try {
        let about = await Models.aboutus.findOne()
        console.log(about)
        if (!about) {
            res.status(200).send({
                success: false,
                message: errorHandler.getErrorMessage(err)
            })
        }
        else {
            return res.status(200).send(
                about.aboutUsHtml
            )
        }
    }
    catch (error) {
        res.status(200).send({
            success: false,
            message: errorHandler.getErrorMessage(error)
        })

    }
}

const aboutProgram = async (req, res) => {

    try {
        let aboutProgramObject = await Models.aboutprogram.findOne()
        if (!aboutProgramObject) {
            res.status(200).send({
                success: false,
                message: errorHandler.getErrorMessage(err)
            })
        }
        else {
            return res.status(200).send(
                aboutProgramObject.aboutProgramHtml
            )
        }
    }
    catch (error) {
        res.status(20).send({
            success: false,
            message: errorHandler.getErrorMessage(error)
        })

    }
}


module.exports = {
    aboutUs,
    aboutProgram
}
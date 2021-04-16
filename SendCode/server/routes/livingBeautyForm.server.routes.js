"use strict";

const express = require("express");
const router = express.Router();

let auth = require("../controllers/users/users.authorization.server.controller"),
  {
    getDropdowns,
    addFormData,
    getFormData,
  } = require("../controllers/testprojectForm.server.controller");

// Fetch all dropdown values
router.route("/formDropdowns").get(auth.hasAuthentcation(), getDropdowns);

// Add Form Data
router.route("/formData").post(auth.hasAuthentcation(), addFormData);

// Fetch form data
router.route("/formData/:userId").get(auth.hasAuthentcation(), getFormData);

module.exports = router;

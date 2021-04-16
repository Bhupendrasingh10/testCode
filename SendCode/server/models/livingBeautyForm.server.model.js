"use strict";

const constants = require("../constansts");

/**
 * Module dependencies.
 */
let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  config = require("../config.server");

/**
 * Living Beauty Form Schema
 */
let testprojectForm = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  emailAddress: {
    type: String,
    trim: true,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  mailingAddress: {
    type: String,
    trim: true,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  state: {
    type: String,
    trim: true,
    required: true,
  },
  postalCode: {
    type: String,
    trim: true,
    required: true,
  },
  dob: {
    type: String,
    trim: true,
    required: false,
  },
  phoneNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  annaualHouseholdIncome: {
    type: String,
    trim: true,
    required: true,
  },
  peopleInHousehold: {
    type: String,
    trim: true,
    required: true,
  },
  cancerImpactIncome: {
    type: String,
    trim: true,
    required: true,
  },
  cancerImpactExpenses: {
    type: String,
    trim: true,
    required: true,
  },
  elaborateFinancialExpenseCancer: {
    type: String,
    trim: true,
    required: false,
  },
  identifyEthnicity: {
    type: String,
    trim: true,
    required: true,
  },
  primaryHospital: {
    type: String,
    trim: true,
    required: false,
  },
  typeOfCancerAndStage: {
    type: String,
    trim: true,
    required: true,
  },
  dateRecentDiagnosis: {
    type: String,
    trim: true,
    required: true,
  },
  yearOriginalDiagnosis: {
    type: String,
    trim: true,
    required: false,
  },
  cancerJourney: {
    type: String,
    trim: true,
    required: true,
  },
  listOrgamisationSupportCancerDiagnosis: {
    type: String,
    trim: true,
    required: false,
  },
  physicalAndEmotionalNeeds: {
    type: String,
    trim: true,
    required: false,
  },
  howYouHearAboutUs: {
    type: String,
    trim: true,
    required: false,
  },
  safekeepingPersonalBelongingsAgreement: {
    type: Boolean,
    trim: true,
    required: true,
  },
  photoReleaseAgreement: {
    type: Boolean,
    trim: true,
    required: true,
  },
  sendCopyResponse: {
    type: Boolean,
    trim: true,
    required: false,
  },
});

module.exports = mongoose.model("testprojectForm", testprojectForm);


const express = require('express');
const db = require('../models');
const RestApiController = require('../controllers/RestApiController');
const AccountController = require("../controllers/AccountController");

const router = express.Router();

// ROUTE => GET if the user in.
router.get('/registerCheck/:email', RestApiController.getRegisterCheck);

// ROUTE => GET to get all save image of user
router.get('/saveImages/:email',RestApiController.getSaveImagesForUser);

// ROUTE => POST add image to save image of user
router.post('/addSaveImagesForUser', RestApiController.addSaveImagesForUser);

// ROUTE => DELETE delete image of user
router.delete('/deleteSaveImagesForUser',RestApiController.deleteSaveImagesForUser);

// ROUTE => DELETE delete all saved image of user
router.delete('/deleteAllSaveImagesUser', RestApiController.deleteAllSaveImagesUser);

module.exports = router;

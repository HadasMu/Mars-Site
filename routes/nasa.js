const path = require('path');

const express = require('express');
const NasaMainController = require('../controllers/NasaMainController');

const router = express.Router();

// /nasa ROUTE => GET
router.get('/', NasaMainController.getNasa);

module.exports = router;
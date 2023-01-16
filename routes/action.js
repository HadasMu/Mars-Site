const path = require('path');

const express = require('express');

const AccountController = require('../controllers/AccountController');

const router = express.Router();

// / ROUTE => GET
router.get('/', AccountController.getLogin);

//  / ROUTE  => POST
router.post('/', AccountController.PostLogin);

// /register ROUTE => GET
router.get('/register', AccountController.getRegister) ;

// /register ROUTE => POST
router.post('/register', AccountController.postRegister);

// /password ROUTE => GET
router.get('/password', AccountController.getPassword) ;

// /password ROUTE => POST
router.post('/password', AccountController.postPassword);

router.get('/logout',AccountController.getLogout);


module.exports = router;
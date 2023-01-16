const express = require('express');
const router = express.Router();
const session = require('express-session');

//get the nasa page if the user logged in
exports.getNasa =('/nasa', function(req, res, next) {
    if (!req.session.auth) {
        return res.redirect('/');
    }
    res.render('nasa', { name:req.session.name, session: req.session});
    res.end();
});
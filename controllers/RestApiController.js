const express = require('express');
const router = express.Router();
const db = require('../models');
const session = require('express-session');

//get all the image of the user by email
exports.getSaveImagesForUser = (req, res, next) => {
    if (req.session.auth) {
        db.Images.findAll({
            where: {email: req.params.email.toLowerCase()}
        })
            .then(images => {
                res.status(200).json(images)
            })
            .catch(error => {
                res.redirect("/");
            });
    }
    else
    {
        res.redirect("/");
    }
};

//add image after save
exports.addSaveImagesForUser = (req, res, next) => {
     if (req.session.auth) {
         //check if the image already saved.
         db.Images.count({ where: {imageId: req.body.imageId, email: req.body.email}})
             .then(count => {
                 if (count != 0) {
                     return false;
                 }
                 //save the new image in the db
                 return db.Images.create({
                     imageId: req.body.imageId,
                     earthDate:req.body.earthDate,
                     sol: req.body.sol,
                     camera: req.body.camera,
                     mission: req.body.mission,
                     path: req.body.path,
                     email: req.body.email
                 })
                     .then(images => {
                         res.status(200).json(images)
                     })
                     .catch((err) => {
                         res.redirect("/");
                     })
             });
    }
    else
    {
        res.redirect("/");
    }
};

//delete one image from db
exports.deleteSaveImagesForUser = (req, res, next) => {
    //check if the user logged in
      if (req.session.auth) {
          //delete the image by email and image id.
        db.Images.destroy({where:{email:req.body.email,imageId:req.body.imageId}
        })
            .catch((err) => {
                res.redirect("/");
            })
    }
    else
    {
        res.redirect("/");
    }
};

//delete all the image of the user from db.
exports.deleteAllSaveImagesUser = (req, res, next) => {
    if (req.session.auth) {
        db.Images.destroy({where:{email:req.body.email}
        })
            .catch((err) => {
                res.redirect("/");
            })
     }
     else
     {
         res.redirect("/");
     }
};

//check if the user register.
exports.getRegisterCheck = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    db.Account.findOne({
        where:{mail:req.params.email.toLowerCase()}
    })
        .then(account => {
            if(account)
                res.json({ "exist" : true });
            else
                res.json({ "exist" : false });
        })
        .catch((err) => {
            res.redirect("/register");
        })

}
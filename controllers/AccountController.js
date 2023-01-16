const express = require('express');
const router = express.Router();
const Cookies = require('cookies');
const keys = ['keyboard cat'];
const db = require('../models');
const session = require('express-session');
const bodyParser = require("body-parser");

//get page of login if there is no user logged.
exports.getLogin = (req, res, next) => {
  if (req.session.auth) {
    sessionUpdate(req , res);
  }
  res.render('login',{ errorMessage:'', registerName: req.session.registerName});
};

//post login get the nasa page if the email and the password correct.
exports.PostLogin = (req, res, next) => {
  req.session.name = '';
  //check if there is email and pass in the db
  db.Account.findOne({
    where:{mail:req.body.email.toLowerCase(),pass:req.body.password },
  })
      .then(account => {
        //if there is return the nasa page
        if (account) {
          sessionUpdate(req , res);
          req.session.auth = true;
          req.session.name = account.firstName;
          res.redirect("nasa");
        }
        //else return that have problem in the email or pass
        else
        {
          res.render("login", {errorMessage: 'The email address or password you entered isn\'t match to an account.\n', registerName:""});
        }
      })
      .catch((err) => {
        return res.redirect("/");
      })
};

//get register page
exports.getRegister = (req, res, next) => {
  //check if the user already logged in
  if (req.session.auth) {
    sessionUpdate(req , res);
  }
  //get the register page
  res.render('register', { errorMessage:'' });
};

//post register
exports.postRegister = (req, res, next) => {
  let email = req.body.data.email.toLowerCase();

  //check the email and the names
  res.render('register',  () => {
    const regexEmail = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";
    if(email === '' || req.body.data.first_name === '' || req.body.data.family_name === ''
        || email.match(regexEmail))
    {
      res.status(404).send(`not valid request`);
    }
    //check if there is account in the db with same email
    else{
      db.Account.findOne({
        where:{mail:req.body.data.email.toLowerCase()}
      })
          .then(account => {
            //if there is email in the db the user get the register page with error
            if(account)
              res.render('register', { errorMessage:'email already register' });
            //go to pass page
            else
            {
              const cookies = new Cookies(req, res, { keys: keys });
              cookies.set('passRegister', true , { signed: false});
              cookies.set('email', req.body.data.email, { signed: false});
              cookies.set('first_name', req.body.data.first_name, { signed: false});
              cookies.set('family_name', req.body.data.family_name, { signed: false});
              cookies.set('startClock', new Date().toISOString(), { signed: false, maxAge: 60*1000  });
              return res.redirect("password");
            }
          })
          .catch((err) => {
            return res.render('register', { errorMessage:'server problem . please try again later' });
          })
    }
  });
};

//get the password page
exports.getPassword = (req, res, next) => {
  if(req.cookies["passRegister"] !== "true")
    return res.redirect("register");
  res.render('password', { data:req.body , title: 'Express' });
};

//check the password and check if the time of 1 min not pass
exports.postPassword = (req, res, next) => {
  const cookies = new Cookies(req, res, { keys: keys });
  cookies.set('passRegister', false , { signed: false});
  if (req.cookies["startClock"] == null)
  {
    return res.redirect("/register");
  }
  res.render('password',  () => {
    if(req.body.confirm_pass === '' || req.body.password === '' || req.body.password !== req.body.confirm_pass)
    {
      res.status(404).send(`not valid request`);
    }
    //if the password ok and the time also, send data to the db and return the login page
    else
    {
      db.Account.create({
        firstName: req.cookies["first_name"] ,
        lastName: req.cookies["family_name"],
        mail: req.cookies["email"],
        pass:req.body.password
      })

      req.session.registerName = req.cookies["first_name"];
      return res.redirect("/");
    }
  });
};

//if thr user click on log out
exports.getLogout=(req, res, next) => {
  req.session.auth = false;

  res.redirect("/");
}

//function that update the session
const sessionUpdate = (req,res) => {
  if (req.session && req.session.auth === true){
    return res.redirect("nasa");

    //req.session.auth = false;
  } else {
    req.session.auth = false;
    req.session.email = req.body.email;
    req.session.registerName = "";
  }
}
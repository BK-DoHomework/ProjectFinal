import express from "express";

import {auth, home } from "./../controllers/index";

import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "../controllers/passportController/local";


//init all passport
initPassportLocal();


let router = express.Router();
/**
 * INit router
 *
 */

let initRouter = (app) => {

  router.get('/', home.getHome);

  router.get('/login-register',auth.getLoginRegister );

  router.post('/register',authValid.register, auth.postRegister); // khi kich button thì nó sẽ check dữ liệu trước khi đi qua controller

  router.get('/verify/:token', auth.verifyAccount);

  router.post("/login", passport.authenticate("local",{
    // phai dung actiom trong ejs ==> khi dung ==> tra ve
    successRedirect: "/",
    failureRedirect:"/login-register",
    successFlash: true,
    failureFlash: true
  }))

  return app.use("/",router);
};


module.exports=initRouter;
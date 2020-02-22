import express from "express";

import { auth, home, user, contact, notification } from "./../controllers/index";

import { authValid, userValid, contactValid } from "./../validation/index";
import passport from "passport";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";
import initPassportGoogle from "../controllers/passportController/google";



//init all passport
initPassportLocal();

initPassportFacebook();

initPassportGoogle();


let router = express.Router();
/**
 * INit router
 *
 */

let initRouter = (app) => {

  router.get('/', auth.checkLoggedIn, home.getHome);

  router.get('/login-register', auth.checkLoggedOut, auth.getLoginRegister);

  router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister); // khi kich button thì nó sẽ check dữ liệu trước khi đi qua controller

  router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);

  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    // phai dung actiom trong ejs ==> khi dung ==> tra ve
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));


  router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", { scope: ["email"] }));

  router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register",

  }));

  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", { scope: ["email"] }));

  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register",

  }));

  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);
  router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUsersContact, contact.findUserContact);


  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-request-contact", auth.checkLoggedIn, contact.removeRequestContact);

  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);





  return app.use("/", router);
};


module.exports = initRouter;
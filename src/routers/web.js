import express from "express";

import { auth, home, user, contact, notification, message, groupChat } from "./../controllers/index";

import { authValid, userValid, contactValid, messageValid, groupChatValid } from "./../validation/index";
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

  router.get("/contact/search-friends/:keyword", auth.checkLoggedIn, contactValid.searchFriend, contact.searchFriend);


  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-request-contact", auth.checkLoggedIn, contact.removeRequestContact);

  router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);


  router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
  router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);



  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);

  router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);

  router.get("/contact/read-more-contacts-sent", auth.checkLoggedIn, contact.readMoreContactsSend);

  router.get("/contact/read-more-contacts-recieved", auth.checkLoggedIn, contact.readMoreContactsRecieved);
  router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);

  router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);

  router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
  router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup);

  return app.use("/", router);
};


module.exports = initRouter;
import express from "express";

import {auth, home } from "./../controllers/index";


let router = express.Router();
/**
 * INit router
 *
 */

let initRouter = (app) => {

  router.get('/', home.getHome);

  router.get('/login',auth.getLoginRegister );

  router.get('/logout', auth.getLogout);

  return app.use("/",router);
};


module.exports=initRouter;
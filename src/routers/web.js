import express from "express";

import {auth, home } from "./../controllers/index";

import {authValid} from "./../validation/index";


let router = express.Router();
/**
 * INit router
 *
 */

let initRouter = (app) => {

  router.get('/', home.getHome);

  router.get('/login-register',auth.getLoginRegister );

  router.post('/register',authValid.register, auth.postRegister); // khi kich button thì nó sẽ check dữ liệu trước khi đi qua controller

  return app.use("/",router);
};


module.exports=initRouter;
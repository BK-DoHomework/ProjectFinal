import express from "express";
import ConnectDB from "./config/connectDB";

import configViewsEngine from "./config/viewEngine";

import initRouter from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";

import sesstion from "./config/sesstion";
import passport from "passport";

import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";

import cookieParser from "cookie-parser";

import configSocketIo from "./config/socketio";
import events from "events";
import *as configApp from "./config/app";


//Init app
let app = express();

//tang so luong emit colection
events.EventEmitter.defaultMaxListeners =configApp.app.max_events_listeners;

//Init server with socket.io and express app

let server = http.createServer(app);
let io = socketio(server);

//ConnectDB
ConnectDB();
//config Sesstion
sesstion.config(app);

//config views engine
configViewsEngine(app);

//enable post data for request

app.use(bodyParser.urlencoded({ extended: true }));

//enable flash mesage
app.use(connectFlash());

// use cookie parser
app.use(cookieParser());

//config passport

app.use(passport.initialize());
app.use(passport.session());

// init all Router
initRouter(app);

//config socketio
configSocketIo(io,cookieParser,sesstion.sesstionStore)

//init all socket


initSockets(io);



server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`hello Huster Dev , ban dang o ${process.env.APP_HOST} : ${process.env.APP_PORT}/`);

});








//import pem from "pem";
// import https from 'https';


// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   //Init app
//   let app = express();

//   //ConnectDB
//   ConnectDB();
//   //config Sesstion
//   configSesstion(app);

//   //config views engine
//   configViewsEngine(app);

//   //enable post data for request

//   app.use(bodyParser.urlencoded({ extended: true }));

//   //enable flash mesage
//   app.use(connectFlash());

//   //config passport

//   app.use(passport.initialize());
//   app.use(passport.session());

//   // init all Router
//   initRouter(app);

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(`hello thuong , ban dang o ${process.env.APP_HOST} : ${process.env.APP_PORT}/`);

//   });
// })

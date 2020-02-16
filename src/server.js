import express from "express";
import ConnectDB from "./config/connectDB";

import configViewsEngine from "./config/viewEngine";

import initRouter from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";

import configSesstion from "./config/sesstion";

//Init app
let app = express();

//ConnectDB
ConnectDB();
//config Sesstion
configSesstion(app);

//config views engine
configViewsEngine(app);

//enable post data for request

app.use(bodyParser.urlencoded({ extended: true }));

//enable flash mesage
app.use(connectFlash());

// init all Router
initRouter(app);



app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`hello thuong , ban dang o ${process.env.APP_HOST} : ${process.env.APP_PORT}/`);

});

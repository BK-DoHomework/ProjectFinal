import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contacts.model";
import configViewsEngine from "./config/viewEngine";

import initRouter from "./routers/web";
import bodyParser from "body-parser";
let app = express();
ConnectDB();

//config views engine
configViewsEngine(app);

//enable post data for request

app.use(bodyParser.urlencoded({extended:true}));

// init all Router
initRouter(app);



app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`hello thuong , ban dang o ${ process.env.APP_HOST} : ${process.env.APP_PORT}/`);

});
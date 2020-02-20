import sesstion from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(sesstion);

// config sesstion

let sesstionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  // autoRemove: "active" // sau 1day cookie tu bien mat trong csdl

});
// config sesstion

let config = (app) => {
  app.use(sesstion({
    key: process.env.SESSTION_KEY,
    secret: process.env.SESSTION_SECRET,
    store: sesstionStore,   //mac dinh la luu tren Ram=> tim cach luu vao Csdl
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 //1 day
    }

  }))
};

module.exports = {
  config :config,
  sesstionStore:sesstionStore

};

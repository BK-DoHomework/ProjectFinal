import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contacts.model";
import configViewsEngine from "./config/viewEngine";
let app = express();
ConnectDB();
configViewsEngine(app);
// let hostname = 'localhost';
// let port = 8017;
// app.get('/test-database', async (req, res) => {
//   try {
//     let item = {
//       userId: "Tran Tien Thuong",
//       contactId: "okay !",
//     }
//     let contact = await ContactModel.createNew(item); // doi contactModel tao xonng ban ghi moi in ra
//     res.send(contact);
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get('/',  (req, res) => {
  return res.render("main/master");

});
app.get('/login',  (req, res) => {
  return res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`hello thuong , ban dang o ${ process.env.APP_HOST} : ${process.env.APP_PORT}/`);

});
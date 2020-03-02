import UserModel from "../models/userModel";
import bcrypt from "bcrypt";

import uuidv4 from "uuid/v4";
import { reject, resolve } from "bluebird";
import { transErrors, transSuccess, transMail } from "../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {

    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt != null) {

        return reject(transErrors.account_remove);
      }
      if (!userByEmail.local.isActive) {

        return reject(transErrors.account_not_active);
      }


      return reject(transErrors.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt), // bam nho mat khau de tranh bi tan cong
        verifyToken: uuidv4()
      }
    }
    // tao mot doi tuong moi

    let user = await UserModel.createNew(userItem);

    //truoc khi tra ve success thi lam buoc gui mail o day !
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;

    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));

      })
      .catch(async (error) => {
        //remove user
        await UserModel.removeById(user._id); // mongo khai bao la _id
        // console.log(error);
        reject(transMail.send_failed);

      })



  });

};

let verifyAccount =  (token) => {
  return new Promise(async(resolve, reject) => {
    let userFindByToken = await UserModel.findByToken(token);
    if(!userFindByToken) {
      return reject(transErrors.token_undefined);
    }

    await UserModel.verify(token);
    resolve(transSuccess.account_active);

  });

};


module.exports = {
  register: register,
  verifyAccount: verifyAccount
}

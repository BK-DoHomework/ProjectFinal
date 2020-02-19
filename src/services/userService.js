import UserModel from "../models/userModel";
import { transErrors } from "../../lang/vi";
import bcrypt from "bcrypt";

let saltRounds = 7;

//update user info {id:userId, iteam:updatedAt}
let updateUser = (id, item) => {

  return UserModel.updateUser(id, item);

};
//update user password {id:userId, iteam:updatedAt}
let updatePassword = (id, item) => {
  return new Promise(async (resovle, reject) => {
    let currentUser = await UserModel.findUserById(id);

    //khong ton tai user
    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(item.currentPassword);
    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcrypt.hashSync(item.newPassword, salt));

    resovle(true);
  });



};

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
};
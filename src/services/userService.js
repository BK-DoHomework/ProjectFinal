import UserModel from "../models/userModel";

//update user info {id:userId, iteam:updatedAt}
let updateUser = (id, item) => {

  return UserModel.updateUser(id, item);

};

module.exports = {
  updateUser: updateUser
}
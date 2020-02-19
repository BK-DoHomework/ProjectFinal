import ContactModel from "../models/contactsModel";
import UserModel from "../models/userModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resovle,reject)=>{
    let deprecatedUserIds=[]; // tra ve nhung id khong dung nua , nhung id nay se nam trong bang contact

    let contactsByUser = await ContactModel.findAllByUser(currentUserId);

    contactsByUser.forEach((contact)=>{
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    })
    //loc het cac du lieu vi trung lap
    deprecatedUserIds=_.uniqBy(deprecatedUserIds);

    let users = await UserModel.findAllForAddContact(deprecatedUserIds,keyword);
    resovle(users);


  });




};

module.exports = {
  findUserContact: findUserContact
};
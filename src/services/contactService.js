import ContactModel from "../models/contactsModel";
import UserModel from "../models/userModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resovle,reject)=>{
    let deprecatedUserIds=[currentUserId]; // tra ve nhung id khong dung nua , nhung id nay se nam trong bang contact

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

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resovle,reject)=>{
    let contactExists= await ContactModel.checkExists(currentUserId,contactId);
    if(contactExists){
      return reject (false);
    }
    //tao ban ghi moi
    let newContactItem ={
      userId: currentUserId,
      contactId:contactId
    }

    let newContact = await ContactModel.createNew(newContactItem);

    resovle(newContact);


  });




};

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resovle,reject)=>{
    let removeReq= await ContactModel.removeRequestContact(currentUserId,contactId);
    // console.log(removeReq.result); ==>n = 0 or n=1

    if(removeReq.result.n===0){
      return reject (false);
    }
    resovle(true);
  });

};

module.exports = {
  findUserContact: findUserContact,
  addNew:addNew,
  removeRequestContact:removeRequestContact
};
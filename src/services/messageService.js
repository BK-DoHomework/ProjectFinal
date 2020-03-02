import ContactModel from "../models/contactsModel";
import UserModel from "../models/userModel";

import ChatGroupModel from "../models/chatGroupModel";
import _ from "lodash";


const LIMIT_CONVERSATION = 10;
//get all convers
let getAllConverstionItems = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION);
      let userConversationPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact= await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
          getUserContact.createdAt =contact.createdAt;//lay obj nem vao
          return getUserContact;
        } else {
          let getUserContact= await UserModel.getNormalUserDataById(contact.contactId)
          getUserContact.createdAt =contact.createdAt;//lay obj nem vao
          return getUserContact;
        }

      })

      let userConversation = await Promise.all(userConversationPromise);

      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION);
      // console.log(userConversation);
      // console.log("---------------------------")
      // console.log(groupConversations);
      let allConversations = userConversation.concat(groupConversations);//merge 2 mang

      allConversations =_.sortBy(allConversations,(item)=>{
        return -item.createdAt; //sap xep tu lon --->be
      })


      resovle({
        userConversation:userConversation,
        groupConversations:groupConversations,
        allConversations:allConversations
      });

    } catch (error) {
      return reject(error);
    }
  })
};

module.exports = {
  getAllConverstionItems: getAllConverstionItems
}
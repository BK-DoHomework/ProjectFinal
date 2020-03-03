import { notification,contact,message } from "../services/index";
import {bufferToBase64,lastItemOfArray,convertTimestampToHumanTime} from "../helpers/clientHelper";

let getHome = async (req, res) => {

  //only 10 items
  let notifications = await notification.getNotifications(req.user._id);
  //get amount notification unread

  let countNotifUnread = await notification.countNotifUnread(req.user._id)

  //get contacts 10 items
  let contacts = await contact.getContacts(req.user._id);

  //get contacts 10 items
  let contactsSend = await contact.getContactsSend(req.user._id);
  //get contacts 10 items
  let contactsReceive = await contact.getContactsReceived(req.user._id);

  //count contacts

  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
  let countAllContactsReceive = await contact.countAllContactsReceive(req.user._id);


  let getAllConverstionItems =await message.getAllConverstionItems(req.user._id);

  let userConversation=getAllConverstionItems.userConversation;
  let groupConversations=getAllConverstionItems.groupConversations;
  let allConversations=getAllConverstionItems.allConversations;
  //all message,max 30 items
  let allConversationWithMessages =getAllConverstionItems.allConversationWithMessages;



  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user, //lay gia tri tu secssion nen khong can cau query truy van CSDL,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts:contacts,
    contactsSend:contactsSend,
    contactsReceive:contactsReceive,
    countAllContacts:countAllContacts,
    countAllContactsSend:countAllContactsSend,
    countAllContactsReceive:countAllContactsReceive,
    getAllConverstionItems:getAllConverstionItems,
    userConversation:userConversation,
    groupConversations:groupConversations,
    allConversations:allConversations,
    allConversationWithMessages:allConversationWithMessages,
    bufferToBase64:bufferToBase64,
    lastItemOfArray:lastItemOfArray,
    convertTimestampToHumanTime:convertTimestampToHumanTime
  });

}
module.exports = {
  getHome: getHome
};

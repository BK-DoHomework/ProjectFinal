import { notification, contact, message } from "../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "../helpers/clientHelper";
import { resolve, reject } from "bluebird";
import request from "request";

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);
    // let options = {
    //   url: "https://global.xirsys.net/_turn/DoAnTotNghiep",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/DoAnTotNghiep",
    //   method: "PUT",
    //   headers: {
    //     "Authorization": "Basic " + Buffer.from("tranthuong:c14df2aa-6467-11ea-83ae-0242ac110004").toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length
    //   }
    // };
    // // goi 1 request den ICE cua list turn server
    // request(options, (error, respone, body) => {
    //   if (error) {
    //     console.log("Loi khi gui Request :" + error)
    //     return reject(error);
    //   }
    //   let bodyJson =JSON.parse(body);
    //   resolve(bodyJson.v.iceServers);
    // })

    resolve([]);
  })
}

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


  let getAllConverstionItems = await message.getAllConverstionItems(req.user._id);

  let userConversation = getAllConverstionItems.userConversation;
  let groupConversations = getAllConverstionItems.groupConversations;
  let allConversations = getAllConverstionItems.allConversations;
  //all message,max 30 items
  let allConversationWithMessages = getAllConverstionItems.allConversationWithMessages;
  //GET ICE LIST FROM XIRSYS
  let iceServerList = await getICETurnServer();

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user, //lay gia tri tu secssion nen khong can cau query truy van CSDL,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSend: contactsSend,
    contactsReceive: contactsReceive,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsReceive: countAllContactsReceive,
    getAllConverstionItems: getAllConverstionItems,
    userConversation: userConversation,
    groupConversations: groupConversations,
    allConversations: allConversations,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServerList: JSON.stringify(iceServerList)
  });

}
module.exports = {
  getHome: getHome,
  // getICETurnServer:getICETurnServer
};

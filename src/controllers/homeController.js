import { notification,contact } from "../services/index";

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
    countAllContactsReceive:countAllContactsReceive

  });

}
module.exports = {
  getHome: getHome
};
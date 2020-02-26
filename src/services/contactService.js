import ContactModel from "../models/contactsModel";
import UserModel from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";


const LIMIT_NUMBER = 1;

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resovle, reject) => {
    let deprecatedUserIds = [currentUserId]; // tra ve nhung id khong dung nua , nhung id nay se nam trong bang contact

    let contactsByUser = await ContactModel.findAllByUser(currentUserId);

    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    })
    //loc het cac du lieu vi trung lap
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);

    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resovle(users);

  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resovle, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if (contactExists) {
      return reject(false);
    }
    //tao ban ghi moi
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    }
    //create contact
    let newContact = await ContactModel.createNew(newContactItem);


    //create notification

    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.type.ADD_CONTACT,
    }
    await NotificationModel.model.createNew(notificationItem);
    resovle(newContact);
  });
};



let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resovle, reject) => {
    let removeContact = await ContactModel.removeContact(currentUserId, contactId);
    console.log(removeContact.result);

    if (removeContact.result.n === 0) {
      return reject(false);
    }

    resovle(true);
  });

};




let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resovle, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
    // console.log(removeReq.result); ==>n = 0 or n=1

    if (removeReq.result.n === 0) {
      return reject(false);
    }

    //remove notification

    let notificationType = NotificationModel.type.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, notificationType); //export theo dang doi tuong
    resovle(true);
  });

};

let getContacts = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER);
      let users = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId)
        }

      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(users));

    } catch (error) {

    }
  });

};

let getContactsSend = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER);
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId) // trong ung dung cua minh thi thang kia la contactId
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(users));

    } catch (error) {

    }
  });

};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER);
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(users));

    } catch (error) {

    }
  });

};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resovle(count);

    } catch (error) {

    }
  });

};
let countAllContactsSend = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let count = await ContactModel.countAllContactsSend(currentUserId);
      resovle(count);

    } catch (error) {

    }
  });

};

let countAllContactsReceive = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceive(currentUserId);
      resovle(count);

    } catch (error) {

    }
  });

};


let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resovle, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER);

      // console.log(newNotifications);
      let users = newContacts.map(async (contact) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId)
        }

      })
      // console.log( await Promise.all(users))
      resovle(await Promise.all(users));

    } catch (error) {
      return reject(error);
    }


  });


};





let readMoreContactsSend = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resovle, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSend(currentUserId, skipNumberContacts, LIMIT_NUMBER);
      // console.log(newNotifications);
      let users = newContacts.map(async (contact) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        return await UserModel.getNormalUserDataById(contact.contactId);
      })
      console.log(await Promise.all(users))
      resovle(await Promise.all(users));

    } catch (error) {
      return reject(error);
    }
  });
};

let readMoreContactsRecieved = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resovle, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsRecieved(currentUserId, skipNumberContacts, LIMIT_NUMBER);
      // console.log(newNotifications);
      let users = newContacts.map(async (contact) => {

        return await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
      })
      console.log(await Promise.all(users))
      resovle(await Promise.all(users));

    } catch (error) {
      return reject(error);
    }
  });
};



let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resovle, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
    // console.log(removeReq.result); ==>n = 0 or n=1

    if (removeReq.result.n === 0) {
      return reject(false);
    }

    //remove notification

    // let notificationType =NotificationModel.type.ADD_CONTACT;
    // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId,contactId,notificationType); //export theo dang doi tuong


    resovle(true);
  });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resovle, reject) => {
    let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
    // console.log(approveReq.result); ==>n = 0 or n=1
    console.log(approveReq);
    if (approveReq.nModified === 0) {
      return reject(false);
    }
    //create notification

    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.type.APPROVE_CONTACT,
    }
    await NotificationModel.model.createNew(notificationItem);


    resovle(true);
  });

};


module.exports = {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
  getContacts: getContacts,
  getContactsSend: getContactsSend,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSend: countAllContactsSend,
  countAllContactsReceive: countAllContactsReceive,
  readMoreContacts: readMoreContacts,
  readMoreContactsSend: readMoreContactsSend,
  readMoreContactsRecieved: readMoreContactsRecieved,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  removeContact:removeContact
};
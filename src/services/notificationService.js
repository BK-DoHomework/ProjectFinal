import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";


const LIMIT_NUMBER = 10;

//lay ra cac ban gi khi nguoi dung reload trang

let getNotifications = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, LIMIT_NUMBER);

      let getNotifContents = notifications.map(async (notification) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        let sender = await UserModel.getNormalUserDataById(notification.senderId);

        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(getNotifContents));

    } catch (error) {
      return reject(error);
    }
  });

};
// count all notification unread
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resovle(notificationsUnread);

    } catch (error) {
      return reject(error);
    }


  });

};

let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resovle, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMBER);

      // console.log(newNotifications);
      let getNotifContents = newNotifications.map(async (notification) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        let sender = await UserModel.getNormalUserDataById(notification.senderId);

        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(getNotifContents));

    } catch (error) {
      return reject(error);
    }


  });


};
//function danh dau tat ca cac thong bao laf da doc

let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resovle, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resovle(true);
    } catch (error) {
      console.log(`Loi khi danh dau thong bao da doc:${error}`)
      reject(false);
    }


  });


};
module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
};
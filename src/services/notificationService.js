import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

const LIMIT_NUMBER = 1;

//lay ra cac ban gi khi nguoi dung reload trang

let getNotifications = (currentUserId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, LIMIT_NUMBER);

      let getNotifContents = notifications.map(async (notification) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        let sender = await UserModel.findUserById(notification.senderId);

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

      console.log(newNotifications);
      let getNotifContents = newNotifications.map(async (notification) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentUserId, limit);
        let sender = await UserModel.findUserById(notification.senderId);

        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(getNotifContents));

    } catch (error) {
      return reject(error);
    }


  });


};
module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore
};
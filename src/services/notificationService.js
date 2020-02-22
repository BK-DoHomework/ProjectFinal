import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

//lay ra cac ban gi khi nguoi dung reload trang

let getNotifications = (currentId, limit = 10) => {
  return new Promise(async (resovle, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserAndLimit(currentId, limit);

      let getNotifContents = notifications.map(async (notification) => {

        // let notifications = await NotificationModel.model.getByUserAndLimit(currentId, limit);
        let sender = await UserModel.findUserById(notification.senderId);

        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar);
      })
      // console.log( await Promise.all(getNotifContents))
      resovle(await Promise.all(getNotifContents));

    } catch (error) {
      return reject(error);
    }
  });

};
// count all notification unread
let countNotifUnread = (currentId) => {
  return new Promise(async (resovle, reject) => {
    try {
      let notificationsUnread =await NotificationModel.model.countNotifUnread(currentId);
      resovle(notificationsUnread);

    } catch (error) {
      return reject(error);
    }


  });

};
module.exports = {
  getNotifications: getNotifications,
  countNotifUnread:countNotifUnread
};
import { notification } from "../services/index";

let getHome = async (req, res) => {
    //only 10 items
  let notifications = await notification.getNotifications(req.user._id);
  //get amount notification unread

  let countNotifUnread = await notification.countNotifUnread(req.user._id)

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user, //lay gia tri tu secssion nen khong can cau query truy van CSDL,
    notifications: notifications,
    countNotifUnread:countNotifUnread
  });

}
module.exports = {
  getHome: getHome
};
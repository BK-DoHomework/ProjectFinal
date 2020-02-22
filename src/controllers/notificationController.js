import { notification } from "../services/index";

let readMore = async (req, res) => {
  try {
    //get skip number query params
    let skipNumberNotification = +(req.query.skipNumber);

    console.log(skipNumberNotification);
    console.log(typeof skipNumberNotification);
    console.log(req.user._id);
    //get more items
    let newNotifications = await notification.readMore(req.user._id, skipNumberNotification);
    return res.status(200).send(newNotifications);

  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports = {
  readMore: readMore
};
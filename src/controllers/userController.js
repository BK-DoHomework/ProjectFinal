import multer from "multer";
import { app } from "../config/app";//=>export theo kieu doi tuong nen phai dung {}
import { transErrors, transSuccess } from "../../lang/vi";

import uuidv4 from "uuid/v4";
import { user } from "../services/index";
import fsExtra from "fs-extra";


let storageAvartar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);//=> tham số lỗi và success

  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);

    }
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;//phòng các trường hợp tên ảnh bị trùng khi ứng dụng quá lớn
    callback(null, avatarName);
  },


}); //khai báo nơi mà mình upload ảnh lên ứng dụng của mình


let avatarUploadFile = multer({
  storage: storageAvartar,
  limits: {
    fileSize: app.avatar_limits_size
  }


}).single("avatar");


let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(error);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now()
      }
      //update user
      let userUpdate = await user.updateUser(req.user._id, updateUserItem);
      //remove avatar cu di

      await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
      let result = {
        message: transSuccess.avatar_updated,
        imageSrc: `images/users/${req.file.filename}`
      }

      return res.status(200).send(result);

    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  });

}

module.exports = {
  updateAvatar: updateAvatar
}
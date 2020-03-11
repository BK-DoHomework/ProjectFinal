import { validationResult } from "express-validator/check";
import multer from "multer";
import { app } from "../config/app"; //=>export theo kieu doi tuong nen phai dung {}
import { transErrors, transSuccess } from "../../lang/vi";
import { message } from "./../services/index";
import fsExtra from "fs-extra";
let addNewTextEmoji = async (req, res) => {
  let errorsArr = [];
  let validationErros = validationResult(req); // khai báo biến trả về giá trị bằng giá trị gửi lên sau đó kiểm tra

  if (!validationErros.isEmpty()) {
    let erros = Object.values(validationErros.mapped()); // => trả lại một bảng những cái lỗi đẫ đc nhóm lại !
    erros.forEach((item) => {
      errorsArr.push(item.msg); // đẩy msg vào trong 1 cái mảng rỗng đã khai báo sẵn
    })
    return res.status(500).send(errorsArr); // => khi có lỗi xảy ra thì vẫn trả về trang login nhưng thêm vào là cái mảng lỗi "error" trong flash
  }
  try {
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;
    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
    return res.status(200).send({ message: newMessage })


  } catch (error) {
    return res.status(500).send(error);
  }
}

let storageImageChat = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, app.image_message_directory); //=> tham số lỗi và success

	},
	filename: (req, file, callback) => {
		let math = app.image_message_type;
		if (math.indexOf(file.mimetype) === -1) {
			return callback(transErrors.image_message_type, null);

		}
		let imageName = `${file.originalname}`; //phòng các trường hợp tên ảnh bị trùng khi ứng dụng quá lớn
		callback(null, imageName);
	},


}); //khai báo nơi mà mình upload ảnh lên ứng dụng của mình(đích đến)


let imageMessageUploadFile = multer({
	storage: storageImageChat,
	limits: {
		fileSize: app.image_message_limits_size
	}


}).single("my-image-chat"); //key nay phai dung

let addNewImage =(req, res) => {
  imageMessageUploadFile(req,res, async (error)=>{
    if (error) {
			if (error.message) {
				return res.status(500).send(transErrors.image_message_size);
			}
			return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
      //xoa anh vi anh se luou tru vao trong mongoDB
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)
      return res.status(200).send({ message: newMessage })
    } catch (error) {
      return res.status(500).send(error);
    }
  });

}

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage:addNewImage
}
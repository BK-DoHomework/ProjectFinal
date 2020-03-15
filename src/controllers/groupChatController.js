import { validationResult } from "express-validator/check";
import {groupChat} from "./../services/index";

let addNewGroup = async (req, res) => {
  let errorsArr = [];
  let validationErros = validationResult(req); // khai báo biến trả về giá trị bằng giá trị gửi lên sau đó kiểm tra

  if (!validationErros.isEmpty()) {

    let erros = Object.values(validationErros.mapped()); // => trả lại một bảng những cái lỗi đẫ đc nhóm lại !

    erros.forEach((item) => {
      errorsArr.push(item.msg); // đẩy msg vào trong 1 cái mảng rỗng đã khai báo sẵn
    })
    // console.log(errorsArr);
    return res.status(500).send(errorsArr); // => khi có lỗi xảy ra thì vẫn trả về trang login nhưng thêm vào là cái mảng lỗi "error" trong flash
  }

  try {
    let currentUserId = req.user._id;
    let arrayMemberIds = req.body.arrayIds;
    let groupChatName = req.body.groupChatName;
    let newGroupChat = await groupChat.addNewGroup(currentUserId,arrayMemberIds,groupChatName);
    return res.status(200).send({
      groupChat :newGroupChat
    })

    // console.log(users);



  } catch (error) {
    return res.status(500).send(error);
  }

};
module.exports = {

  addNewGroup:addNewGroup
}
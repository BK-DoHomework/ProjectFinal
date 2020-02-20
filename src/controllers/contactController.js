import { contact } from "../services/index";
import { validationResult } from "express-validator/check";


let findUserContact = async (req, res) => {
  let errorsArr = [];
  let validationErros = validationResult(req); // khai báo biến trả về giá trị bằng giá trị gửi lên sau đó kiểm tra

  if (!validationErros.isEmpty()) {

    let erros = Object.values(validationErros.mapped()); // => trả lại một bảng những cái lỗi đẫ đc nhóm lại !

    erros.forEach((item) => {
      errorsArr.push(item.msg); // đẩy msg vào trong 1 cái mảng rỗng đã khai báo sẵn
    })
    console.log(errorsArr);
    return res.status(500).send(errorsArr); // => khi có lỗi xảy ra thì vẫn trả về trang login nhưng thêm vào là cái mảng lỗi "error" trong flash
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.findUserContact(currentUserId, keyword);
    console.log(users);

    return res.render("main/contact/sections/_fileUserAddContact", { users })

  } catch (error) {
    return res.status(500).send(error);
  }

};

let addNew = async (req, res) => {


  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let newContact = await contact.addNew(currentUserId, contactId);
    console.log(newContact);
    console.log(!!newContact)

    return res.status(200).send({success: !!newContact}) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

}

let removeRequestContact = async (req, res) => {


  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContact(currentUserId, contactId);
    // console.log(newContact);
    // console.log(!!newContact)

    return res.status(200).send({success: !!removeReq}) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

}

module.exports = {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContact:removeRequestContact
}
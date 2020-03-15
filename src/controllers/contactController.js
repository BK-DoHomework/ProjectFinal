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
    // console.log(errorsArr);
    return res.status(500).send(errorsArr); // => khi có lỗi xảy ra thì vẫn trả về trang login nhưng thêm vào là cái mảng lỗi "error" trong flash
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.findUserContact(currentUserId, keyword);
    // console.log(users);

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
    // console.log(newContact);
    // console.log(!!newContact)

    return res.status(200).send({ success: !!newContact }) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

}

let removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contact.removeContact(currentUserId, contactId);
    // console.log(newContact);
    // console.log(!!newContact)

    return res.status(200).send({ success: !!removeContact }) //tra ve true or false
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

    return res.status(200).send({ success: !!removeReq }) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

};


let readMoreContacts = async (req, res) => {


  try {
    //get skip number query params
    let skipNumberContacts = +(req.query.skipNumber);

    // console.log(skipNumberNotification);
    // console.log(typeof skipNumberNotification);
    // console.log(req.user._id);
    //get more items
    let newContactsUser = await contact.readMoreContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContactsUser);

  } catch (error) {
    return res.status(500).send(error);
  }

};



let readMoreContactsSend = async (req, res) => {


  try {
    //get skip number query params
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactsUser = await contact.readMoreContactsSend(req.user._id, skipNumberContacts);
    // console.log(newContactsUser);

    return res.status(200).send(newContactsUser);

  } catch (error) {
    return res.status(500).send(error);
  }

}


let readMoreContactsRecieved = async (req, res) => {


  try {
    //get skip number query params
    let skipNumberContacts = +(req.query.skipNumber);
    let newContactsUser = await contact.readMoreContactsRecieved(req.user._id, skipNumberContacts);
    // console.log(newContactsUser);

    return res.status(200).send(newContactsUser);

  } catch (error) {
    return res.status(500).send(error);
  }

}


let removeRequestContactReceived = async (req, res) => {


  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
    // console.log(newContact);
    // console.log(!!newContact)

    return res.status(200).send({ success: !!removeReq }) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

};


let approveRequestContactReceived = async (req, res) => {


  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
    // console.log(newContact);
    // console.log(!!newContact)

    return res.status(200).send({ success: !!approveReq }) //tra ve true or false
  } catch (error) {
    return res.status(500).send(error);
  }

};


let searchFriend = async (req, res) => {
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
    let keyword = req.params.keyword;
    let users = await contact.searchFriend(currentUserId, keyword);
    // console.log(users);

    return res.render("main/groupChat/sections/_searchFriends", { users })

  } catch (error) {
    return res.status(500).send(error);
  }

};

module.exports = {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
  readMoreContacts: readMoreContacts,
  readMoreContactsSend: readMoreContactsSend,
  readMoreContactsRecieved: readMoreContactsRecieved,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  removeContact: removeContact,
  searchFriend:searchFriend
}
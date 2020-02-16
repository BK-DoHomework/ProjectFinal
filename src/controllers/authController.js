import { validationResult } from "express-validator/check";
import { auth } from "./../services/index";


let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });

};
let postRegister = async (req, res) => {

  // console.log(req.body);
  let errorsArr = [];
  let successArr = [];



  let validationErros = validationResult(req); // khai báo biến trả về giá trị bằng giá trị gửi lên sau đó kiểm tra

  if (!validationErros.isEmpty()) {

    let erros = Object.values(validationErros.mapped()); // => trả lại một bảng những cái lỗi đẫ đc nhóm lại !

    erros.forEach((item) => {
      errorsArr.push(item.msg); // đẩy msg vào trong 1 cái mảng rỗng đã khai báo sẵn
    })
    // console.log(errorsArr);

    req.flash("errors", errorsArr);

    return res.redirect("/login-register"); // => khi có lỗi xảy ra thì vẫn trả về trang login nhưng thêm vào là cái mảng lỗi "error" trong flash
  }
  // console.log(req.body);

  try {
    let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password,req.protocol,req.get("host"));

    successArr.push(createUserSuccess);


    req.flash("success", successArr);
    return res.redirect("/login-register");

  } catch (error) {
    errorsArr.push(error); // bat truong hop email dung lai

    req.flash("errors", errorsArr);

    return res.redirect("/login-register");
  }


};

let verifyAccount = async (req,res)=>{
  let errorsArr = [];
  let successArr = [];

  try {
    let veryfiSuccess = await auth.verifyAccount(req.params.token);
    successArr.push(veryfiSuccess);

    req.flash("success", successArr);
    return res.redirect("/login-register");

  } catch (error) {
    errorsArr.push(error); // bat truong hop email dung lai

    req.flash("errors", errorsArr);

    return res.redirect("/login-register");
  }



};



module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount:verifyAccount
}

import {validationResult} from "express-validator/check";
import e from "express";


let getLoginRegister =(req, res) => {
  return res.render("auth/master");

};
let postRegister =(req, res) => {

  // console.log(req.body);
  let errorsArr =[];



  let validationErros = validationResult(req); // khai báo biến trả về giá trị bằng giá trị gửi lên sau đó kiểm tra

  if (!validationErros.isEmpty()){

    let erros=Object.values(validationErros.mapped()); // => trả lại một bảng những cái lỗi đẫ đc nóm lại !

    erros.forEach((item) =>{
      errorsArr.push(item.msg); // đẩy msg vào trong 1 cái mảng rỗng đã khai báo sẵn
    })
    // console.log(errorsArr);
  }
  // console.log(req.body);



};


module.exports={
  getLoginRegister:getLoginRegister,
  postRegister:postRegister
}

import { validationResult } from "express-validator/check";
import { message } from "./../services/index";
let addNewTextEmoji = async(req, res) => {
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

        // console.log(receiverId);
        // console.log(messageVal);
        // console.log(isChatGroup);


    } catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = {
    addNewTextEmoji: addNewTextEmoji
}
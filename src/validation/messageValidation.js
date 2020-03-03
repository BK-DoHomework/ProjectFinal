import { check } from "express-validator/check";
import { transValidation } from "../../lang/vi";

let checkMessageLength = [
  check("messageVal", transValidation.message_text_emoji_error)
    .isLength({
      min:1,
      max:30
    })
];

module.exports = {
  checkMessageLength: checkMessageLength
}

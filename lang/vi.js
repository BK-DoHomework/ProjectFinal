export const transValidation = {
  email_incorrect: "Email phải có dạng example.com",
  gender_incorrect: "Sao lại sai được nhỉ ?",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 kí tự , bao gồm chữ hoa chữ thường và kí tự đặt biệt",
  password_confirmation_incorrect: "Nhập lại mật khâu chưa chính xác !",

};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng !",
  account_remove: "Tài khoản này đã bị gỡ khỏi hệ thông, nếu là hiểu lầm thì hãy liện hệ với bộ phận hỗ trợ của chúng tôi !",
  account_not_active: "Tài khoản đã đăng kí nhưng chưa active , bạn hãy check email !",
  token_undefined : "Token không tồn tại",
  login_failed : "Sai tài khoản hoặc mật khẩu !",
  server_erross: "Lỗi server , vui lòng đăng nhập lại sau !Liên hệ với bộ phận hỗ trợ để đc giúp đỡ ",
  avatar_type: "Kiểu dữ liệu không hợp lệ !, chỉ chấp nhận jpg và png !",
  avatar_size:"Chỉ chấp nhận dạng dữ liệu dưới 1MB ",

}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã đc tạo , vui lòng kiểm tra mail để active trước khi đăng nhập !`
  },
  account_active : "Kích hoạt tài khoản thành công bạn có thể đăng nhập vào ứng dụng !",
  login_success : (userName)=> {
    return `Xin chào ${userName} , chúc bạn một ngày mới tốt lành !`

  },
  logout_success:"Đăng xuất thành công",
  avatar_updated :"cập nhập ảnh đại diện thành công !"

}

export const transMail ={
  subject : "Xác nhận kích hoạt ứng dụng Chat !",
  template : (linkVerify)=> {
    return `
      <h3><a href="${linkVerify}" target="blank">${linkVerify} </a></h3>
    `;
  },
  send_failed : "Có lỗi khi gửi mail, vui lòng liên hệ với bộ phận hỗ trợ !"
}
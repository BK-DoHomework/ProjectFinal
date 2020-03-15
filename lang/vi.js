export const transValidation = {
	email_incorrect: "Email phải có dạng example.com",
	gender_incorrect: "Sao lại sai được nhỉ ?",
	password_incorrect: "Mật khẩu phải chứa ít nhất 8 kí tự , bao gồm chữ hoa chữ thường và kí tự đặt biệt",
	password_confirmation_incorrect: "Nhập lại mật khâu chưa chính xác !",
	update_username: "User name phải giới hạn trong khoảng 12-17 kí tự, và không có kí tự đặc biệt ",
	update_gender: "Opps!Trường giới tính đang có vấn đề !",
	update_address: "Giới hạn địa chỉ trong khoảng 3-30 kí tự",
	update_phone: "Số điện thoại việt nam bắt đầu tuwd số 0, và giớ hạn là 11 chữ số !",
	keyword_find_user: "Tìm kiếm chỉ ấp dụng cho chữ cái, số, khoảng trắng ,không áp dụng cho các kí tự đặc biệt !",
	message_text_emoji_error: "Tin nhắn không hợp lệ , đảm bảo tối thiêu 1 kí tự, tối đa 400 kí tự !",
	add_new_user_error:"Cuộc trò chuyện phải có nhiều hơn 2 ngừoi, chọn thêm bạn vào nhóm",
	add_new_name_error:"Vui lòng nhập tên cuộc nói chyên từ 5-30 kí tự, không chứa kí tự đặc biệt !"

};

export const transErrors = {
	account_in_use: "Email này đã được sử dụng !",
	account_remove: "Tài khoản này đã bị gỡ khỏi hệ thông, nếu là hiểu lầm thì hãy liện hệ với bộ phận hỗ trợ của chúng tôi !",
	account_not_active: "Tài khoản đã đăng kí nhưng chưa active , bạn hãy check email !",
	account_undefined: "Tài khoản không tồn tại ",
	token_undefined: "Token không tồn tại",
	login_failed: "Sai tài khoản hoặc mật khẩu !",
	server_erross: "Lỗi server , vui lòng đăng nhập lại sau !Liên hệ với bộ phận hỗ trợ để đc giúp đỡ ",
	avatar_type: "Kiểu dữ liệu không hợp lệ !, chỉ chấp nhận jpg và png !",
	avatar_size: "Chỉ chấp nhận dạng dữ liệu dưới 1MB ",
	user_current_password_failed: "Mật khẩu hiện tại của người dùng không chính xác !",
	conversation_not_found: "Cuộc trò chuyện không tồn tại !",
	image_message_type: "Kiểu dữ liệu không hợp lệ !, chỉ chấp nhận jpg và png !",
	image_message_size:"Chỉ chấp nhận dạng dữ liệu dưới 1MB "
}

export const transSuccess = {
	userCreated: (userEmail) => {
		return `Tài khoản <strong>${userEmail}</strong> đã đc tạo , vui lòng kiểm tra mail để active trước khi đăng nhập !`
	},
	account_active: "Kích hoạt tài khoản thành công bạn có thể đăng nhập vào ứng dụng !",
	login_success: (userName) => {
		return `Xin chào ${userName} , chúc bạn một ngày mới tốt lành !`

	},
	logout_success: "Đăng xuất thành công",
	// avatar_updated :"cập nhập ảnh đại diện thành công !",
	user_info_updated: "cập nhập các thông tin người dùng thành công ! ",
	user_password_updated: "cập nhập mật khẩu thành công !"

}

export const transMail = {
	subject: "Xác nhận kích hoạt ứng dụng Chat !",
	template: (linkVerify) => {
		return `
      <h3><a href="${linkVerify}" target="blank">${linkVerify} </a></h3>
    `;
	},
	send_failed: "Có lỗi khi gửi mail, vui lòng liên hệ với bộ phận hỗ trợ !"
}
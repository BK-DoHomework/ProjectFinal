function imageChat(divId){
  $(`#image-chat-${divId}`).unbind("change").on("change",function(){
    let fileData = $(this).prop("files")[0];

    let math = ["image/png", "image/jpg", "image/jpeg"];
    //kiem tra du lieu anh
    let limit = 1048576; //byte=1MB

    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu dữ liệu không hợp lệ !, chỉ chấp nhận jpg và png !", "error", 7);
      $(this).val(null);
      return false;
    }


    if ($.inArray(fileData.size) > limit) {
      alertify.notify("Chỉ chấp nhận dạng dữ liệu dưới 1MB !", "error", 7);
      $(this).val(null);
      return false;
    }
    let targetId= $(this).data("chat");

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (data) {
        console.log(data);
      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
};
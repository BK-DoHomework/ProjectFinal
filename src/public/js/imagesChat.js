function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function () {
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
    let targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (data) {
        let dataToEmit = {
          message: data.message,
        };
        //1:handle message data to show before

        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `
              <img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}"
            class="show-image-chat">`;
        if (isChatGroup) {
          let senderAvatar = `<img src = "/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
          // let senderMessage = data.message.text;
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          // messageOfMe.text(data.message.text);
          // increaseNumberMessageGroup(divId);

          dataToEmit.groupId = targetId;
        } else {

          messageOfMe.html(imageChat);
          dataToEmit.contactId = targetId;
        }

        //2:append mesage data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);
        //3 : nothing

        //4:change data in leftSide

        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
        //5: move conversation to the top


        $(`.person[data-chat=${divId}]`).on("hustdev.moveConversationToTop", function () { //===>phân biệt được với sự kiện click khi thay đổi màn hình
          let dataToMove = $(this).parent(); //===>lấy ra cả thẻ cha là thằng a (not li)
          $(this).closest("ul").prepend(dataToMove); // ==>tìm đến cái thẻ ul gần nhất sau đó đẩy dữ liệu lên đầu
          $(this).off("hustdev.moveConversationToTop"); //==> đóng sự kiện
        });
        $(`.person[data-chat=${divId}]`).trigger("hustdev.moveConversationToTop");
        //6 : xử lí realtime

        socket.emit("chat-image", dataToEmit)
        //7:nothing
        //8:nothing
        //9 : add to modal image
        let imageChatToAddModal = `<img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}">`;
        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);

      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
};

$(document).ready(function () {
	socket.on("response-chat-image", function (response) {
		// console.log("lang nghe response :", response.currentUserId);
		let divId = "";
		//1:handle message data to show before

    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let imageChat = `
    <img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}"
  class="show-image-chat">`;

		if (response.currentGroupId) {
			let senderAvatar = `<img src = "/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`;

			messageOfYou.html(`${senderAvatar} ${imageChat}`);
			// messageOfYou.text(data.message.text);
			if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
				// increaseNumberMessageGroup(divId);
			}

			divId = response.currentGroupId;

		} else {

			messageOfYou.html(imageChat);
			divId = response.currentUserId
		}

		//2:append mesage data to screen
		if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			// console.log("uid:",$("#dropdown-navbar-user").data("uid"))
			$(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
			nineScrollRight(divId);
			$(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
		}


		//3:remove data input

		// $(`#write-chat-${divId}`).val("");
		// currentEmojioneArea.find(".emojionearea-editor").text("");
		//4:change data in leftSide

		$(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

		//5: move conversation to the top

		$(`.person[data-chat=${divId}]`).on("hustdev.moveConversationToTop", function () { //===>phân biệt được với sự kiện click khi thay đổi màn hình
			let dataToMove = $(this).parent(); //===>lấy ra cả thẻ cha là thằng a (not li)
			$(this).closest("ul").prepend(dataToMove); // ==>tìm đến cái thẻ ul gần nhất sau đó đẩy dữ liệu lên đầu
			$(this).off("hustdev.moveConversationToTop"); //==> đóng sự kiện
		});
		$(`.person[data-chat=${divId}]`).trigger("hustdev.moveConversationToTop");
		//6 : xử lí realtime
		//7: nothing
    //8: nothing
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
    let imageChatToAddModal = `<img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}">`;
    $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
    }
	});
});
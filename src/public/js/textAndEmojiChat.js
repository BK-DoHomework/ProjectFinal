function textAndEmojiChat(divId) {
	$(".emojionearea").unbind("keyup").on("keyup", function (element) {
		let currentEmojioneArea = $(this);
		if (element.which === 13) {
			let targetId = $(`#write-chat-${divId}`).data("chat");
			let messageVal = $(`#write-chat-${divId}`).val();
			if (!targetId.length || !messageVal.length) {
				return false;
			}
			let dataTextEmojiForSend = {
				uid: targetId,
				messageVal: messageVal
			}
			if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
				dataTextEmojiForSend.isChatGroup = true;
			}
			//call send message
			$.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
				let dataToEmit = {
					message: data.message,
				};
				// console.log(data.message);
				//1:handle message data to show before

				let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
				messageOfMe.text(data.message.text);
				if (dataTextEmojiForSend.isChatGroup) {
					let senderAvatar = `<img src = "/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
					let senderMessage = data.message.text;
					messageOfMe.html(`${senderAvatar} ${senderMessage}`);
					// messageOfMe.text(data.message.text);
					// increaseNumberMessageGroup(divId);

					dataToEmit.groupId = targetId;
				} else {

					messageOfMe.html(data.message.text);
					dataToEmit.contactId = targetId;
				}
				//2:append mesage data to screen
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);

				//3:remove data input

				$(`#write-chat-${divId}`).val("");
				currentEmojioneArea.find(".emojionearea-editor").text("");

				//4:change data in leftSide

				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

				//5: move conversation to the top


				$(`.person[data-chat=${divId}]`).on("hustdev.moveConversationToTop", function () { //===>phân biệt được với sự kiện click khi thay đổi màn hình
					let dataToMove = $(this).parent(); //===>lấy ra cả thẻ cha là thằng a (not li)
					$(this).closest("ul").prepend(dataToMove); // ==>tìm đến cái thẻ ul gần nhất sau đó đẩy dữ liệu lên đầu
					$(this).off("hustdev.moveConversationToTop"); //==> đóng sự kiện
				});
				$(`.person[data-chat=${divId}]`).trigger("hustdev.moveConversationToTop");

				//6 : xử lí realtime

				socket.emit("chat-text-emoji-one", dataToEmit)
				// console.log(dataToEmit);

				//7 :removetyping realtime
				typingOff(divId);

				//8 :remove case :2 is typing
				let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif")
				if (checkTyping.length) {
					checkTyping.remove();
				}
			}).fail(function (response) {
				//error
				//
				alertify.notify(response.responseText, "error", 7);
			});


			// console.log(targetId);
			// console.log(messageVal);

		}
	})
}


$(document).ready(function () {
	socket.on("response-chat-text-emoji-one", function (response) {
		// console.log("lang nghe response :", response.currentUserId);
		let divId = "";
		//1:handle message data to show before

		let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
		messageOfYou.text(response.message.text);
		if (response.currentGroupId) {
			let senderAvatar = `<img src = "/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`;
			let senderMessage = response.message.text;
			messageOfYou.html(`${senderAvatar} ${senderMessage}`);
			// messageOfYou.text(data.message.text);
			if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
				// increaseNumberMessageGroup(divId);
			}

			divId = response.currentGroupId;

		} else {

			messageOfYou.html(response.message.text);
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
		$(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);

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
	});
});
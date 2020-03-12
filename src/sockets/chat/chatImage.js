import { pushSocketIdToArray, emitNotifyToArray, removeSocketArray } from "../../helpers/socketHelper";
//io params form socket.io
let chatImage = (io) => {
	let clients = {};

	io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
		//push socket id in arr
		clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
		socket.request.user.chatGroupIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		// console.log("client:", clients)
		// console.log("---------------------------------------------------------------------------")
		socket.on("chat-image", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
			// console.log(data);

			if (data.groupId) {
				let respone = {
					currentGroupId: data.groupId,
					currentUserId: socket.request.user._id,
					message: data.message
				};

				if (clients[data.groupId]) {
					emitNotifyToArray(clients, data.groupId, io, "response-chat-image", respone);
				}
				// console.log("response:", respone)
			}
			if (data.contactId) {
				let respone = {
					currentUserId: socket.request.user._id,
					message: data.message
				};

				if (clients[data.contactId]) {
					emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji-one", respone);
				}

			}

		})

		socket.on("disconnect", () => {
			//remove socket id

			clients = removeSocketArray(clients, socket.request.user._id, socket);
			socket.request.user.chatGroupIds.forEach(group => {
				clients = removeSocketArray(clients, group._id, socket);
			});
		});
		// console.log("clients:", clients)
	})
}

module.exports = chatImage;
import { pushSocketIdToArray, emitNotifyToArray, removeSocketArray } from "../../helpers/socketHelper";
//io params form socket.io
let typingOff = (io) => {
	let clients = {};

	io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
		//push socket id in arr
		clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
		socket.request.user.chatGroupIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		// console.log("client:",clients)
		// console.log("---------------------------------------------------------------------------")
		socket.on("user-is-not-typing", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
			// console.log(data);

			if (data.groupId) {
				let respone = {
					currentGroupId: data.groupId,
					currentUserId: socket.request.user._id,

				};

				if (clients[data.groupId]) {
					emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", respone);
				}
				// console.log("response:", respone)
			}
			if (data.contactId) {
				let respone = {
					currentUserId: socket.request.user._id,

				};

				if (clients[data.contactId]) {
					emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", respone);
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

module.exports = typingOff;
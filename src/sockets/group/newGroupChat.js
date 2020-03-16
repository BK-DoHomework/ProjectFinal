import { pushSocketIdToArray, emitNotifyToArray, removeSocketArray } from "../../helpers/socketHelper";
//io params form socket.io
let newGroupChat = (io) => {
	let clients = {};

	io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
		//push socket id in arr
		clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
		socket.request.user.chatGroupIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		// console.log("client:",clients)
		// console.log("---------------------------------------------------------------------------")
		socket.on("new-group-created", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...

      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
      let response = {
        groupChat : data.groupChat
      };
      data.groupChat.memberId.forEach(member =>{
        if(clients[member.userId] && member.userId !=socket.request.user_id){
          emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
        }
      })
		});
		socket.on("member-recieved-group-chat", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...

      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
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

module.exports = newGroupChat;
import { pushSocketIdToArray, emitNotifyToArray, removeSocketArray } from "../../helpers/socketHelper";
//io params form socket.io
let userOnlineOffline = (io) => {
	let clients = {};

	io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
		//push socket id in arr
		clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
		socket.request.user.chatGroupIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
    // console.log(Object.keys(clients))
    let listUserOnline =Object.keys(clients);

    //step1: Emit to user affter login or f5 web page
    socket.emit("server-send-list-user-online",listUserOnline);
    //step 2:Emit to all another user when has new user online
    socket.broadcast.emit('server-send-when-new-user-online',socket.request.user._id);
		socket.on("disconnect", () => {
			//remove socket id
			clients = removeSocketArray(clients, socket.request.user._id, socket);
			socket.request.user.chatGroupIds.forEach(group => {
				clients = removeSocketArray(clients, group._id, socket);
      });
          //step3 :Emit to all another user when has new user offline
          socket.broadcast.emit('server-send-when-new-user-offline',socket.request.user._id);
		});
	})
}

module.exports = userOnlineOffline;
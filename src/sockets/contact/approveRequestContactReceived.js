//io params form socket.io
let approveRequestContactReceived = (io) => {
  let clients = {};

  io.on("connection", (socket) => {    //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)

    let currentUserId = socket.request.user._id;

    //push socket id in arr
    if (clients[currentUserId]) {

      clients[currentUserId].push(socket.id);
    } else {
      clients[currentUserId] = [socket.id];
    }

    // console.log(clients);


    // console.log("---------------------------------------------------------------------------")
    socket.on("approve-request-contact-received", (data) => {  //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      // console.log(data);
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      }
      if (clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("respone-approve-request-contact-received", currentUser);
        })
      }
    })

    socket.on("disconnect", () => {

      //remove socket id
      clients[currentUserId] = clients[currentUserId].filter((socketId) => {

        return socketId !== socket.id;
      })

      if (!clients[currentUserId].length) {
        delete clients[currentUserId];
      }

    })
  })
}

module.exports = approveRequestContactReceived;

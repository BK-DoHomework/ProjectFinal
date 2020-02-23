
//io params form socket.io
let removeRequestContactReceive = (io) => {
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
    socket.on("remove-request-contact-received", (data) => {  //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      // console.log(data);
      let currentUser = {
        id: socket.request.user._id,
      }
      if (clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("respone-remove-request-contact-received", currentUser);
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

module.exports = removeRequestContactReceive;
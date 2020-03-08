// //io params form socket.io
// let chatTextEmoji = (io) => {
//     let clients = {};

//     io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)

//         let currentUserId = socket.request.user._id;

//         //push socket id in arr
//         if (clients[currentUserId]) {

//             clients[currentUserId].push(socket.id);
//         } else {
//             clients[currentUserId] = [socket.id];
//         }
//         // console.log(clients);

//         // console.log("---------------------------------------------------------------------------")
//         socket.on("chat-text-emoji", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
//             // console.log("ddaay laf data truyen len :",data);
//             if (data.groupId) {
//                 let response = {
//                     currentGroupId: data.groupId,
//                     currentUserId: socket.request.user._id,
//                     message: data.message
//                 };
//                 if (clients[data.groupId]) {
//                     clients[data.groupId].forEach(socketId => {
//                         io.sockets.connected[socketId].emit("response-chat-text-emoji", response);
//                     })
//                 }
//                 // console.log("day lad response:",response)
//             }
//             if (data.contactId) {
//                 let response = {
//                     currentUserId: socket.request.user._id,
//                     message: data.message
//                 };
//                 if (clients[data.contactId]) {
//                     clients[data.contactId].forEach(socketId => {
//                         io.sockets.connected[socketId].emit("response-chat-text-emoji", response);
//                     })
//                 }
//             }


//         })

//         socket.on("disconnect", () => {
//             //remove socket id
//             clients[currentUserId] = clients[currentUserId].filter((socketId) => {

//                 return socketId !== socket.id;
//             })
//             if (!clients[currentUserId].length) {
//                 delete clients[currentUserId];
//             }
//         })
//     })
// }

// module.exports = chatTextEmoji; //io params form socket.io

//io params form socket.io
let chatTextEmoji = (io) => {
    let clients = {};

    io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)

        let currentUserId = socket.request.user._id;

        //push socket id in arr
        if (clients[currentUserId]) {

            clients[currentUserId].push(socket.id);
        } else {
            clients[currentUserId] = [socket.id];
        }

        // console.log(clients);


        // console.log("---------------------------------------------------------------------------")
        socket.on("chat-text-emoji", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
            // console.log("ddaay laf data truyen len :",data);
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if (clients[data.groupId]) {
                    clients[data.groupId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-text-emoji", response);
                    })
                }
                // console.log("day lad response:",response)
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if (clients[data.contactId]) {
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-text-emoji", response);
                    })
                }
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

module.exports = chatTextEmoji;
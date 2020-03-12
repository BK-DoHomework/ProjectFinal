import { pushSocketIdToArray, emitNotifyToArray, removeSocketArray } from "../../helpers/socketHelper";
//io params form socket.io
let chatVideo = (io) => {
  let clients = {};

  io.on("connection", (socket) => { //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
    //push socket id in arr
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    // console.log("client:", clients)
    // console.log("---------------------------------------------------------------------------")
    socket.on("caller-check-listener-online-or-not", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      if (clients[data.listenerId]) {
        //online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        }
        emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response);
      } else {
        //offline
        socket.emit("server-send-listener-is-offline");
      }

    })


    socket.on("listener-emit-peer-id-to-server", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName:data.listenerName,
        listenerPeerId :data.listenerPeerId,

      }
      // console.log(response);
      if(clients[data.callerId]){
          emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-listener-to-caller", response);
      }
    })


    socket.on("caller-request-call-to-server", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName:data.listenerName,
        listenerPeerId :data.listenerPeerId,

      }
      // console.log(response);
      if(clients[data.listenerId]){
        emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response);
      }
    })

    socket.on("caller-cancel-request-call-to-server", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName:data.listenerName,
        listenerPeerId :data.listenerPeerId,

      }
      // console.log(response);
      if(clients[data.listenerId]){
        emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response);
      }
    })

    socket.on("listener-reject-request-call-to-server", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName:data.listenerName,
        listenerPeerId :data.listenerPeerId,

      }
      // console.log(response);
      if(clients[data.callerId]){
        emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response);
      }
    })

    socket.on("listener-accept-request-call-to-server", (data) => { //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName:data.listenerName,
        listenerPeerId :data.listenerPeerId,

      }
      // console.log(response);
      if(clients[data.callerId]){
        emitNotifyToArray(clients, data.callerId, io, "server-send-accept-call-to-caller", response);
      }
      if(clients[data.listenerId]){
        emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-call-to-listener", response);
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

module.exports = chatVideo;
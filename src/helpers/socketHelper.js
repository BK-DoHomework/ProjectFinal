export let pushSocketIdToArray = (clients, userId, socketId) => {
    //push socket id in arr
    if (clients[userId]) {

        clients[userId].push(socketId);
    } else {
        clients[userId] = [socketId];
    }
    return clients;
    // console.log(clients);
}

export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(eventName, data));


}

export let removeSocketArray = (clients, userId, socket) => {

    clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);

    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
}
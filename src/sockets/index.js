import addNewContact from "./contact/addNewContact";


//io params form socket.io
let initSockets = (io) => {

  addNewContact(io);

};

module.exports = initSockets;
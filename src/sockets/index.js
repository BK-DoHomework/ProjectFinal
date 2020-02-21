import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";


//io params form socket.io
let initSockets = (io) => {

  addNewContact(io);
  removeRequestContact(io);

};

module.exports = initSockets;
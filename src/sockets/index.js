import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";

import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeContact from "./contact/removeContact";


//io params form socket.io
let initSockets = (io) => {

  addNewContact(io);
  removeRequestContact(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
  removeContact(io);


};

module.exports = initSockets;
import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";

import approveRequestContactReceived from "./contact/approveRequestContactReceived";


//io params form socket.io
let initSockets = (io) => {

  addNewContact(io);
  removeRequestContact(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);


};

module.exports = initSockets;
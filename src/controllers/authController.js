let getLoginRegister =(req, res) => {
  return res.render("auth/loginRegister");

}
let getLogout =(req, res) => {
  //do st

}


module.exports={
  getLoginRegister:getLoginRegister,
  getLogout:getLogout
}

let getHome = (req, res) => {
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user : req.user //lay gia tri tu secssion nen khong can cau query truy van CSDL
  });

}
module.exports = {
  getHome: getHome
};
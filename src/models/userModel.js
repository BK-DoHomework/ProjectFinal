import mongoose from 'mongoose';
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null }, //có thể số đt sau này để theo kiểu +84
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },

  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },

  deletedAt: { type: Number, default: null },

});


UserSchema.statics = {
  createNew(item) {
    return this.create(item); // sử dụng hàm create có sẵn của mogoDB
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec()
  }
  ,
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token }, //tim den tai khoan co cai token do sau do set trang thai lai

      { "local.isActive": true, "local.verifyToken": null }

    ).exec();
  },
  findUserById(id) {
    return this.findById(id).exec();
  },
  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); //return old item affter update

  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec();
  },
  //
  findAllForAddContact(deprecatedUserIds, keyword){
    return this.find({
      $and:[
        {"_id":{$nin:deprecatedUserIds}}, //loc ra cac doi tuong co cai id khong nam trong cai mang truyen vao
        {"local.isActive":true},
        {$or:[
          {"username":{"$regex":keyword}}, //tim cac user name gan giong voi keyword theo phuong thuc regex cua mongoose
          {"local.email":{"$regex":keyword}},
          {"facebook.email":{"$regex":keyword}},
          {"google.email":{"$regex":keyword}},
        ]}
      ]
    },{
      _id:1,
      username:1,
      address:1,
      avatar:1
    }).exec();
  }




};

//static giup chung ta tim kiem ban gi va method giup chung ta thao tac voi ban ghi

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); //promise nay tra ve gi true or false

  }
}

module.exports = mongoose.model("user", UserSchema);

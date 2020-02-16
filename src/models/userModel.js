import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: Number, default: null },
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

  findByToken(token){
    return this.findOne({"local.verifyToken": token}).exec()
  }
  ,
  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken" : token}, //tim den tai khoan co cai token do sau do set trang thai lai

      {"local.isActive":true ,"local.verifyToken" : null}

    ).exec();
  }

};

module.exports = mongoose.model("user", UserSchema);

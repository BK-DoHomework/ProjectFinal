import mongoose from 'mongoose';
import { contact } from '../services';
let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },

  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },

});


ContactSchema.statics = {
  createNew(item) {
    return this.create(item); // sử dụng hàm create có sẵn của mogoDB
  },
  //tim kiem tat ca ban be voi lai tai khoan dang co
  findAllByUser(userId) {
    return this.find({
      $or: [
        { "userId": userId },
        { "contactId": userId }
      ]

    }).exec();
  },
  //kiem tra xem ton tai ban ghi nao lien quan den 2 thang do chua
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId }
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId }
          ]
        }

      ]
    }).exec();

  },
  //xoa cac yeu cau
  removeRequestContact(userId, contactId) {
    return this.remove({
      $and: [
        { "userId": userId },
        { "contactId": contactId }
      ]
    })
  }

};

module.exports = mongoose.model("contact", ContactSchema);

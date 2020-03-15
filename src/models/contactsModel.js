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
        { "contactId": userId },
        { "status" :false}
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
  //xoa lien he => co the la userId , co the la contactId

  removeContact(userId,contactId){
    return this.remove({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId },
            {"status" :true}
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId },
            {"status" :true}
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
    }).exec();
  },
  //lay ra cac ban ghi da la ban be
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId } //ban bef thi khong phan biet ai gui truoc gui va ai nhan
          ]
        },
        { "status": true }
      ]
    }).sort({ "updateAt": -1 }).limit(limit).exec();
  },
  //da gui di nhung chua la ban be
  getContactsSend(userId, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).limit(limit).exec();

  },

  // nhung cai ma minh nhan dc thi minh dang dung tu contactId
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).limit(limit).exec();

  },
  //count contact
  countAllContacts(userId) {
    return this.count({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId } //ban bef thi khong phan biet ai gui truoc gui va ai nhan
          ]
        },
        { "status": true }
      ]
    }).exec();
  },

  countAllContactsSend(userId) {
    return this.count({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).exec();

  },


  countAllContactsReceive(userId) {
    return this.count({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).exec();

  },

  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId } //ban bef thi khong phan biet ai gui truoc gui va ai nhan
          ]
        },
        { "status": true }
      ]
    }).sort({ "updatedAt": -1 }).skip(skip).limit(limit).exec();

  },
  readMoreContactsSend(userId, skip, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();

  },

  readMoreContactsRecieved(userId, skip, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();
  },

  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        { "userId": contactId },
        { "contactId": userId },
        { "status": false }
      ]
    }).exec();
  },
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and:[
        { "contactId": userId },

        { "userId": contactId },

        {"status":false}
      ]
    },{
      "status":true,
      "updateAt":Date.now()
    }).exec();
  },


  updateWhenHasNewMessage(userId,contactId){
    return this.update({
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
    },{
      "updatedAt":Date.now()
    }).exec();
  },
    //lay ra cac ban ghi da la ban be
    getFriends(userId) {
      return this.find({
        $and: [
          {
            $or: [
              { "userId": userId },
              { "contactId": userId } //ban bef thi khong phan biet ai gui truoc gui va ai nhan
            ]
          },
          { "status": true }
        ]
      }).sort({ "updateAt": -1 }).exec();
    },


};

module.exports = mongoose.model("contact", ContactSchema);

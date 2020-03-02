import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  // sender: {
  //   id: String,
  //   username: String,
  //   avatar: String
  // },
  // receiver: {
  //   id: String,
  //   username: String,
  //   avatar: String
  // },

  senderId:String,
  receiverId:String,
  type: String,
  // content: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
});


NotificationSchema.statics = {
  createNew(item) {
    return this.create(item); // sử dụng hàm create có sẵn của mongoDB
  },
  removeRequestContactNotification(senderId,receiverId,type){
    return this.remove({
      $and:[
        {"senderId":senderId},
        {"receiverId":receiverId},
        {"type":type}
      ]
    }).exec();

  },
  //hien thi so notification toi da cho phep theo thoi gian moi nhat
  getByUserAndLimit(userId,limit){
    return this.find({
      "receiverId":userId
    }).sort({"createdAt":-1}).limit(limit).exec();
  },
  //count all notification unread
  countNotifUnread(userId){
    return this.count({
      $and:[
        {"receiverId":userId},
        {"isRead":false}
      ]
    }).exec();

  },
  //load them 10 ban ghi
  readMore(userId,skip,limit){
    return this.find({
      "receiverId":userId
    }).sort({"createdAt":-1}).skip(skip).limit(limit).exec();
  },

  markAllAsRead(userId,targetUsers){ // string/arr
    return this.updateMany({
      $and:[
        {"receiverId":userId},
        {"senderId":{
          $in:targetUsers
        }}
      ]
    },{"isRead":true}).exec();

  }

};

const NOTIFICATION_TYPE= {
  ADD_CONTACT : "add_contact",
  APPROVE_CONTACT : "approve_contact"

}
const NOTIFICATION_CONTENT ={
  getContent :(notificationType,isRead,userId,username,userAvatar)=>{


    if(notificationType===NOTIFICATION_TYPE.ADD_CONTACT){
      if(!isRead){
        return `<div class="notif_readed_false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${ userAvatar }" alt="">
        <strong>${ username }</strong> đã gửi bạn lời mời kết bạn !
        </div>`
      }
      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${ userAvatar }" alt="">
      <strong>${ username }</strong> đã gửi bạn lời mời kết bạn !
      </div>`
    }


    if(notificationType===NOTIFICATION_TYPE.APPROVE_CONTACT){
      if(!isRead){
        return `<div class="notif_readed_false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${ userAvatar }" alt="">
        <strong>${ username }</strong> đã chấp nhận lời mời kết bạn !
        </div>`
      }
      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${ userAvatar }" alt="">
      <strong>${ username }</strong> đã chấp nhận lời mời kết bạn !
      </div>`
    }
    return "No matching with any notification !!"
  },


}

module.exports = {
  model :mongoose.model("notification", NotificationSchema),
  type :NOTIFICATION_TYPE,
  contents :NOTIFICATION_CONTENT
};

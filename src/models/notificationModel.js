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
    return this.create(item); // sử dụng hàm create có sẵn của mogoDB
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
    }).sort({"createdAt":-1}).limit(limit).exec()
  },
  //count all notification unread
  countNotifUnread(userId){
    return this.count({
      $and:[
        {"receiverId":userId},
        {"isRead":false}
      ]
    }).exec();

  }
};

const NOTIFICATION_TYPE= {
  ADD_CONTACT : "add_contact"

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
    return "No matching with any notification !!"
  }
}

module.exports = {
  model :mongoose.model("notification", NotificationSchema),
  type :NOTIFICATION_TYPE,
  contents :NOTIFICATION_CONTENT
};

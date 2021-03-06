import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId:String,
  conversationType:String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },

  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },

});
const MESSAGE_CONVERSATION_TYPES= {
  PERSONAL:"personal",
  GROUP:"group"
}
const MESSAGE_TYPE= {
  TEXT :"text",
  IMAGE:"image",
  FILE :"file "
}
MessageSchema.statics={
  createNew(item) {
    return this.create(item); // sử dụng hàm create có sẵn của mogoDB
  },
  getMessagesInPersonal(senderId,receiverId,limit){ //currentId,contactId
    return this.find({
      $or: [
        {$and :[{
          "senderId":senderId,
          "receiverId":receiverId
        }]},
        {$and :[{
          "senderId":receiverId,
          "receiverId":senderId
        }]}

      ]
    }).sort({"createdAt":-1}).limit(limit).exec(); //sap xap theo thu tu tu duoi len tren
  },

  getMessagesInGroup(receiverId,limit){ //ID cua 1 group chat cu the
    return this.find({
      "receiverId":receiverId
    }).sort({"createdAt":-1}).limit(limit).exec(); //sap xap theo thu tu tu duoi len tren
  }
}

module.exports = {
  model :mongoose.model("message", MessageSchema),
  coversationsType :MESSAGE_CONVERSATION_TYPES,
  messageTypes:MESSAGE_TYPE
};

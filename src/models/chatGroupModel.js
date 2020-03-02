import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 100 },
  mesaggeAmount: { type: Number, default: 0 },
  userId: String,
  memberId: [
    { userId: String }
  ],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },

});

ChatGroupSchema.statics ={

  //get chat groupItem by userId and limit
  getChatGroups(userId,limit){
    return this.find({
      "memberId":{$elemMatch:{
        "userId":userId
      }}
    }).sort({"createdAt":-1}).limit(limit).exec();
  }
}
module.exports = mongoose.model("chat-group", ChatGroupSchema);

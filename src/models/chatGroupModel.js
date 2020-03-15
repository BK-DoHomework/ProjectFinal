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
	updatedAt: { type: Number, default: Date.now }, //khi tao cuoc tro chuyen nhom thi auto dc chap thuan :v
	deletedAt: { type: Number, default: null },

});

ChatGroupSchema.statics = {
	createNew(item) {
    return this.create(item); // sử dụng hàm create có sẵn của mogoDB
	},
	//get chat groupItem by userId and limit
	getChatGroups(userId, limit) {
		return this.find({
			"memberId": {
				$elemMatch: {
					"userId": userId
				}
			}
		}).sort({ "updatedAt": -1 }).limit(limit).exec();
	},
	getChatGroupById(id) {
		return this.findById(id).exec();
	},
	updateWhenHasNewMessage(id, newMesaggeAmount) {
		return this.findByIdAndUpdate(id, {
			"mesaggeAmount": newMesaggeAmount,
			"updatedAt": Date.now()
		}).exec();
	},
	getChatGroupIdsByUser(userId) {
		return this.find({
			"memberId": {
				$elemMatch: {
					"userId": userId
				}
			}
		}, { _id: 1 }).exec();
	}
}
module.exports = mongoose.model("chat-group", ChatGroupSchema);
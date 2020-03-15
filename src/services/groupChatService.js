import _ from "lodash";
import ChatGroupModel from "./../models/chatGroupModel";
let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resovle, reject) => {
    try {
      // add currentUserId to arrayMember
      arrayMemberIds.unshift({ userId: `${currentUserId}`});// them 1 phan tu vao dau cua mot mang va phai chuyen ve string

      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId"); //loai trung lap va day thanh object theo dang key : value
      // console.log(arrayMemberIds);
      let newGroupItem = {
        name: groupChatName,
        userAmount:arrayMemberIds.length,
        mesaggeAmount: 0,
        userId: `${currentUserId}` ,
        memberId:arrayMemberIds,
      }
      let newGroup = await ChatGroupModel.createNew(newGroupItem);
      resovle(newGroup);

    } catch (error) {
      reject(error);
    }

  });
};
module.exports = {
  addNewGroup: addNewGroup
}
import ContactModel from "../models/contactsModel";
import UserModel from "../models/userModel";

import ChatGroupModel from "../models/chatGroupModel";
import MessageModel from "../models/messageModel"
import _ from "lodash";
import { transErrors } from "../../lang/vi";
import { app } from "../config/app";


const LIMIT_CONVERSATION = 10;
const LIMIT_MESSAGE = 30;
//get all convers
let getAllConverstionItems = (currentUserId) => {
    return new Promise(async(resovle, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION);
            let userConversationPromise = contacts.map(async(contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.userId) // trong ung dung cua minh thi thang kia la contactId
                    getUserContact.updatedAt = contact.updatedAt; //lay obj nem vao
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId)
                    getUserContact.updatedAt = contact.updatedAt; //lay obj nem vao
                    return getUserContact;
                }

            })

            let userConversation = await Promise.all(userConversationPromise);

            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION);
            // console.log(userConversation);
            // console.log("---------------------------")
            // console.log(groupConversations);
            let allConversations = userConversation.concat(groupConversations); //merge 2 mang

            allConversations = _.sortBy(allConversations, (item) => {
                    return -item.updatedAt; //sap xep tu lon --->be
                })
                //get message apply to screen chat

            let allConversationWithMessagePromise = allConversations.map(async(conversation) => {

                conversation = conversation.toObject();
                if (conversation.memberId) {
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE);
                    conversation.messages = _.reverse(getMessages); //dao nguoc thu tu mang, do tin nhan tra ra la moi nhat ben duoi
                } else {
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGE);
                    conversation.messages = _.reverse(getMessages);
                }
                return conversation;
            })

            let allConversationWithMessages = await Promise.all(allConversationWithMessagePromise);
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt; //sap xep tu lon --->be
            });

            console.log(allConversationWithMessages);


            resovle({
                userConversation: userConversation,
                groupConversations: groupConversations,
                allConversations: allConversations,
                allConversationWithMessages: allConversationWithMessages
            });

        } catch (error) {
            return reject(error);
        }
    })
};


let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => { //current user,id of user or group
    return new Promise(async(resovle, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.avatar_image_group
                }
                let newMessageItems = {
                        senderId: sender.id,
                        receiverId: receiverId,
                        conversationType: MessageModel.coversationsType.GROUP,
                        messageType: MessageModel.messageTypes.TEXT,
                        sender: sender,
                        receiver: receiver,
                        text: messageVal,
                        createdAt: Date.now()
                    }
                    //create message
                let newMessage = await MessageModel.model.createNew(newMessageItems);
                //update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.mesaggeAmount + 1);
                resovle(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }
                let newMessageItems = {
                        senderId: sender.id,
                        receiverId: receiverId,
                        conversationType: MessageModel.coversationsType.PERSONAL,
                        messageType: MessageModel.messageTypes.TEXT,
                        sender: sender,
                        receiver: receiver,
                        text: messageVal,
                        createdAt: Date.now()
                    }
                    //create newmessage
                let newMessage = await MessageModel.model.createNew(newMessageItems);
                //update Contact

                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
                resovle(newMessage);
            }

        } catch (error) {
            return reject(error);
        }
    })
};


module.exports = {
    getAllConverstionItems: getAllConverstionItems,
    addNewTextEmoji: addNewTextEmoji
}
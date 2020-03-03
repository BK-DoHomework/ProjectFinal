function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup",function(element){
    let currentEmojioneArea =$(this);
    if(element.which === 13){
      let targetId =  $(`#write-chat-${divId}`).data("chat");
      let messageVal =  $(`#write-chat-${divId}`).val();
      if(!targetId.length || !messageVal.length){
        return false;
      }
      let dataTextEmojiForSend ={
        uid:targetId,
        messageVal:messageVal
      }

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        dataTextEmojiForSend.isChatGroup=true;
      }
      //call send message

      $.post("/messge/add-new-text-emoji",dataTextEmojiForSend,function(data){
         // console.log(data.message);
        //1:handle message data to show before

        let messageOfMe=$(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        if( dataTextEmojiForSend.isChatGroup){
          messageOfMe.html(`<img src = "/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"`);
          messageOfMe.text(data.message.text);
          increaseNumberMessageGroup(divId);
        }else {
          messageOfMe.text(data.message.text);
        }
        //2:append mesage data to screen

        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        //3:remove data input

        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        //4:change data in leftSide

        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

        //5: move conversation to the top
        
        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTop",function(){ //===>phân biệt được với sự kiện click khi thay đổi màn hình
          let dataToMove =$(this).parent(); //===>lấy ra cả thẻ cha là thằng a (not li)
          $(this).closest("ul").prepend(dataToMove); // ==>tìm đến cái thẻ ul gần nhất sau đó đẩy dữ liệu lên đầu
          $(this).off("click.moveConversationToTop");//==> đóng sự kiện
        });
        $(`.person[data-chat=${divId}]`).click();

        //6 : xử lí realtime
      }).fail(function(response){
        //error
        //
        alertify.notify(response.responseText, "error", 7);
      });


      // console.log(targetId);
      // console.log(messageVal);

    }
  })
}

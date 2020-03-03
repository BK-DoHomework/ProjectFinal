function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup",function(element){
    if(element.which === 13){
      let targetId =  $(`#write-chat-${divId}`).data("chat");
      let messageVal =  $(`#write-chat-${divId}`).val();
      // if(!targetId.length || !messageVal.length){
      //   return false;
      // }
      let dataTextEmojiForSend ={
        uid:targetId,
        messageVal:messageVal
      }

      if($(`#write-chat-${divId}`).hasClass("chat-ingroup")){
        dataTextEmojiForSend.isChatGroup=true;
      }
      //call send message

      $.post("/messge/add-new-text-emoji",dataTextEmojiForSend,function(data){
        //success

        console.log(data.message);
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

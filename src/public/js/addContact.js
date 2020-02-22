function addContact(){
  $(".user-add-new-contact").bind("click",function(){
    let targetId =$(this).data("uid");//data-uid
    console.log(targetId);

    $.post("/contact/add-new",{uid:targetId}, function(data){
      if(data.success){
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide(); //tim den cai no do va an di :v
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css('display','inline-block') //tim den cai no do va an di :v

        increaseNumberNotisContact("count-request-contact-sent")

        socket.emit("add-new-contact",{contactId:targetId})  //ten sk /ts

      }
    })
  })
}
//lang nghe su kien phia server gui ve

socket.on("respone-add-new-contact", function(user){
  let notif=`<div class="notif_readed_false" data-uid="${ user.id }">
          <img class="avatar-small" src="images/users/${ user.avatar }" alt="">
          <strong>${ user.username }</strong> đã gửi bạn lời mời kết bạn !
          </div>`;

  $(".noti_content").prepend(notif);//popup notif

  $("ul.list-notifications").prepend(`<li>${notif}</li>`);//modal notif
  increaseNumberNotisContact("count-request-contact-received");

  increaseNumberNotification("noti_contact_counter");
  increaseNumberNotification("noti_counter");


});
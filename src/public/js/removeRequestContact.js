  function removeRequestContact() {

  $(".user-remove-request-contact").bind("click", function () {
    let targetId = $(this).data("uid");//data-uid
    console.log(targetId);

    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if(data.success){
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide(); //tim den cai no do va an di :v
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display','inline-block') //tim den cai no do va an di :v
          //xu li realtime
          decreaseNumberNotisContact("count-request-contact-sent");
          socket.emit("remove-request-contact",{contactId:targetId})  //ten sk /ts
        }
      }

    })
  })

}
socket.on("respone-remove-request-contact", function(user){

  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();//popup notif

  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();//modal
  decreaseNumberNotisContact("count-request-contact-received");


  decreaseNumberNotification("noti_contact_counter");
  decreaseNumberNotification("noti_counter");
});

function removeRequestContact() {

  $(".user-remove-request-contact").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");//data-uid
    console.log(targetId);

    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide(); //tim den cai no do va an di :v
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block') //tim den cai no do va an di :v
          //xu li realtime

          decreaseNumberNotification("noti_contact_counter", 1);

          decreaseNumberNotisContact("count-request-contact-sent");
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();


          socket.emit("remove-request-contact", { contactId: targetId })  //ten sk /ts
        }
      }

    })
  })

}
socket.on("respone-remove-request-contact", function (user) {

  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();//popup notif

  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();//modal
  decreaseNumberNotisContact("count-request-contact-received");


  decreaseNumberNotification("noti_contact_counter", 1);
  decreaseNumberNotification("noti_counter", 1);
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();
});


$(document).ready(function(){
  removeRequestContact();
});
function removeRequestContactReceived() {

  $(".user-remove-request-contact-received").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");//data-uid
    // console.log(targetId);

    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          //---------------------------------------
          // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();//popup notif
          // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();//modal
          // decreaseNumberNotification("noti_counter", 1);


          //xu li realtime

          decreaseNumberNotification("noti_contact_counter", 1);

          decreaseNumberNotisContact("count-request-contact-received");
          //xoa o tab yeu cau ket ban

          $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

          socket.emit("remove-request-contact-received", { contactId: targetId })  //ten sk /ts
        }
      }

    })
  })

}
socket.on("respone-remove-request-contact-received", function (user) {

  $("#find-user").find(`div.user-remove-request-contact[data-uid=${user.id}]`).hide(); //tim den cai no do va an di :v
  $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css('display', 'inline-block') //tim den cai no do va an di :v


   //xoa o tab cho xac nhan
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();



  decreaseNumberNotisContact("count-request-contact-sent");


  decreaseNumberNotification("noti_contact_counter", 1);


});


$(document).ready(function(){
  removeRequestContactReceived();
});
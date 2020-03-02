function markNotificationAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: { targetUsers: targetUsers },
    success: function (result) {
      // console.log(result);
      if (result) {
        targetUsers.forEach(function (uid) {
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif_readed_false");
          $("ul.list-notifications").find(`li>div[data-uid =${uid}]`).removeClass("notif_readed_false");
        });
        decreaseNumberNotification("noti_counter", targetUsers.length);
      }

    }

  })
}

$(document).ready(function () {
  //popup navbar
  $('#popup-mark-notif-as-read').bind("click", function () {
    let targetUsers = [];
    $(".noti_content").find("div.notif_readed_false").each(function (index, notification) {//==>lap de lay cai uid cua tung thang
      targetUsers.push($(notification).data("uid"));
    });

    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc nữa nữa !", "error", 7);

      // console.log("adasbdjhacbajbcjabcjakbczkjbczkjcbzkjcbzkcbzkcbzkcbzkbc");
      // console.log(targetUsers);
    }
    markNotificationAsRead(targetUsers);
  });


  //modal load_more
  $("#modal-mark-notif-as-read").bind("click", function () {
    let targetUsers = [];
    $("ul.list-notifications").find("li>div.notif_readed_false").each(function (index, notification) {//==>lap de lay cai uid cua tung thang
      targetUsers.push($(notification).data("uid"));



    });

    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc nữa nữa !", "error", 7);
      // console.log(targetUsers);
    }
    markNotificationAsRead(targetUsers);

  });
});
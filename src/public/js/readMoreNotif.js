$(document).ready(function () {
  $("#link-read-more-notif").bind("click", function () {
    let skipNumber = $("ul.list-notifications").find("li").length;


    $(".read-more-notif-loader").css("display", "inline-block");
    $("#link-read-more-notif").css("display", "none");


    // console.log(skipNumber)

    setTimeout(() => {
      // $.get(`/notification/read-more/${skipNumber}`)
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function (notifications) {
        // console.log(notifications);

        if (!notifications.length) {
          alertify.notify("Bạn không còn thông báo nào nữa !", "error", 7);
          $(".read-more-notif-loader").css("display", "none");
          $("#link-read-more-notif").css("display", "inline-block");

          return false;
        }
        notifications.forEach(function (notification) {
          $("ul.list-notifications").append(`<li>${notification}</li>`);//modal notif

        })
        $(".read-more-notif-loader").css("display", "none");
        $("#link-read-more-notif").css("display", "inline-block");

      }) //query params url
    }, 1000);


  })
})
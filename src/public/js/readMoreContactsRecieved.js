$(document).ready(function () {
  $("#link-read-more-contact-received").bind("click", function () {
    let skipNumber = $("#request-contact-received").find("li").length;


    $(".read-more-contact-recieved-loader").css("display", "inline-block");
    $("#link-read-more-contact-received").css("display", "none");
    // console.log(skipNumber)

    setTimeout(() => {
      // $.get(`/notification/read-more/${skipNumber}`)
      $.get(`/contact/read-more-contacts-recieved?skipNumber=${skipNumber}`, function (newContactsUser) {
        // console.log(newContactsUser);

        if (!newContactsUser.length) {
          alertify.notify("Bạn không còn danh sách  nào để xem nữa cả !", "error", 7);
          $(".read-more-contact-recieved-loader").css("display", "none");
          $("#link-read-more-contact-received").css("display", "inline-block");

          return false;
        }
        newContactsUser.forEach(function (user) {
          // console.log(user);
          $("#request-contact-received").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
                                                              <div class="contactPanel">
                                                                <div class="user-avatar">
                                                                  <img src="images/users/${user.avatar}" alt="">
                                                                </div>
                                                                <div class="user-name">
                                                                  <p>
                                                                  ${user.username}
                                                                  </p>
                                                                </div>
                                                                <br>
                                                                <div class="user-address">
                                                                  <span>&nbsp ${(user.address !==null) ? user.address:""}</span>
                                                                </div>
                                                                <div class="user-approve-request-contact-received" data-uid="${user._id}">
                                                                  Chấp nhận
                                                                </div>
                                                                <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                                                                  Xóa yêu cầu
                                                                </div>
                                                              </div>
                                                            </li>
          `);//modal notif

        })
        approveRequestContactReceived();
        removeRequestContactReceived();

        $(".read-more-contact-recieved-loader").css("display", "none");
        $("#link-read-more-contact-received").css("display", "inline-block");

      }) //query params url
    }, 1000);
  })
});

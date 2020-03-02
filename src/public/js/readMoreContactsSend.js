$(document).ready(function () {
  $("#link-read-more-contacts-send").bind("click", function () {
    let skipNumber = $("#request-contact-sent").find("li").length;


    $(".read-more-contact-send-loader").css("display", "inline-block");
    $("#link-read-more-contacts-send").css("display", "none");
    // console.log(skipNumber)

    setTimeout(() => {
      // $.get(`/notification/read-more/${skipNumber}`)
      $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function (newContactsUser) {
        // console.log(newContactsUser);

        if (!newContactsUser.length) {
          alertify.notify("Bạn không còn danh sách  nào để xem nữa cả !", "error", 7);
          $(".read-more-contact-send-loader").css("display", "none");
          $("#link-read-more-contacts-send").css("display", "inline-block");

          return false;
        }
        newContactsUser.forEach(function (user) {
          // console.log(user);
          $("#request-contact-sent").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
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
                                                            <div class="user-remove-request-contact action-danger display-important" data-uid="${user._id}">
                                                              Hủy yêu cầu
                                                            </div>
                                                          </div>
                                                        </li>
          `);//modal notif

        })
        removeRequestContact();
        $(".read-more-contact-send-loader").css("display", "none");
        $("#link-read-more-contacts-send").css("display", "inline-block");

      }) //query params url
    }, 1000);
  })
});

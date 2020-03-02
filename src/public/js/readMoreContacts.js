$(document).ready(function () {
  $("#link-read-more-contacts").bind("click", function () {
    let skipNumber = $("#contacts").find("li").length;


    $(".read-more-contacts-loader").css("display", "inline-block");
    $("#link-read-more-contacts").css("display", "none");
    // console.log(skipNumber)

    setTimeout(() => {
      // $.get(`/notification/read-more/${skipNumber}`)
      $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function (newContactsUser) {
        // console.log(newContactsUser);

        if (!newContactsUser.length) {
          alertify.notify("Bạn không còn bạn bà nào để xem nữa cả !", "error", 7);
          $(".read-more-contacts-loader").css("display", "none");
          $("#link-read-more-contacts").css("display", "inline-block");

          return false;
        }
        newContactsUser.forEach(function (user) {
          // console.log(user);
          $("#contacts").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
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
                                                <div class="user-talk" data-uid="${user._id}">
                                                  Trò chuyện
                                                </div>
                                                <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                                  Xóa liên hệ
                                                </div>
                                              </div>
                                            </li>`);//modal notif

        })
        removeContact();
        $(".read-more-contacts-loader").css("display", "none");
        $("#link-read-more-contacts").css("display", "inline-block");

      }) //query params url
    }, 1000);
  })
});
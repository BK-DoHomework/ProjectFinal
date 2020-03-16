
function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriend(element) {
  if (element.which === 13 || element.type == "click") {

    let keyword = $('#input-search-friends-to-add-group-chat').val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
    // console.log(keyword);

    if (!keyword.length) {
      alertify.notify("Chưa nhập nội dung tìm kiếm !", "error", 7);
      return false;
    }
    if (!regexKeyword.test(keyword)) {
      alertify.notify("Tìm kiếm chỉ ấp dụng cho chữ cái, số, khoảng trắng ,không áp dụng cho các kí tự đặc biệt !", "error", 7);
      return false;
    }
    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $('ul#group-chat-friends').html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện

      cancelCreateGroup();
    })
  }
};

function callCreateGroupChat() {
  //
  $("#btn-create-group-chat").unbind("click").on("click", function () {
    let countUsers = $("ul#friends-added").find("li");
    if (countUsers.length < 2) {
      alertify.notify("Cuộc trò chuyện phải có nhiều hơn 2 ngừoi, chọn thêm bạn vào nhóm", "error", 7);
      return false;
    }
    let groupChatName = $("#input-name-group-chat").val();
    let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if (!regexGroupChatName.test(groupChatName) || groupChatName.length > 30 || groupChatName.length < 5) {
      alertify.notify("Vui lòng nhập tên cuộc nói chyên từ 5-30 kí tự, không chứa kí tự đặc biệt !", "error", 7);
      return false;
    }
    let arrayIds = [];
    $("ul#friends-added").find("li").each(function (index, item) {
      arrayIds.push({
        "userId": $(item).data("uid")
      })
    })
    Swal.fire({
      title: `Bạn có chắc chắn muốn tạo nhóm &nbsp; ${groupChatName} không ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Xác nhận!',
      cancelButtonText: 'Hủy!'
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.post("/group-chat/add-new", {
        arrayIds: arrayIds,
        groupChatName: groupChatName
      }, function (data) {
        // console.log(data.groupChat);
        //step1: hide modal
        $("#input-name-group-chat").val("");
        $("#btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");
        //step2 :handle left side ejs
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14);
        }

        let lefSide = `
                      <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                      <li class="person group-chat" data-chat="${data.groupChat._id}">
                        <div class="left-avatar">
                          <!-- <div class="dot"></div> -->
                          <img src="images/users/group-avatar-trungquandev.png" alt="">
                        </div>
                        <span class="name">
                          <span class="group-chat-name"></span>
                            ${subGroupChatName}<span>...</span>
                          </span>
                        </span>

                        <span class="time"></span>
                        <span class="preview">

                        </span>
                      </li>
                    </a>
        `;
        $("#all-chat").find("ul").prepend(lefSide);
        $("#group-chat").find("ul").prepend(lefSide);
        //step3 :handle rightSide

        let rightSide = `
                        <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
                        <div class="top">
                          <span>To: <span class="name">${data.groupChat.name} </span></span>
                          <span class="chat-menu-right">
                              <a href="#attachsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
                                  Tệp đính kèm
                                  <i class="fa fa-paperclip"></i>
                              </a>
                          </span>
                          <span class="chat-menu-right">
                              <a href="javascript:void(0)">&nbsp;</a>
                          </span>
                          <span class="chat-menu-right">
                              <a href="#imagesModal_${data.groupChat._id} " class="show-images" data-toggle="modal">
                                  Hình ảnh
                                  <i class="fa fa-photo"></i>
                              </a>
                          </span>

                          <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>

                        <span class="chat-menu-right">
                          <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                              <span class="show-number-members">${data.groupChat.userAmount}</span>
                              <i class="fa fa-users"></i>
                          </a>
                        </span>

                        <span class="chat-menu-right">
                          <a href="javascript:void(0)">&nbsp;</a>
                      </span>

                      <span class="chat-menu-right">
                        <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                            <span class="show-number-messages">${data.groupChat.mesaggeAmount}</span>
                            <i class="fa fa-comment-o"></i>
                        </a>
                      </span>
                        </div>
                        <div class="content-chat">
                            <div class="chat" data-chat="${data.groupChat._id}">

                            </div>
                        </div>
                        <div class="write" data-chat="${data.groupChat._id}">
                              <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                              <div class="icons">
                                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                                  <label for="image-chat-${data.groupChat._id}">
                                      <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                                      <i class="fa fa-photo"></i>
                                  </label>
                                  <label for="attach-chat">
                                      <input type="file" id="attach-chat" name="my-attach-chat" class="attach-chat"
                                          data-chat="${data.groupChat._id}">
                                      <i class="fa fa-paperclip"></i>
                                  </label>
                                  <a href="javascript:void(0)" id="video-chat-group">
                                      <i class="fa fa-video-camera"></i>
                                  </a>
                              </div>
                        </div>
                    </div>

        `;
        $("#screen-chat").prepend(rightSide);
        //step4: call fuction change screen chat
        changeScreenChat();
        //step05: handle image modal
        let imageModal = `
                      <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
                      <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                  <h4 class="modal-title">Những Hình Ảnh Trong Cuộc Trò Chuyện. </h4>
                              </div>
                              <div class="modal-body">
                                  <div class="all-images" style="visibility: hidden;">
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
        `;
        $("body").append(imageModal);
        //step06: call function
        gridPhotos(5);

        //step7 : handle attachmentModal
        let attachmentModal = `
        <div class="modal fade" id="attachsModal_${data.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Những Tệp Đính Kèm Trong Cuộc Trò Chuyện<%=conversation._id%> </h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachs">
                    </ul>
                </div>
            </div>
        </div>
    </div>
        `;
        $("body").append(attachmentModal);

        //step8 :emit new group created
        socket.emit("new-group-created", {
          groupChat: data.groupChat
        })

      })
        .fail(function (response) {
          alertify.notify(response.responseText, "error", 7);
        })
    })
  });
};


$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind("keypress", callSearchFriend)

  $('#btn-search-friends-to-add-group-chat').bind("click", callSearchFriend)
  callCreateGroupChat();

  socket.on("response-new-group-created", function (data) { //==> response
    console.log(data);
    //step1: hide modal

    //step2 :handle left side ejs
    let subGroupChatName = data.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14);
    }

    let lefSide = `
                          <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                          <li class="person group-chat" data-chat="${data.groupChat._id}">
                            <div class="left-avatar">
                              <!-- <div class="dot"></div> -->
                              <img src="images/users/group-avatar-trungquandev.png" alt="">
                            </div>
                            <span class="name">
                              <span class="group-chat-name"></span>
                                ${subGroupChatName}<span>...</span>
                              </span>
                            </span>

                            <span class="time"></span>
                            <span class="preview">

                            </span>
                          </li>
                        </a>
            `;
    $("#all-chat").find("ul").prepend(lefSide);
    $("#group-chat").find("ul").prepend(lefSide);
    //step3 :handle rightSide

    let rightSide = `
                            <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
                            <div class="top">
                              <span>To: <span class="name">${data.groupChat.name} </span></span>
                              <span class="chat-menu-right">
                                  <a href="#attachsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
                                      Tệp đính kèm
                                      <i class="fa fa-paperclip"></i>
                                  </a>
                              </span>
                              <span class="chat-menu-right">
                                  <a href="javascript:void(0)">&nbsp;</a>
                              </span>
                              <span class="chat-menu-right">
                                  <a href="#imagesModal_${data.groupChat._id} " class="show-images" data-toggle="modal">
                                      Hình ảnh
                                      <i class="fa fa-photo"></i>
                                  </a>
                              </span>

                              <span class="chat-menu-right">
                                <a href="javascript:void(0)">&nbsp;</a>
                            </span>

                            <span class="chat-menu-right">
                              <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                                  <span class="show-number-members">${data.groupChat.userAmount}</span>
                                  <i class="fa fa-users"></i>
                              </a>
                            </span>

                            <span class="chat-menu-right">
                              <a href="javascript:void(0)">&nbsp;</a>
                          </span>

                          <span class="chat-menu-right">
                            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                                <span class="show-number-messages">${data.groupChat.mesaggeAmount}</span>
                                <i class="fa fa-comment-o"></i>
                            </a>
                          </span>
                            </div>
                            <div class="content-chat">
                                <div class="chat" data-chat="${data.groupChat._id}">

                                </div>
                            </div>
                            <div class="write" data-chat="${data.groupChat._id}">
                                  <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                                  <div class="icons">
                                      <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                                      <label for="image-chat-${data.groupChat._id}">
                                          <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                                          <i class="fa fa-photo"></i>
                                      </label>
                                      <label for="attach-chat">
                                          <input type="file" id="attach-chat" name="my-attach-chat" class="attach-chat"
                                              data-chat="${data.groupChat._id}">
                                          <i class="fa fa-paperclip"></i>
                                      </label>
                                      <a href="javascript:void(0)" id="video-chat-group">
                                          <i class="fa fa-video-camera"></i>
                                      </a>
                                  </div>
                            </div>
                        </div>

            `;
    $("#screen-chat").prepend(rightSide);
    //step4: call fuction change screen chat
    changeScreenChat();
    //step05: handle image modal
    let imageModal = `
                          <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
                          <div class="modal-dialog modal-lg">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                                      <h4 class="modal-title">Những Hình Ảnh Trong Cuộc Trò Chuyện. </h4>
                                  </div>
                                  <div class="modal-body">
                                      <div class="all-images" style="visibility: hidden;">
                                      </div>
                                  </div>
                              </div>
                          </div>
                        </div>
            `;
    $("body").append(imageModal);
    //step06: call function
    gridPhotos(5);

    //step7 : handle attachmentModal
    let attachmentModal = `
            <div class="modal fade" id="attachsModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Những Tệp Đính Kèm Trong Cuộc Trò Chuyện<%=conversation._id%> </h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachs">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
            `;
    $("body").append(attachmentModal);

    //step8 :emit new group created
    //step9 :
    socket.emit("member-recieved-group-chat",{
      groupChatId : data.groupChat._id
    })
  });
});
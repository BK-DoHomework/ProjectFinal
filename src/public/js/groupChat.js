
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
        console.log(data.groupChat);
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

});
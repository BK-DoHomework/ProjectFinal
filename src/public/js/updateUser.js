let userAvatar = null;

let userInfo = {};

let originAvartarSrc = null;

function updateUserInfo() {
  $('#input-change-avatar').bind("change", function () {
    let fileData = $('#input-change-avatar').prop("files")[0];

    let math = ["image/png", "image/jpg", "image/jpeg"];
    //kiem tra du lieu anh
    let limit = 1048576; //byte=1MB

    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu dữ liệu không hợp lệ !, chỉ chấp nhận jpg và png !", "error", 7);
      $(this).val(null);
      return false;
    }


    if ($.inArray(fileData.size) > limit) {
      alertify.notify("Chỉ chấp nhận dạng dữ liệu dưới 1MB !", "error", 7);
      $(this).val(null);
      return false;
    }

    if (typeof (FileReader) != "undefined") {
      let imagePreview = $('#image-edit-profile');
      imagePreview.empty(); //làm trống cái class đó đi !

      let fileReader = new FileReader();

      fileReader.onload = function (element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }

      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;


    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ file Reader !", "error", 7);
    }

  })
  $('#input-change-user-name').bind("change", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    userInfo.username = $(this).val();

  });
  $('#input-change-user-gender-male').bind("click", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    userInfo.gender = $(this).val();

  });
  $('#input-change-user-gender-female').bind("click", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    userInfo.gender = $(this).val();

  });

  $('#input-change-user-address').bind("change", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    userInfo.address = $(this).val();

  });

  $('#input-change-user-phone').bind("change", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    userInfo.phone = $(this).val();

  });
}

$(document).ready(function () {
  updateUserInfo();

  originAvartarSrc = $("#user-modal-avatar").attr("src");

  $('#input-btn-update-user').bind("click", function () {


    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn phải thay dổi thông tin trước khi cập nhập dữ liệu !", "error", 7);
      return false;
    }

    //gọi 1 cái đối tượng ajax lên để thay đối dữ liệu lên server ==>
    $.ajax({
      url:"/user/update-avatar",
      type: "put",
      cache:false,
      contentType:false,
      processData: false,
      data:userAvatar,
      success: function(result){
        console.log(result)
        //diplay success
        $('.user-modal-alert-success').find("span").text(result.message);
        $('.user-modal-alert-success').css("display","block");
        //update navbar avatar
        $('#navbar-avatar').attr("src",result.imageSrc);
        //update origin avatar src
        originAvartarSrc=result.imageSrc;
         //khi co loi thi phai reset all
         $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay


      },
      error: function(error){
        //diplay erros
        console.log(error);
        $('.user-modal-alert-error').find("span").text(error.responseText);
        $('.user-modal-alert-error').css("display","block");
        //ghi de

        //khi co loi thi phai reset all
        $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay

      }

    })

  });

  $("#input-btn-cancel-update-user").bind("click", function () {
    //set lại các giá trị chứ không phải khai báo lại cái giá trị
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvartarSrc);


  })

});
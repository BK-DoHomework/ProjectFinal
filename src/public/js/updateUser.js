let userAvatar = null;

let userInfo = {};

let originAvartarSrc = null;

let originUserInfo = {};

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
    let username = $(this).val();
    let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
    if (!regexUsername.test(username) || username.length < 3 || username > 17) {

      alertify.notify("User name phải giới hạn trong khoảng 12-17 kí tự, và không có kí tự đặc biệt  !", "error", 7);

      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;

    }
    userInfo.username = username;

  });
  $('#input-change-user-gender-male').bind("click", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change

    let gender = $(this).val()
    if (gender !== "male") {

      alertify.notify("Opps!Trường giới tính đang có vấn đề  !", "error", 7);

      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;

    }
    userInfo.gender = gender;

  });
  $('#input-change-user-gender-female').bind("click", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    let gender = $(this).val()
    if (gender !== "female") {

      alertify.notify("Opps!Trường giới tính đang có vấn đề  !", "error", 7);

      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;

    }
    userInfo.gender = gender;

  });

  $('#input-change-user-address').bind("change", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    let address = $(this).val()
    if (address.length < 3 || address.length > 30) {
      alertify.notify("Giới hạn địa chỉ trong khoảng 3-30 kí tự !", "error", 7);

      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;


    }
    userInfo.address = address;

  });

  $('#input-change-user-phone').bind("change", function () { // sau khi nguoi dung go lai cac truong thi no se goi dan su kien change
    let phone = $(this).val()
    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");
    if (!regexPhone.test(phone)) {
      alertify.notify("Số điện thoại việt nam bắt đầu từ số 0, và giớ hạn là 11 chữ số  !", "error", 7);

      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;

    }

    userInfo.phone = phone;

  });
}

function callUpdateUserAvartar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      console.log(result)
      //diplay success
      $('.user-modal-alert-success').find("span").text(result.message);
      $('.user-modal-alert-success').css("display", "block");
      //update navbar avatar
      $('#navbar-avatar').attr("src", result.imageSrc);
      //update origin avatar src
      originAvartarSrc = result.imageSrc;
      //khi co loi thi phai reset all
      $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay


    },
    error: function (error) {
      //diplay erros
      console.log(error);
      $('.user-modal-alert-error').find("span").text(error.responseText);
      $('.user-modal-alert-error').css("display", "block");
      //ghi de

      //khi co loi thi phai reset all
      $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay

    }

  });


};


function callUpdateUserInfo() {

  $.ajax({
    url: "/user/update-info",
    type: "put",

    data: userInfo,
    success: function (result) {
      console.log(result)
      //diplay success
      $('.user-modal-alert-success').find("span").text(result.message);
      $('.user-modal-alert-success').css("display", "block");

      originUserInfo = Object.assign(originUserInfo, userInfo); //==> nó sẽ ghi đè những cái dữ liệu mới nếu như userInfo có ,update

      //update user name navbar
      $('#navbar-username').text(originUserInfo.username);

      //khi co loi thi phai reset all
      $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay


    },
    error: function (error) {
      //diplay erros
      console.log(error);
      $('.user-modal-alert-error').find("span").text(error.responseText);
      $('.user-modal-alert-error').css("display", "block");
      //ghi de

      //khi co loi thi phai reset all
      $("#input-btn-cancel-update-user").click();//tu dong click vao cai nut nay

    }

  });

};

$(document).ready(function () {


  originAvartarSrc = $("#user-modal-avatar").attr("src");

  originUserInfo = {
    username: $('#input-change-user-name').val(),
    gender: ($('#input-change-user-gender-male').is(":checked")) ? $('#input-change-user-gender-male').val() : $('#input-change-user-gender-female').val(),
    address: $('#input-change-user-address').val(),
    phone: $('#input-change-user-phone').val()


  }
  //update user info after change field
  updateUserInfo();

  $('#input-btn-update-user').bind("click", function () {


    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn phải thay dổi thông tin trước khi cập nhập dữ liệu !", "error", 7);
      return false;
    }

    //gọi 1 cái đối tượng ajax lên để thay đối dữ liệu avatar lên server ==>

    //kiểm tra dữ liệu có thay đổi thì mới cho nó update

    if (userAvatar) {
      callUpdateUserAvartar();
    }

    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }


  });

  $("#input-btn-cancel-update-user").bind("click", function () {
    //set lại các giá trị chứ không phải khai báo lại cái giá trị
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvartarSrc);

    //cac truong khac
    $('#input-change-user-name').val(originUserInfo.username);
    (originUserInfo.gender == "male") ? $('#input-change-user-gender-male').click() : $('#input-change-user-gender-female').click(),
      $('#input-change-user-address').val(originUserInfo.address);
    $('#input-change-user-phone').val(originUserInfo.phone);


  })

});
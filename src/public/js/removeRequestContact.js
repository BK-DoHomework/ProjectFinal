


function removeRequestContact() {

  $(".user-remove-request-contact").bind("click", function () {
    let targetId = $(this).data("uid");//data-uid
    console.log(targetId);

    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if(data.success){
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide(); //tim den cai no do va an di :v
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display','inline-block') //tim den cai no do va an di :v
          //xu li realtime
          gecreaseNumberNotisContact("count-request-contact-sent");
        }
      }

    })
  })

}
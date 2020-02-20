

function addContact(){
  $(".user-add-new-contact").bind("click",function(){
    let targetId =$(this).data("uid");//data-uid
    console.log(targetId);

    $.post("/contact/add-new",{uid:targetId}, function(data){
      if(data.success){
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide(); //tim den cai no do va an di :v
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css('display','inline-block') //tim den cai no do va an di :v

        increaseNumberNotisContact("count-request-contact-sent")

        socket.emit("add-new-contact",{contactId:targetId})  //ten sk /ts
 
      }
    })
  })
}
//io params form socket.io
let addNewContact =(io)=>{
  io.on("connection",(socket)=>{    //lang nghe su kien connection(danh cho nguoi dung khi truy cap vao trang web cua minh)
    socket.on("add-new-contact",(data)=>{  //lang nghe sk tu clien voi ten ...va gia tri keo len ...
      console.log(data);

    })
  })

}

module.exports= addNewContact; 
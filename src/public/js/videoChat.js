function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("clcik").on("click", function () {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();
    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }
    // console.log(dataToEmit);
    //step1 : kiem tra nguoi nghe online hay offline

    socket.emit("caller-check-listener-online-or-not", dataToEmit);

  })
};
$(document).ready(function () {
  //step2 :
  socket.on("server-send-listener-is-offline", function () {
    alertify.notify("người dùng này hiện không trực tuyến, vui lòng gọi lại sau !", "error", 7);
  });
  let getPeerId = "";
  const peer = new Peer();
  // console.log(peer);
  peer.on("open", function (peerId) {
    getPeerId = peerId;
  });
  //step3 :
  socket.on("server-request-peer-id-of-listener", function (response) {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId,
    }
    //step 04 :
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });
  //step5: caller
  socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    }
    //step 06 :
    socket.emit("caller-request-call-to-server", dataToEmit);
    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color : #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian : <strong></strong> giây . <br/><br/>
        <button id="btn-cancel-call" type="button" class="btn btn-danger">
        Hủy Cuộc Gọi
      </button>
      `,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          //step 07:
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000)
      },
      // server-send-reject-call-to-caller
      onOpen: () => {
        //step 12 :
        socket.on("server-send-reject-call-to-caller", function (response) {
          Swal.close();
          clearInterval(timerInterval);
          Swal.fire({
            type: "info",
            title: `${response.listenerName}</span> &nbsp; đang bận `,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: 'Xác nhận!',
          })
        })

        //step 13:
        socket.on("server-send-accept-call-to-caller", function (response) {
          Swal.close();
          clearInterval(timerInterval);
          console.log("caller okay !");

        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    })
  });

  //step 08:listener
  // server-send-request-call-to-listener
  socket.on("server-send-request-call-to-listener", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    }
    let timerInterval;
    Swal.fire({
      title: `<span style="color : #2ECC71;">${response.callerName} đang gọi</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian : <strong></strong> giây . <br/><br/>
        <button id="btn-reject-call" type="button" class="btn btn-danger">
        Từ Chối
      </button>
      <button id="btn-accept-call" type="button" class="btn btn-success">
      Chấp nhận
    </button>
      `,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          //step10 :
          socket.emit("listener-reject-request-call-to-server", dataToEmit);

        });

        $("#btn-accept-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          //step11 :
          socket.emit("listener-accept-request-call-to-server", dataToEmit);

        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000)
      },
      onOpen: () => {
        //step9 :
        socket.on("server-send-cancel-request-call-to-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
        });
        //step 13:
        socket.on("server-send-accept-call-to-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
          console.log("listener okay !");

        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    })
  })
});
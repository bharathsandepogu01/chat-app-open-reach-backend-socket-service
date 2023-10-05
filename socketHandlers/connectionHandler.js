const connectionHandler = (io, socket) => {
  let userEmail = socket.handshake.auth.email;

  if (!userEmail) return;

  socket.join(userEmail);

  socket.on("disconnect", async (reason) => {
    const matchingSockets = await io.in(userEmail).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      console.log("user disconnected", userEmail);
    }
  });
};

module.exports = connectionHandler;

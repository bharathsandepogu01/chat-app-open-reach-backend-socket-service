const messageHandler = (io, socket) => {
  socket.on("privateMessage", async (message, callback) => {
    try {
      callback(null, "received message to server");
      console.log(message.from, message.to);
      socket.to(message.to).emit("privateMessage", message);
    } catch (error) {
      callback(error, null);
    }
  });
};

module.exports = messageHandler;

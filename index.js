const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");

// this will called for all uncaught exception errors for sync process
// always should be top in order to catch all uncaught error in code base
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception error occurred, shutting down...");
  process.exit(1);
});

const messageHandler = require("./socketHandlers/messageHandler");
const connectionHandler = require("./socketHandlers/connectionHandler");

dotenv.config({ path: path.relative(__dirname, ".env") });

const PORT = process.env.PORT;

const app = express();

app.use(cors());

const server = http.createServer(app);

// sockets server engine.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ROOT_URL,
  },
});

io.on("connection", (socket) => {
  messageHandler(io, socket);
  connectionHandler(io, socket);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

server.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});

// this will be called for all unhandled rejection errors for async process
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection error occurred, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

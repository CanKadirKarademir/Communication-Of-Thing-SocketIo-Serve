require("dotenv/config");
const Express = require("express")();
const Http = require("http").Server(Express);
const TransactionsFactory = require("./database/transactionFactory");
const deviceTransaction = TransactionsFactory.creating("deviceTransactions");
const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

Socketio.on("connection", (socket) => {
  socket.on("getDeviceState", async (secretKey) => {
    try {
      const device = await deviceTransaction.findOneAsync({
        DeviceSecret: secretKey,
      });
      Socketio.sockets.emit(
        "getDeviceState",
        device ? device.DeviceStatus : null
      );
    } catch (err) {
      Socketio.sockets.emit("getDeviceState", null);
    }
  });

  socket.on("setToggleDeviceState", async (secretKey) => {
    try {
      await deviceTransaction.toggleDeviceStateAsync(secretKey);
      const device = await deviceTransaction.findOneAsync({
        DeviceSecret: secretKey,
      });
      Socketio.sockets.emit(
        "getDeviceState",
        device ? device.DeviceStatus : null
      );
    } catch (err) {
      Socketio.sockets.emit("getDeviceState", null);
    }
  });
});

Http.listen(PORT, () => {
  console.log("Ready on http://localhost:" + PORT);
});

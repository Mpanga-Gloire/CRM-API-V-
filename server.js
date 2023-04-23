const express = require("express");
const app = express();
const serverConfig = require("./configs/server.config");
const dbConfig = require("./configs/db.configs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbConfig.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDb");
});

db.on("error", () => {
  console.log("Error connectimg to MongoDb");
  process.exit();
});

//routers
require("./routers/auth.route")(app);
require("./routers/user.route")(app);
require("./routers/ticket.route")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});

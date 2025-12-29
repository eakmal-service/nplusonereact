const app = require("express");
const http = require("http").Server(app);
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://nplusone9:rS6KrOilBwNbMoPx@test-pro-db.yb9seeb.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db");

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});


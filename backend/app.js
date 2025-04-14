require("dotenv").config();
const mongoose = require("mongoose");
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require("cors");
const connectToSocket = require("./controllers/socketmanger");
const userrouter = require("./routes/userroute");

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
// const io = new Server(server);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true})) ;
app.use("/api/auth",userrouter);    

const port  =  process.env.PORT;
const url = process.env.MONGO_URL;

server.listen(port, () => {
  console.log('server running at http://localhost:8000');
  mongoose.connect(url);
  console.log("connected to db");
});


import "dotenv/config.js";
import mongoose, { Mongoose } from "mongoose";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ProjectModel from "./models/project.model.js";
import { generateContent } from "./services/ai.service.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.authorization?.split(" ")[1];
    const projectId = socket.handshake.query?.projectId;

    

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      
      return next(new Error("Invalid ID"));
    }

    socket.project = await ProjectModel.findById(projectId);
    

    if (!token) {
      console.error("Middleware: No token provided");
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    if (!decoded) {
      console.error("Middleware: Invalid");
    }

    socket.user = decoded;
    next();
  } catch {}
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString()
  console.log("User connected");
  socket.join(socket.roomId);

  socket.on("project-msg", async (data) => {

    const message = data.message
    
    const isAiPresent = message.toLowerCase().includes("@ai")

    if(isAiPresent){

      const promt  = message.replace('@ai', '')
      const result = await generateContent(promt)

      socket.broadcast.to(socket.roomId).emit("project-msg", data);
      io.to(socket.roomId).emit("project-msg", {message: result,
        sender:{
          _id:'ai',
          email : 'AI'
        }
      })
      console.log("ai given")
      return 
    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.leave(socket.roomId);
  })
});

server.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

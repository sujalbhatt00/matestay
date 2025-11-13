import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const startServer = async () => {
  try {
    await connectDB();
    
    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/conversations", conversationRoutes);
    app.use("/api/messages", messageRoutes);
    app.use("/api/properties", propertyRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/reviews", reviewRoutes);

    app.get("/", (req, res) => {
      res.send("Matestay API is running...");
    });

    // ✅ FIX: Improved Socket.IO handling
    const userSocketMap = new Map();

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // Register user with their socket ID
      socket.on("addUser", (userId) => {
        if (userId) {
          userSocketMap.set(userId, socket.id);
          console.log(`✅ User ${userId} registered with socket ${socket.id}`);
          
          // Emit online users list
          const onlineUsers = Array.from(userSocketMap.entries()).map(([userId, socketId]) => ({
            userId,
            socketId
          }));
          io.emit("getUsers", onlineUsers);
        }
      });

      // ✅ FIX: Better message sending logic
      socket.on("sendMessage", (message) => {
        console.log("📨 Received message to send:", message);
        
        const receiverSocketId = userSocketMap.get(message.receiverId);
        const senderSocketId = userSocketMap.get(message.senderId);
        
        if (receiverSocketId) {
          console.log(`✅ Sending message to receiver ${message.receiverId} via socket ${receiverSocketId}`);
          io.to(receiverSocketId).emit("getMessage", message);
          io.to(receiverSocketId).emit("receiveMessage", message);
        } else {
          console.log(`⚠️ Receiver ${message.receiverId} is not online`);
        }

        // Also emit back to sender for confirmation (optional)
        if (senderSocketId && senderSocketId !== receiverSocketId) {
          io.to(senderSocketId).emit("messageSent", message);
        }
      });

      socket.on("typing", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("userTyping", { userId });
      });

      socket.on("stopTyping", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("userStoppedTyping", { userId });
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
        
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            console.log(`❌ User ${userId} removed from online users`);
            
            // Emit updated online users list
            const onlineUsers = Array.from(userSocketMap.entries()).map(([userId, socketId]) => ({
              userId,
              socketId
            }));
            io.emit("getUsers", onlineUsers);
            break;
          }
        }
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { io };
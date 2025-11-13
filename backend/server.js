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

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB BEFORE starting server
const startServer = async () => {
  try {
    await connectDB();
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/conversations", conversationRoutes);
    app.use("/api/messages", messageRoutes);
    app.use("/api/properties", propertyRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/reviews", reviewRoutes);

    // Health check
    app.get("/", (req, res) => {
      res.send("Matestay API is running...");
    });

    // Socket.IO connection handling
    const userSocketMap = new Map();

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on("sendMessage", (message) => {
        const receiverSocketId = userSocketMap.get(message.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }
      });

      socket.on("typing", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("userTyping", { userId });
      });

      socket.on("stopTyping", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("userStoppedTyping", { userId });
      });

      socket.on("disconnect", () => {
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });

    // Start server
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
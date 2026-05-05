import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import sanitizeRequest from "./middleware/sanitizeRequest.js";
import errorHandler from "./middleware/errorHandler.js";
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

// ============ SECURITY MIDDLEWARE ============

// 1. Helmet - Set HTTP response headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
    },
  },
  frameguard: { action: "DENY" },
  noSniff: true,
  xssFilter: true,
}));

// 2. CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 3. Body Parser with security limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Data Sanitization - Prevent NoSQL Injection
// NOTE: Express 5 makes req.query a read-only getter, so some sanitizers that do `req.query = ...`
// will crash. This middleware mutates objects in-place.
app.use(sanitizeRequest({
  replaceWith: "_",
  onSanitize: ({ key }) => {
    console.warn(`⚠️ Suspicious input sanitized in ${key}`);
  },
}));

// 5. Global Rate Limiter - Basic protection for all requests
app.use(generalLimiter);

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

    // 6. Global Error Handler - Must be last middleware
    app.use(errorHandler);

    const userSocketMap = new Map();

    io.on("connection", (socket) => {
      console.log(" User connected:", socket.id);

    
      socket.on("addUser", (userId) => {
        if (userId) {
          userSocketMap.set(userId, socket.id);
          console.log(` User ${userId} registered with socket ${socket.id}`);
          
          
          const onlineUsers = Array.from(userSocketMap.entries()).map(([userId, socketId]) => ({
            userId,
            socketId
          }));
          io.emit("getUsers", onlineUsers);
        }
      });

      
      socket.on("sendMessage", (message) => {
        console.log(" Received message to send:", message);
        
        const receiverSocketId = userSocketMap.get(message.receiverId);
        const senderSocketId = userSocketMap.get(message.senderId);
        
        if (receiverSocketId) {
          console.log(` Sending message to receiver ${message.receiverId} via socket ${receiverSocketId}`);
          io.to(receiverSocketId).emit("getMessage", message);
          io.to(receiverSocketId).emit("receiveMessage", message);
        } else {
          console.log(` Receiver ${message.receiverId} is not online`);
        }

      
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
        console.log(" User disconnected:", socket.id);
        
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            console.log(` User ${userId} removed from online users`);
            
          
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
      console.log(` Server running on port ${PORT}`);
      console.log(` Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { io };
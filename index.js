//config
require("dotenv").config();
require("express-async-errors");

//security
const helmet = require("helmet");
const xssclean = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");

//app
const express = require("express");
const connectDB = require("./db/connectdb");
const fileUpload = require("express-fileupload");
const path = require("path");

//middlewares
const errorHandler = require("./middlewares/error-handler");
const authentication = require("./middlewares/authentication");
const routeNotFound = require("./middlewares/route-not-found");

//routers/routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { Server } = require("socket.io");
const logger = require("./middlewares/logger");
const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 120,
  })
);
app.use(express.json());
app.use(
  fileUpload({
    // debug: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "./tmp"),
  })
);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "example.com"],
      "img-src": ["'self'", "https: data:"],
    },
  })
);
app.use(xssclean());

if (process.env.NODE_ENV === "production") {
  app.use(logger);
  app.use("/", express.static("./client/build"));
} else {
  app.use(cors());
}

app.get("/api/v1", (req, res) => {
  res.send("Chatverse server ver. 1.0.1");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authentication, userRoutes);
app.use("/api/v1/chats", authentication, chatRoutes);
app.use("/api/v1/messages", authentication, messageRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.redirect("/");
  });
}

app.use(routeNotFound);

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = app.listen(port, () => {
      console.log("Server listening on port:" + port);
    });

    const io = new Server(server, {
      pingTimout: 60000,
      cors: {
        origin: process.env.NODE_ENV === "production" ? "/" : "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        socket.emit("connected");
      });

      socket.on("typing", (room, username) =>
        socket.to(room).emit("typing", room, username)
      );
      socket.on("stop typing", (room) =>
        socket.to(room).emit("stop typing", room)
      );

      socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat.users) {
          console.log("chat.users not defined");
          return;
        }

        chat.users.forEach((user) => {
          if (user._id === newMessageRecieved.sender._id) return;

          socket.to(user._id).emit("message received", newMessageRecieved);
        });
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  } catch (error) {
    console.log("???? ~ file: index.js:81 ~ startServer ~ error", error);
  }
};

startServer();

//cors
const cors = require("cors");
var path = require("path");
// Importing express module
const express = require("express");

// Importing express-session module
const session = require("express-session");

// Importing file-store module
const filestore = require("session-file-store")(session);

const mongoose = require("mongoose");

var app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
// Creating session
//session.cookie.secure should be true for htttps onlhy
app.use(
  session({
    name: "session-id",
    secret: "GFGEnter", // Secret key,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: false,
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    store: new filestore(),
  })
);

require("dotenv").config();
const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDB done vro");
});

function auth(req, res, next) {
  console.log(req.sessionID);
  if (!req.session.auth) {
    console.log("not auth");
    next();
  } else {
    console.log("auth");
    console.log(req.session);
    next();
  }
}

app.use(auth);

const usersRouter = require("./routes/user_router");
app.use("/users", usersRouter);

app.listen(80, () => {
  console.log("Server is Starting");
});

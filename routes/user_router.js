const router = require("express").Router();
let User = require("../models/user_model");
const sendSms = require("../aws-sns/aws.js");

router.route("/add").post((req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const number = req.body.number;
  const verified = false;

  const newUser = new User({
    username,
    password,
    number,
    verified,
  }); //new instance of User

  newUser
    .save() //saved to data base
    .then(() => res.json("User added!")) //respond user added
    .catch((err) => res.status(400).json("Error: " + err)); //error
});
router.route("/log").post((req, res) => {
  User.findOne({ username: req.body.username }) //finds??
    .then((user) => {
      user.isValidPassword(req.body.password).then((e) => {
        req.session.auth = e;
        if (e) {
          console.log("authed");
          req.session.username = req.body.username;
        } else {
          req.session.username = null;
          console.log("unauthed or remained unauth");
        }
        res.send(e);
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/otp_gen").post((req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      req.session.otp = Math.floor(Math.random() * 9000 + 1000);
      //send otp with magic😎
      sendSms(req.session.otp, user.number);
    })
    .catch((err) => res.status(40).json("Error: " + err));
});
router.route("/verify").post((req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (req.body.otp == req.session.otp) {
        user.verified = true;

        user
          .save()
          .then(() => res.json("user verified"))
          .catch((err) => res.status(400).json("Error: " + err));
      }
    })
    .catch((err) => res.status(40).json("Error: " + err));
});

module.exports = router;

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((findEmail) => {
    if (findEmail) {
      return res.json({ error: "Email is already registered" });
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) throw err;
        const newUser = new User({
          email,
          password: hashedPassword,
        });
        newUser
          .save()
          .then((user) => {
            jwt.sign({ _id: user._id }, "secret", (err, token) => {
              if (err) return res.json({ err });
              res.cookie("jwt", token, {
                maxAge: 7 * 24 * 50,
                httpOnly: true,
              });
              return res.json({
                user: {
                  email: user.email,
                  _id: user._id,
                },
              });
            });
          })
          .catch((err) => console.log(err));
      });
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          jwt.sign({ _id: user._id }, "secret", (err, token) => {
            if (err) return res.json({ error });
            res.cookie("jwt", token, {
              maxAge: 9000000,
              httpOnly: true,
            });
            return res.json({
              user: {
                email: user.email,
                _id: user._id,
              },
            });
          });
        } else {
          return res.json({ error: "Invalid Credentials" });
        }
      });
    }
  });
});

router.get("/check_auth", (req, res) => {
  res.json(req.cookies.jwt);
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.send("Logged out");
});

module.exports = router;

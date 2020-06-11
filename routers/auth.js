const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const bcrypt = require('bcrypt');
const router = new Router();
const User = require("../models").user;

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Please supply a valid email and password");
    } else {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(400).send({
          message: "User with that id does not exist",
        });
      } else if (bcrypt.compareSync(password, user.password)) {
        const jwt = toJWT({ userId: user.id });
        res.send({
          jwt,
        });
      } else {
        res.statut(400).send({
          message: "Password was incorrect",
        });
      }
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

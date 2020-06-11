const express = require("express");
const { Router } = express;
const Image = require("../models").image;
const { toData } = require("../auth/jwt");

const router = new Router();

router.get("/auth/messy", async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
    } catch (e) {
      res.status(400).send("Inavlid JWT token");
    }
    const images = await Image.findAll();
    res.json(images);
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials",
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { title, url } = req.body;
    if (!title || !url) {
      res.status(400).send("Missing parameters to create image");
    } else {
      const newImage = await Image.create({ title, url });
      res.send(newImage);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/", (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;

  Image.findAndCountAll({ limit, offset })
    .then((result) => res.send({ images: result.rows, total: result.count }))
    .catch((error) => next(error));
});

module.exports = router;

const express = require("express");
const { Router } = express;
const Image = require("../models").image;
// const { toData } = require("../auth/jwt");
const authMiddleware = require('../auth/middleware');

const router = new Router();

router.get("/auth/messy", authMiddleware, async (req, res, next) => {
  try {
    const allImages = await Image.findAll();
    res.json(allImages);
  } catch (e) {
    next(e);
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

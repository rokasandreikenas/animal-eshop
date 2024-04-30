const { ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();

const router = express.Router();
const client = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const data = await client
      .db("demo1")
      .collection("coolPets")
      .find()
      .toArray();
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await client
      .db("demo1")
      .collection("coolPets")
      .aggregate([
        {
          $lookup: {
            from: "people",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newPet = {
      ...req.body,
      ownerId: new ObjectId(`${req.body.ownerId}`),
    };
    const dbRes = await client
      .db("demo1")
      .collection("coolPets")
      .insertOne(newPet);
    res.send(dbRes);
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await client
      .db("demo1")
      .collection("coolPets")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;

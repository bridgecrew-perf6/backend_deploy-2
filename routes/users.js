const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const middleware = require("../middleware");
const { mongoose } = require("mongoose");

console.log("Inside users.js");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      console.log("internal error");
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//get a user
router.get("/getData", middleware.checkToken, async (req, res) => {
  User.findOne({ _id: req.decoded.id }, (err, result) => {
    if (err) return res.json({ err: err });
    if (result == null) return res.json({ data: [] });
    else return res.json({ data: result });
  });
})

//get a specific user
router.get("/:id", middleware.checkToken, async (req, res) => {
  await User.findOne({ _id: req.params.id }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
})

//edit profile

router.patch("/update", middleware.checkToken, async (req, res) => {
  let profile = {};
  await User.findOne({ _id: req.decoded.id }, (err, result) => {
    if (err) {
      profile = {};
    }
    if (result != null) {
      profile = result;
    }
  });
  User.findOneAndUpdate(
    { _id: req.decoded.id },
    {
      $set: {
        sem: req.body.sem ? req.body.sem : profile.sem,
        from: req.body.from ? req.body.from : profile.from,
        desc: req.body.desc ? req.body.desc : profile.desc,
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json({ err: err });
      if (result == null) return res.json({ data: [] });
      else return res.json({ data: result });
    }
  );
});

//add a user

router.post("/add/profile", middleware.checkToken, async (req, res) => {
  console.log('inside add/profile section');
  await User.findOneAndUpdate(
    { _id: req.decoded.id },
    {
      $set: {
        sem: req.body.sem,
        from: req.body.from,
        desc: req.body.desc
      },
    },
    { new: true },
    (err, profile) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "profile successfully stored",
        data: profile,
      };
      return res.status(200).send(response);
    }
  );
})


//delete user

router.delete("/:id", middleware.checkToken, async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// getting a specific user profile
router.get("/getSpecificUserProfile/:id", middleware.checkToken, async (req, res) => {
  console.log("we are inside getspecific profile function.")
  await User.findOne({ _id: req.params.id }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
})

module.exports = router;
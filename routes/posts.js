const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");
const middleware = require("../middleware");

console.log("inside posts page");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, req.params.id + ".jpg");
    },
  });
  
  
  const upload = multer({ storage: storage });
  
  router.patch("/add/img/:id", middleware.checkToken, upload.single("file"), async(req, res) => {
    console.log("iside add image func");
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: profile,
        };
        return res.status(200).send(response);
      } 
    );
    // console.log(req.decoded);
    console.log(req.decoded.id);
  });

//get own post
router.get("/getOwnPost",middleware.checkToken, async(req, res) => {
  Post.find({ userId: req.decoded.id }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.get("/getOtherPost",middleware.checkToken, async(req, res) => {
  Post.find({ userId: { $ne: req.decoded.id } }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
    console.log("inside fetch other post: ",result);
  });
});


router.delete("/delete/:id",middleware.checkToken, async(req, res) => {
  Post.findOneAndDelete(
    {
      $and: [{ userId: req.decoded.id }, { _id: req.params.id }],
    },
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        // console.log(result);
        return res.json("Post deleted");
      }
      return res.json("Post not deleted");
    }
  );
});


//create a post
router.post("/",middleware.checkToken, async (req, res) => {
  const newPost = new Post({
      userId: req.decoded.id,
      desc: req.body.desc,
      img: req.body.img,
    });
    newPost
    .save()
    .then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

router.post("/noOfAnswers",middleware.checkToken, async (req, res) => {
  Post.findByIdAndUpdate(req.body.postId,{
      $push:{noOfanswers:req.decoded.id}
  },{
      new:true,
  }).exec((err,result)=>{
      if(err)
      {
          return res.status(422).json({error:err})
      }
      else
      {
          res.json(result);
      }
  })
});


router.put("/upvotes",middleware.checkToken, async (req, res) => {
  Post.findByIdAndUpdate(req.body.postId,{
      $push:{likes:req.decoded.id}
  },{
      new:true,
  }).exec((err,result)=>{
      if(err)
      {
          return res.status(422).json({error:err})
      }
      else
      {
          res.json(result);
      }
  })
});

router.put("/downvotes",middleware.checkToken, async (req, res) => {
Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.decoded.id}
},{
    new:true,
}).exec((err,result)=>{
    if(err)
    {
        return res.status(422).json({error:err})
    }
    else
    {
        res.json(result);
    }
})
});



module.exports = router;
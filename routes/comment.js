const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const comment = require("../models/comment");
const multer = require("multer");
const middleware = require("../middleware");

console.log("inside comment route");

router.get("/getComments/:id",middleware.checkToken, async(req, res) => {
  comment.find({ postId: req.params.id }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});


//give comment
router.post("/",middleware.checkToken, async (req, res) => {
  console.log("inside creating comment");
  console.log(req.user.profilePicture);
  const newComment = new comment({
    content: req.body.content,
    userName: req.user.username,
    postUserId: req.decoded.id,
    userpic: req.user.profilePicture,
    postId: req.body._id
    });
    newComment
    .save()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
    
});

router.put("/upvotes",middleware.checkToken, async (req, res) => {
    comment.findByIdAndUpdate(req.body.commentId,{
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
  comment.findByIdAndUpdate(req.body.commentId,{
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
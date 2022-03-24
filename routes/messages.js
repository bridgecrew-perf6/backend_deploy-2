const router = require("express").Router();
const middleware = require("../middleware");
const Message = require("../models/message");

//add
router.post("/",middleware.checkToken, async(req,res) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        sender: req.decoded.id,
        text: req.body.text,
        });
   try{
       const savedMessage = await newMessage.save();
       res.status(200).json(savedMessage);
   }catch(err){
       res.status(500).json(err);
   } 
});

//get
router.get("/:conversationId",middleware.checkToken, async(req,res) => {
    try{
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json(err);
    } 
 });


module.exports = router;

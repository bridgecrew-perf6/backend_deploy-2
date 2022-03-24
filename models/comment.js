const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
      },
      tag: Object,
      reply: mongoose.Types.ObjectId,
      likes: [{
        type: String,
      }],
      dislikes: [{
        type: String,
      }],
      userName: { type: String, required: true },
      postUserId: {
        type: String,
        required: true,
      },
      postId:{
          type: String,
          required: true,
      },
      userpic:{
        type: String,
        default: "",
      },
},
{ timestamps: true })

module.exports = mongoose.model('comment', commentSchema)

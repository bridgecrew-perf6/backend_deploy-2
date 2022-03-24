const express = require("express"); //acquiring express
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan"); // acquiring all the things...
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comment")
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const User = require("./models/user")
const middleware = require("./middleware");


dotenv.config(); // configuring the env

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// It's Stuff time...
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.id + ".jpg");
  },
});


const upload = multer({ storage: storage });

app.patch("/api/upload", middleware.checkToken, upload.single("file"), async(req, res) => {
  console.log("inside add image func");
  await User.findOneAndUpdate(
    { _id: req.decoded.id },
    {
      $set: {
        profilePicture: req.file.path,
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



app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);



app.listen(8800, () => console.log("Backend Running!! "));
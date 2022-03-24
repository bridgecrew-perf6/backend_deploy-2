const mongoose=require("mongoose")


const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:4,
        max:20,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        min:8,
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    followings:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    desc:{
       default: "",
       type:String,
       max:100
    },
    sem:{
        default: "",
        type:String,
        max:50
    },
    from:{
        default : "",
        type:String,
        max:50,
    },
    relationship:{
        type:Number,
        enum:[1,2,3,4,5,6,7,8],
    }
},
{timestamps:true}
);


module.exports=mongoose.model("User",UserSchema);
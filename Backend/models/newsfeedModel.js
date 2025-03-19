import mongoose from "mongoose";

const nfSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    keywords: {
        type: [String],
        default: [],
    },
    upvoteCount:{
        type:Number,
        required:true,
        default:0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    upvotedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
})

const nfPost =  mongoose.model("nfPost", nfSchema);

export default nfPost;
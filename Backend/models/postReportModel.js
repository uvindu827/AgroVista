import mongoose from "mongoose";

const postReportSchema = mongoose.Schema({
    postID:{
        type:String,
        required:true,
    },
    reason:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

const postReport = mongoose.model("postReport", postReportSchema);

export default postReport;
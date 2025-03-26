import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
    tname: {
        type: String, // data type
        required: true // validation
    },
    tprice: {
        type: Number, 
        required: true // validation
    },
    tdiscription: {
        type: String, 
        required: true // validation
    }
});

const tool = mongoose.model("tool", toolSchema);

export default tool;
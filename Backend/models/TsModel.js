import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  tname: {
    type: String,
    required: true,
  },
  tquantity: {
    type: Number,
    required: true,
  },
  tprice: {
    type: Number,
    required: true,
  },
  tbrand: {
    type: String,
    required: true,
  },
  tdescription: {
    type: String,
    required: true,
  },
});

const tool = mongoose.model("tool", toolSchema);
export default tool;

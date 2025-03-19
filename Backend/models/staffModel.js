import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        require:true,
        unique:true
    },

    phoneNumber:{
        type:String,
        require:true
    },

    address:{
        type:String,
        required:true
    },

    jobTitle:{
        type:String,
        required:true
    },

    basicSalary:{
        type:Number,
        required:true,
        min: [0, 'Basic salary cannot be negative']
    }
})

const staff = mongoose.model("staff", staffSchema);

export default staff;
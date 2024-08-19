import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    emailId: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
       
    }
}, { timestamps: true })

const User = mongoose.model('user', userSchema)

module.exports=User
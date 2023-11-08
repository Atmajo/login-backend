import mongoose from "mongoose";


const User = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: [true, "Email Exist"],
    },
    password: {
        type: String,
        require: true
    }
});
  
export default mongoose.model('User', User);
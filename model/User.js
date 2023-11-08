import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  email: {
    type: String,
    require: true,
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    require: true,
  },
});

export default mongoose.model("User", User);

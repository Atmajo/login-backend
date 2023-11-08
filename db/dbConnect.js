import mongoose from "mongoose";
import { config } from "dotenv";

async function dbConnect() {
  mongoose
    .connect(
      "mongodb+srv://ecommerce:boom1234@cluster0.wrhg7tc.mongodb.net/authDB?retryWrites=true&w=majority",
      {
        useNewUrlPArser: true
      }
    )
    .then(() => {
      console.log("Successfully connected !");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default dbConnect;

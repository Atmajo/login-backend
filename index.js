import express from "express";
import dbConnect from "./db/dbConnect.js";
import bcrypt from "bcrypt";
import User from "./model/User.js";
import jwt from "jsonwebtoken";
import auth from "./auth.js";
import cors from "cors";

const app = express();
const router = express.Router();

dbConnect();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// free endpoint
app.get("/free-endpoint", auth, (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            name: user.name,
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.post("/register", async (request, response) => {
  try {
    const { name, email, ...data } = request.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(404).json({ message: "USER_ALREADY_EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      ...data,
      name,
      email,
      password: hashedPassword,
    });
    console.log(name);
    await newUser.save();
    response.status(200).json({ message: "SIGNUP_SUCCESS" });
  } catch (err) {
    response.status(500).json({ message: err });
  }
});

app.listen(3020, () => {
  console.log("Successfully connected to port");
});

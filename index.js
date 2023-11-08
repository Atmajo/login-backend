import express from "express";
import dbConnect from "./db/dbConnect.js";
import bcrypt from "bcrypt";
import User from "./model/User.js";
import jwt from "jsonwebtoken";

const app = express();

dbConnect();

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

app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10).then((hashedPassword) => {
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
    });

    user
      .save()
      .then((result) => {
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
      .catch((error) => {
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      });
  });
});

app.listen(3020, () => {
  console.log("Successfully connected to port");
});

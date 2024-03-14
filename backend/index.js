import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { AllRepresentator, CurrentUser, login, register, voting } from "./controllers/user_controllers.js";
import { addRep } from "./controllers/admin_controllers.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
    res.send("working");
})
app.post("/register", register);
app.post("/login", login);
app.post('/currentUser',CurrentUser);
app.get("/voteList", AllRepresentator);
app.post('/voting', voting);

// admin part
app.post("/addRep", addRep);

mongoose.connect(process.env.mongo_URL).then(() => console.log("connected to mongoDB"));

app.listen(5000, () => {
    console.log("port listening on 5000")
})




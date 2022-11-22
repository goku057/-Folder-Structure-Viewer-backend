//setting up express app
import express from "express";
const app = express();

//importing  modules
import controller from "./controller";
const cors = require('cors');
require('dotenv').config();

//using middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", controller.getFolders);
app.post("/create", controller.createFolders);
app.post("/remove", controller.removeFolders);


const port : number | string = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server is hosted in localhost " + port);
});
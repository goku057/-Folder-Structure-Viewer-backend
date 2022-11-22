"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//setting up express app
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//importing  modules
const controller_1 = __importDefault(require("./controller"));
const cors = require('cors');
require('dotenv').config();
//using middlewares
app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", controller_1.default.getFolders);
app.post("/create", controller_1.default.createFolders);
app.post("/remove", controller_1.default.removeFolders);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server is hosted in localhost " + port);
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    try {
        results = yield prisma.folders.findMany();
    }
    catch (e) {
        console.log(e);
    }
    let root = {
        id: "root",
        folder_name: "root",
        folder_parent_id: undefined,
        descendents: [],
        isVisited: true
    };
    let data = [];
    data.push(root);
    results.map((r) => {
        let temp = {
            id: r.id,
            folder_name: r.folder_name,
            folder_parent_id: r.folder_parent_id,
            descendents: [],
            isVisited: true
        };
        data.push(temp);
    });
    // data.map( (e : Tree) => {
    //     // let temp: Tree[] = [];
    //     e.descendents = data.filter( (t : Tree) => t.folder_parent_id === e.id);
    // });
    for (let i = 0; i < data.length; i++) {
        // const element = data[i];
        data[i].descendents = data.filter((t) => t.folder_parent_id === data[i].id);
        // console.log("gg");
        // console.log(data[i].descendents);
    }
    // data = data.filter((t : Tree) => t.descendents.length > 0)
    // printTree(data[0]);
    res.status(200).json(data);
});
const createFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let folderName = req.body.name;
    let folderParentID = req.body.folderParentID;
    // console.log(req.body);
    try {
        let result = yield prisma.folders.create({
            data: {
                //@ts-ignore
                folder_name: folderName,
                folder_parent_id: folderParentID,
            }
        });
        console.log(result);
        return res.status(200).json({ msg: "success" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
        return;
    }
});
const removeFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let folderID = req.body.folderID;
    try {
        yield prisma.folders.deleteMany({
            where: {
                //@ts-ignore
                folder_parent_id: {
                    contains: folderID,
                },
            },
        });
        yield prisma.folders.delete({
            where: {
                //@ts-ignore
                id: folderID
            },
        });
        return res.status(200).json({ msg: "success" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
        return;
    }
});
module.exports = {
    getFolders,
    createFolders,
    removeFolders
};

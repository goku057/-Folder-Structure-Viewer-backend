import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const getFolders = async (req: any, res : any) => {
    let results : any;
    try{
        results = await prisma.folders.findMany();
    }
    catch(e){
        console.log(e);
    }
    // console.log(results);
    type Tree = {
        id : string,
        folder_name : string,
        folder_parent_id? : string,
        descendents : Tree[],
        isVisited : boolean
    };
    let root : Tree = {
        id : "root",
        folder_name : "root",
        folder_parent_id : undefined,
        descendents : [],
        isVisited : true
    } 

    let data : Tree[] = [];
    data.push(root);
    results.map( (r: Tree) => {
        let temp : Tree = {
            id : r.id,
            folder_name : r.folder_name,
            folder_parent_id : r.folder_parent_id,
            descendents : [],
            isVisited : true
        }
        data.push(temp)
    });
    // data.map( (e : Tree) => {
    //     // let temp: Tree[] = [];
    //     e.descendents = data.filter( (t : Tree) => t.folder_parent_id === e.id);
             
    // });
    for (let i = 0; i < data.length; i++) {
        // const element = data[i];

        data[i].descendents = data.filter( (t : Tree) => t.folder_parent_id === data[i].id);
        // console.log("gg");
        // console.log(data[i].descendents);
    }
    // data = data.filter((t : Tree) => t.descendents.length > 0)
    // printTree(data[0]);
    res.status(200).json(data);
}

const createFolders = async (req: any, res : any) => {
    
    let folderName : string = req.body.name;
    let folderParentID : string = req.body.folderParentID;
    // console.log(req.body);
    try{
        let result =  await prisma.folders.create({
            data : {
              //@ts-ignore
              folder_name : folderName,
              folder_parent_id: folderParentID,
            }
          });
        console.log(result);
        return res.status(200).json({msg : "success"});
    }
    catch(e) {
        console.log(e);
        res.status(500).json(e);
        return;
    }

}

const removeFolders = async (req: any, res : any) => {

    let folderID : string = req.body.folderID;
    try{
        await prisma.folders.deleteMany({
            where: {
                //@ts-ignore
                folder_parent_id: {
                  contains: folderID,
                },
              },
          })
        await prisma.folders.delete({
            where: {
                //@ts-ignore
                id : folderID
              },
          })
        return res.status(200).json({msg : "success"});
    }
    catch(e) {
        console.log(e);
        res.status(500).json(e);
        return;
    }
}


 
export = {
    getFolders,
    createFolders,
    removeFolders
}
#!/usr/bin/env node

let input = process.argv.slice(2);
let fs = require("fs");
let path = require("path")
// console.log(input);


let command = input[0];

let types = {
    media : ["mp4", "mkv"],
    archives : ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    documents : ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app : ['exe', 'dmg', 'pkg', 'deb'],
    images : ['jpeg', 'png', 'gif']
}

switch (command) {
    case "tree":
        treefn(input[1]);
        break;

    case "organize":
        organizefn(input[1]);
        break;
    
    case "help":
        helpfn();
        break;
    default:
        console.log(command+" command not found");
}

// tree implementation

function treefn(dirPath) {
    // console.log("tree command implemented for "+dirPath);
    if(dirPath == undefined){
        treeHelper(process.cwd(), "");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath, "");
        }
        else{
            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent){
    // is file or folder if file then directly print it or if folder then move inside that folder.
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else{
        let isDir = fs.statSync(dirPath).isDirectory();
        if(isDir == false){
            return;
        }
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}





// organize implementation

function organizefn(dirPath) {
    // console.log("organize command implemented for "+dirPath);
    // 1. input -> directory path given so check whether it is valid or not
    let destPath;
    // console.log(dirPath);
    if(dirPath == undefined){
        // console.log("Kindly enter the path")
        destPath = path.join(process.cwd(), "organized_files")
        if(fs.existsSync(destPath) == false){
            fs.mkdirSync(destPath);
            console.log("organize_files directory created");
        }
        else{
            console.log("organize_files directory already exist");
        }
        organizeHelper(process.cwd(), destPath);
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath, "organized_files")
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
                console.log("organize_files directory created");
            }
            else{
                console.log("organize_files directory already exist");
            }
        }
        
        else{
            console.log("Kindly enter the correct path");
            return;
        }
    }
    // console.log(destPath);
    organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest){
    // 3. identiry categories of all the files present in that input directory ->
    console.log("src = ",src);
    let childnames = fs.readdirSync(src);
    // console.log(childnames);
    for(let i = 0; i<childnames.length; i++){
        let childAddress = path.join(src, childnames[i]);
        // console.log(childAddress);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childnames[i]);
            let cat = getCategory(childnames[i]);
            console.log(childnames[i] + " belongs to --> "+cat);
            // 4. copy / cut files to that organized directory inside of any of category folder.
            sendFiles(childAddress, dest, cat);
        }
    }
}

function getCategory(name){
    let ext = path.extname(name);
    // console.log(ext);
    ext = ext.slice(1);
    for(let type in types){
        let cType = types[type];
        for(let i = 0; i<cType.length; i++){
            if(ext == cType[i]){
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(fileaddress, dest, cat){
    let categoryPath = path.join(dest, cat);
    // console.log(categoryPath);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
        // console.log(cat + " folder created");
    }
    let filename = path.basename(fileaddress);
    // console.log("filename = "+filename);
    let destFilePath = path.join(categoryPath, filename);
    // console.log(destFilePath);
    fs.copyFileSync(fileaddress, destFilePath);
    console.log(filename, "copied to", cat);
}




// help implementation

function helpfn() {
    console.log(`
List of all folks command -->

                node main.js tree "directoryPath"
                node main.js organize "directoryPath"
                node main.js help
    `)
}

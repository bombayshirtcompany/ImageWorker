const tinify = require("tinify");
const path = require('path');
const tinyjpfConf = require(path.join(__dirname, "../","configs","tinyjpg.config.js"));

tinify.key = tinyjpfConf.key;

function tinifyImage(imgFilePath, imgDestPath){
    return new Promise((resolve,reject)=>{
        const source = tinify.fromFile(imgFilePath);
        source.toFile(imgDestPath).then(()=>{
            resolve("Done");
        }).catch((error)=>{
            reject(error);
        });
    });
}

module.exports = {
    tinifyImage
}
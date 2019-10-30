const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const awsConf = require(path.join(__dirname,"../","configs","aws.config.js"));

let s3bucket = new AWS.S3(awsConf);

function uploadToS3(filePath, fileName){    
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath, function (err, data) {
            if(err){
                reject(err); return;
            }

            var params = {
                Bucket: awsConf.Bucket,
                Key: fileName,
                Body: data,
            };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    reject(err)
                }else{
                    resolve("Done");
                }
            });
        })
    })
}

module.exports = {
    uploadToS3
}
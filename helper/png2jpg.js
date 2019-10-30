var Jimp = require('jimp');
var path = require('path');

var https = require('https'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');                                                    

function saveImage(url,desFolder, name, ext){
    return new Promise((resolve, reject)=>{
        https.request(url, function(response) {                                        
            let data = new Stream();                                                    
            response.on('data', function(chunk) {                                       
                data.push(chunk);                                                         
            });                                                                         
        
            response.on('end', function() {                                             
                fs.writeFileSync(path.join(desFolder,name+'.'+ext), data.read());
                resolve("Done");                            
            });                                                                         
        }).end();
    })
}

function convertImagetoJpg(imgUrl, desFolder){
    return new Promise((resolve,reject)=>{
        let fullName = imgUrl.split("/").pop();
        let splitName = fullName.split(".");
        let ext = splitName.pop();
        let name = splitName.join(".");

        saveImage(imgUrl,desFolder,name,ext).then(()=>{
            Jimp.read(path.join(desFolder,name+'.'+ext), function (err, image) {
                if (err) {
                    reject(err);
                } else {
                    image.write(path.join(desFolder,name+".jpg"));
                    image.resize(300, 378).write(path.join(desFolder,name+"-300x378"+".jpg"));
                    image.resize(436, 552).write(path.join(desFolder,name+"-436x552"+".jpg"));
                    setTimeout(()=>{
                        resolve(name); //let image write complete as it doesn't have callback
                    },600);
                }
            })
        })
    });
}

module.exports = {
    convertImagetoJpg
}
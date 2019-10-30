var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');

var convertImagetoJpg = require(path.join(__dirname,"../","helper","png2jpg.js")).convertImagetoJpg;
var tinifyImage = require(path.join(__dirname,"../","helper","tinyjpg.js")).tinifyImage;
var uploadToS3 = require(path.join(__dirname,"../","helper","uploadS3.js")).uploadToS3;

var results = {};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/result/:id', function(req, res, next) {
  res.send(results[req.params.id] || []);
});

router.use('/convertToJpgAndUpload', async function(req, res, next) {
  let urls = req.body.urls || JSON.parse(req.query.urls || []);
  if(!urls || !Array.isArray(urls)){
    res.send("Please provide array of urls");
    return;
  }
  if(conversionStarted){
    res.send("Please wait previous conversion is ongoing.");
    return;
  }
  let id = (new Date()).valueOf();
  results[id] = [];
  startConversion(urls, id, (req.protocol + '://' + req.get('host')) ).then().catch();
  res.send("Conversion startted, flow this link for results - "+req.protocol + '://' + req.get('host')+"/result/"+id);  
});

var conversionStarted = false;
async function startConversion(urls = [], id, host){
  conversionStarted = true;

  for(let i=0; i<urls.length; i++){
    let url = urls[i];
    let inputpath = path.join(__dirname,"../","public","inputImage")
    try{
      let imageName = await convertImagetoJpg(url,inputpath);
      let destPath = [];
      destPath.push(path.join(inputpath,"../","outputImage",imageName+".jpg" ));
      destPath.push(path.join(inputpath,"../","outputImage",imageName+"-300x378"+".jpg" ));
      destPath.push(path.join(inputpath,"../","outputImage",imageName+"-436x552"+".jpg" ));

      for(let j=0; j<destPath.length; j++){
        let fileName = destPath[j].split("/").pop();
        await tinifyImage( path.join(inputpath,fileName), destPath[j]);
        let folderPath = url.split(".com/").pop().split("/");
        folderPath.pop();
        await uploadToS3(destPath[j], folderPath.join("/")+"/"+fileName);
        results[id].push({
          url, status: "success", link: (host+'/outputImage/'+fileName)
        });
      }
    }catch(error){
      console.log(error);
      results[id].push({
        url, status: "fail", error: error.message
      });
    }
  }


  conversionStarted = false;
}

module.exports = router;

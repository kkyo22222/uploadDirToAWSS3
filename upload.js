var AWS = require('aws-sdk');

var s3 = new AWS.S3(
            {
                params:{
                    Bucket:"kyo22222",
                    Key:"website"
                }
            }
        
        );


s3.listBuckets(function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
});

/*
s3.upload({
         Body: "/home/kyo/桌面/website"
}).on('httpUploadProgress',function(event){
    console.log(event);
}).send(function(err,data){

});
*/


var async = require('async'),
        fs = require('fs'),
            path = require("path");

var rootDirectoryPath = "/home/kyo/website";

submitDir(rootDirectoryPath,"");
function submitDir(directoryPath,addPath){
    var files = fs.readdirSync(directoryPath);
    console.log(files);
    async.map(files, function (f, cb) {
            var filePath = path.join(directoryPath, f);
            console.log(f);
            if(fs.lstatSync(filePath).isFile()){
                var options = { 
             
                        Bucket: "kyo22222",
                        Key: addPath+f.toString(),
                        Body: fs.readFileSync(filePath),
                        ACL: "public-read-write"
                }
                if(f =="index.html"){
                    //options["Metadata"] = {"Content-Type":"text/html"};
                    options["ContentType"]="text/html";
                }

                s3.putObject(options, cb);
            }
            else{
                
                submitDir(filePath,addPath+f+"/");
            }
    }, function (err, results) {
            if (err) console.error(err);
                console.log(results);
    });
}

var express = require('express');
var router = express.Router();
var tableify = require('tableify');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('CSV route');
});

router.get('/upload', function (req, res, next) {
  res.sendfile('./public/html/upload.html');
});

// Performs the function of parsing and writing csv to the html output on uploading of csv
//Enable commented lines within this method to also store multipart data file in the defined location
// If enabling comment, do manage callbacks
router.post('/upload', function (req, res, next) {

  var multiparty = require("multiparty");
  var form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    var img = files.csv[0];
    var fs = require("fs");


    fs.readFile(img.path, function (err, data) {
      var path = "./public/docs/" + img.originalFilename;
      fs.writeFile(path, data, function (error) {
        if (error) console.log(error);
        //res.send("Upload Success");
      });
    });

    var parse = require('csv-parse');
    var csvData = [];
    fs.createReadStream(img.path)
      .pipe(parse({ delimiter: ':' }))
      .on('data', function (csvrow) {
        // console.log(csvrow);
        //csvrow functions to be performed here
        csvData.push(csvrow);
      })
      .on('end', function () {
        //csvData functions to be performed here - tableify is used to bring table structure for json array
        var html = tableify(csvData);
        // res.send(html);
        res.send(csvData);
        // csvData2 = JSON.stringify(csvData);
        // res.render('index', { csvData2 });
      });

  });
});

module.exports = router;

/*
CSc337 Final Project - Mr. Experience
This is the nodejs file that implements the functions for the oppaTour.html.
*/
const express = require("express");
const app = express();
const fs = require("fs");
//The parsers are for sending the messages to the server
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));
console.log("Connected");
//Send the comment user just typed in to the service
app.post('/', jsonParser, function (req, res) {
  let date = req.body.date;
  let name = req.body.name;
  let words = req.body.words;
  let rate = req.body.rate;
  let folder = req.body.folder;
  let json = getComments(folder);

  let comment = date + ":::" + name + ":::" + words + ":::" + rate + "\n";
  //Save the comment to the comments.txt file
  fs.appendFile("allOppas/" + folder + "/comments.txt", comment, function(err) {
    if(err) {
			console.log(err);
      res.send("The message cannot be sent, please try again");
			res.status(400);
    	}
    	console.log("The message was sent successfully!");
    	res.send("The message was sent successfully!");
      res.status(200);
	});
});
//Obtain comments from the files
app.get('/', function (req, res){
  res.header("Access-Control-Allow-Origin", "*");
  let folder = req.query.folder;
  let mode = req.query.mode;
  let plain = 0;
  let json = {};
  let price = req.query.price;
  let language = req.query.language;
  if (mode =="all"){
    json = getAll();
  }
  //If mode is info, it goes into the info.txt
  else if (mode=="info"){
    json = getInfo(folder);
  }
  //If mode is comments, goes into the comments.txt
  else if (mode=="comments"){
    json = getComments(folder);
    // console.log(json);
  }
  //If mode is description, just send the descriptions in description.txt
  else if (mode=="description"){
    let des = fs.readFileSync("allOppas/" + folder + "/description.txt", 'utf8');
    plain = 1;
    res.send(des);
  }
  else if (mode=="find"){
    json = findMatches(language, price);
  }
  if (plain != 1){
    res.json(json);
  }
});
function findMatches(language, price){
  //if the language has no input, language = "undefined"
  //if the price has no input, price = "NaN"
  let oppas = fs.readdirSync("allOppas");
  let json = {};
  let folder = [];
  json["oppas"] = [];
  //Obtain all folders contains different guys
  for (let i = 0; i < oppas.length; i++){
    folder[i] = oppas[i].trim();
    let allFiles = fs.readdirSync("allOppas/" + folder[i] + "/");

    //Obtain all files from a single guy folder
    for (let j = 0; j < allFiles.length; j++){
      let guy = {};
      if (allFiles[j].endsWith("info.txt")){
        let contents = fs.readFileSync("allOppas/" + oppas[i] + "/" + allFiles[j], 'utf8');
        let line = contents.split("\n");
        //find only price matches
        if (typeof(language) == "undefined"){
          if (parseInt(line[5]) <= price){
            guy["name"] = line[0];
            guy["folder"] = folder[i];
            json["oppas"].push(guy);
          }
        }
        //find only language matches
        else if (price == "NaN"){
          if (line[1].toLowerCase().includes(language.toLowerCase())){
            guy["name"] = line[0];
            guy["folder"] = folder[i];
            json["oppas"].push(guy);
          }
        }
        //find both language and price match
        else {
          if (line[1].toLowerCase().includes(language.toLowerCase())
           && parseInt(line[5]) <= price){
            guy["name"] = line[0];
            guy["folder"] = folder[i];
            json["oppas"].push(guy);
          }
        }
      }
    }
  }
  return json;
}
//This function parses the comments in chosen comments.txt
function getComments(folder){
  let customers = fs.readFileSync("allOppas/" + folder + "/" + "comments.txt", 'utf8');
  let line = customers.split("\n");
  let json = {};
  json["comments"] = [];

  //Go through all the comments in the file
  for (let i = 0; i < line.length - 1; i++){
    let element = line[i].split(":::");
    let person = {};
    person["date"] = element[0];
    person["name"] = element[1];
    person["words"] = element[2];
    person["rate"] = element[3];
    json["comments"].push(person);
  }
  return json;
}
//This function parses the lines in chosen info.txt
function getInfo(folder){
  let guy = fs.readFileSync("allOppas/" + folder + "/" + "info.txt", 'utf8');
  let line = guy.split("\n");
  let json = {};
  json["info"] = [];
  let data = {};

  data["name"] = line[0];
  data["languages"] = line[1];
  data["birth"] = line[2];
  data["age"] = line[3];
  data["rate"] = line[4];
  data["price"] = line[5];
  json["info"] = data;
  return json;
}
//The function gets all oppa's name
function getAll(){
  let oppas = fs.readdirSync("allOppas");
  let json = {};
  let folder = [];
  json["oppas"] = [];

  //Obtain all folders contains different guys
  for (let i = 0; i < oppas.length; i++){
    folder[i] = oppas[i].trim();
    let allFiles = fs.readdirSync("allOppas/" + folder[i] + "/");

    //Obtain all files from a single guy folder
    for (let j = 0; j < allFiles.length; j++){
      let guy = {};
      if (allFiles[j].endsWith("info.txt")){
        let contents = fs.readFileSync("allOppas/" + oppas[i] + "/" + allFiles[j], 'utf8');
        let line = contents.split("\n");
        guy["name"] = line[0];
        guy["folder"] = folder[i];
        json["oppas"].push(guy);
      }
    }
  }
  return json;
}
app.listen(process.env.PORT);

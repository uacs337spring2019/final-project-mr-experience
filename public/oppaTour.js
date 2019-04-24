/*
CSc337 Final Project - Mr. Experience
This is the js file that implements the functions for the oppaTour.html.
*/
"use strict";
(function(){
  let timer;
  window.onload = function(){
    showAll();
    document.getElementById("Language").value = "";
    document.getElementById("Price").value = "";
    document.getElementById("intro").className = "";
    document.getElementById("afterSearch").className = "none";
    document.getElementById("home").onclick = showAll;
    document.getElementById("search").onclick = afterSearch;
    document.getElementById("errorMessage").innerHTML = "";
  }
  //This function shows all the oppas we have to offer
  function showAll(){
    //The page will start with loading all the oppa's info
    let url = "https://oppatour4ua.herokuapp.com"  + "/?mode=all";
    fetch(url)
      .then(checkStatus)
      .then(function(responseText){
	console.log(responseText);
	let json = JSON.parse(responseText);
        let oppas = json.oppas;
        createList(oppas);
      })
      .catch(function(error){
        console.log(error);
        document.getElementById("singlePerson").className="none";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("errorMessage").innerHTML = error;
      });
  }
  //After the user has clicked on the "search" button on the homepage
  //a list of guys matches the user's input will appear
  function afterSearch(){
    let all = document.getElementById("afterSearch");
    all.className = "";
    let home = document.getElementById("fromSearch");
    home.onclick = window.onload;
    let language = document.getElementById("Language");
    let price = document.getElementById("Price");
    let url = "https://oppatour4ua.herokuapp.com"  + "/?mode=none";
    if (language.value == "" && price.value == ""){
      document.getElementById("singlePerson").className="none";
      document.getElementById("all").className = "none";
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("errorMessage").innerHTML = "Please enter a value";
    }
    else if (isNaN(price.value) && price.value != ""){
      document.getElementById("singlePerson").className="none";
      document.getElementById("all").className = "none";
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("errorMessage").innerHTML = "Please enter a 'number' for price";
    }
    else if (/^[a-zA-Z]+$/.test(language.value) == false && language.value != ""){
      document.getElementById("singlePerson").className="none";
      document.getElementById("all").className = "none";
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("errorMessage").innerHTML = "Please enter only letters for languages";
    }
    else {
      //Both language and price has correct inputs, try to find the person that
      //matches both then
      if (language.value != "" && isNaN(price.value)==false){
        url = "https://oppatour4ua.herokuapp.com"  + "/?mode=find&price=" + parseInt(price.value)
        + "&language=" + language.value;
      }
      //Find only matches languages
      else if (/^[a-zA-Z]+$/.test(language.value) && price.value == ""){
        url = "https://oppatour4ua.herokuapp.com"  + "/?mode=find&language=" + language.value;
      }
      //Find only matches price
      else if (!isNaN(price.value) && language.value == ""){
        url = "https://oppatour4ua.herokuapp.com"  + "/?mode=find&price=" + parseInt(price.value);
      }
      fetch(url)
        .then(checkStatus)
        .then(function(responseText){
            let json = JSON.parse(responseText);
            let oppas = json.oppas;
            document.getElementById("errorMessage").innerHTML = "";
            createList(oppas);
        })
        .catch(function(error){
          console.log(error);
          document.getElementById("all").className = "none";
          document.getElementById("singlePerson").className = "none";
          document.getElementById("errorMessage").innerHTML = "";
          document.getElementById("errorMessage").innerHTML = error;
        });
    }
  }
  //List out the guys with pic and name
  function createList (oppas){
    //Enable homepage items show
    let allOppas = document.getElementById("all");
    allOppas.className = "allBefore";
    allOppas.innerHTML = "";
    let first = document.getElementById("firstPart");
    first.className = "";
    let validator = document.getElementById("validator");
    validator.className = "";
    //Make single person items hide
    let single = document.getElementById("singlePerson");
    single.className = "none";
    if (oppas.length == 0){
      document.getElementById("all").className = "none";
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("errorMessage").innerHTML = "Sorry, no matches found for your requirements, please try again.";

    }
    for (let i = 0; i < oppas.length; i++){
      let div = document.createElement("div");
      div.className = "blocks";
      let img = document.createElement("img");
      let p = document.createElement("p");
      img.src = "allOppas/" + oppas[i].folder + "/head.jpg";
      p.innerHTML = oppas[i].name;
      //Changes color when mouse is on the selected person
      div.onmouseover = function(event){
        div.style.background = "#DEB887";
        p.style.color = "#F3F68E";
      }
      div.onmouseout = function(event){
        div.style.background = "";
        p.style.color = "";
      }
      div.appendChild(img);
      div.appendChild(p);
      div.onclick = function(){
        //Clear homepage items
        allOppas.innerHTML = "";
        allOppas.className = "none";
        first.className = "none";
        validator.className = "none";
        //Enable single person info shown on the page
        single.className = "singleBefore";
        guyInfo(oppas[i].folder);
      }
      allOppas.appendChild(div);
    }
  }
  //Prints out the information on the current guy's page from info.txt
  function printInformations (info){
    let name = info.name;
    let languages = info.languages;
    let birth = info.birth;
    let age = info.age;
    let rate = info.rate;
    let price = info.price;
    document.getElementById("afterSearch").className = "none";
    let home = document.getElementById("home");
    home.innerHTML = "Return to Homepage";
    home.onclick = window.onload;
    document.getElementById("name").innerHTML = name;
    let speak = document.getElementById("speak");
    speak.innerHTML = "";
    speak.innerHTML += languages;
    let bday = document.getElementById("bday");
    bday.innerHTML = "";
    bday.innerHTML += birth;
    let age1 = document.getElementById("age")
    age1.innerHTML = "";
    age1.innerHTML += age + " years old";
    let rate1 = document.getElementById("rate");
    rate1.innerHTML = "";
    rate1.innerHTML += rate;
    let price1 = document.getElementById("price");
    price1.innerHTML = "";
    price1.innerHTML += "$" + price + " per day";

  }
  //When user writes a new comment with a valid form, it will POST and then
  //show on the commented area
  function writeComments(folder){
    let newSpan = document.createElement("span");
    newSpan.id = "successSent";
    let all = document.getElementById("allComments");
    all.innerHTML = "";
    let cDate = document.getElementById("cDate");
    let cName = document.getElementById("cName");
    let cWords = document.getElementById("cWords");
    let cRate = document.getElementById("cRate");
    let check = 0;

    if (cDate.value == ""){
      newSpan.innerHTML = "Please input the date you had a tour with him";
      all.appendChild(newSpan);
      check = 1;
      timer = setTimeout(function() {
        guyInfo(folder);
      }, 3000);
    }
    else if (cName.value == ""){
      newSpan.innerHTML = "Please input your name";
      all.appendChild(newSpan);
      check = 1;
      timer = setTimeout(function() {
        guyInfo(folder);
      }, 3000);
    }
    else if (cWords.value == ""){
      newSpan.innerHTML = "Please write something";
      all.appendChild(newSpan);
      check = 1;
      timer = setTimeout(function() {
        guyInfo(folder);
      }, 3000);
    }
    else if (cRate.value == "" || isNaN(cRate.value)){
      newSpan.innerHTML = "Please input a valid rate, numbers only";
      all.appendChild(newSpan);
      check = 1;
      timer = setTimeout(function() {
        guyInfo(folder);
      }, 3000);
    }
    else if (parseInt(cRate.value) > 5 || parseInt(cRate.value) < 1){
      newSpan.innerHTML = "Please input numbers between 1-5, decimals are allowed";
      all.appendChild(newSpan);
      check = 1;
      timer = setTimeout(function() {
        guyInfo(folder);
      }, 3000);
    }
     else if (check == 0){
      const comment = {
            folder: folder,
            date: cDate.value,
            name: cName.value,
            words: cWords.value,
            rate: cRate.value
          };
      const fetchOptions = {
        //Sending the message to server, so use 'POST' here
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(comment)
      };
      let url = "https://oppatour4ua.herokuapp.com" ;
  	  fetch(url, fetchOptions)
        .then(checkStatus)
        .then(function(responseText){
          console.log(responseText);
          all.innerHTML = "";
          newSpan.innerHTML = "";
          newSpan.innerHTML = responseText;
          all.appendChild(newSpan);
          cName.value = "";
          cDate.value = "";
          cWords.value = "";
          cRate.value = "";
          timer = setTimeout(function() {
            guyInfo(folder);
          }, 3000);
        })
        .catch(function(error){
          console.log(error);
          document.getElementById("singlePerson").className = "none";
          document.getElementById("errorMessage").innerHTML = "";
          document.getElementById("errorMessage").innerHTML = error;
        })
    }
  }
  //Print All Comments
  function printComments(comments){
    let allComments = document.getElementById("allComments");
    if (comments.length == 0){
      let div = document.createElement("div");
      div.innerHTML = "No Comments for this perfect guy yet!" +
      " Be the first one!!!";
      allComments.appendChild(div);
    }
    else {
      for (let i = 0; i < comments.length; i++){
        let div = document.createElement("div");
        let span1 = document.createElement("span");
        span1.id = "outputDate";
        let span2 = document.createElement("span");
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        span2.id ="outputRate"
        p1.innerHTML = comments[i].name + "  ";
        span1.innerHTML = comments[i].date;
        p1.appendChild(span1);
        p2.innerHTML = ": " + comments[i].words + " - ";
        span2.innerHTML = "rate: " + comments[i].rate;
        p2.appendChild(span2);
        div.appendChild(p1);
        div.appendChild(p2);
        allComments.appendChild(div);
      }
    }
  }
  //This gives the single guy info
  function guyInfo(folder){
    clearTimeout(timer);
    let singleInfo = document.getElementById("singlePerson");
    singleInfo.style.visibility = "visible";
    document.getElementById("head").src = "allOppas/" + folder + "/head.jpg";
    let urlInfo = "https://oppatour4ua.herokuapp.com"  + "/?mode=info&folder="+folder;
    //let urlInfo = "https://localhost:3000/?notfound";
    let urlDes = "https://oppatour4ua.herokuapp.com"  + "/?mode=description&folder="+folder;
    let urlCom = "https://oppatour4ua.herokuapp.com"  + "/?mode=comments&folder="+folder;

    fetch(urlInfo)
      .then(checkStatus)
      .then(function(responseText){
        //Read info from info.txt and print it out
        let json = JSON.parse(responseText);
        printInformations(json.info);
      })
      .catch(function(error){
        console.log(error);
        document.getElementById("singlePerson").className = "none";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("errorMessage").innerHTML = error;
      });
    fetch(urlDes)
      .then(checkStatus)
      .then(function(responseText){
        //Read all description and print it out
        document.getElementById("describePerson").innerHTML = "";
        document.getElementById("describePerson").innerHTML = responseText;
      })
      .catch(function(error){
        console.log(error);
        document.getElementById("singlePerson").className = "none";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("errorMessage").innerHTML = error;
      });
    fetch(urlCom)
      .then(checkStatus)
      .then(function(responseText){
        //Read all comments and print them out
        let json = JSON.parse(responseText);
        document.getElementById("allComments").innerHTML = "";
        printComments(json.comments);
      })
      .catch(function(error){
        console.log(error);
        document.getElementById("singlePerson").className = "none";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("errorMessage").innerHTML = error;
      });

    document.getElementById("Submit").onclick = function(){
      writeComments(folder);
    }
  }
  //Error check
  function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		}
    else if (response.status == 404) {
			return Promise.reject(new Error("Not found"));
		}
    else {
			return Promise.reject(new Error(response.status+": "+response.statusText));
		}
	}
})();

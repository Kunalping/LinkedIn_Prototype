let sentRequests = [];

const people = [
"Rahul Sharma",
"Priya Patel",
"Amit Singh",
"Neha Gupta",
"Karan Mehta",
"Sneha Reddy",
"Aditya Verma",
"Pooja Kapoor",
"Vikram Joshi",
"Ananya Das"
];

function enterApp(){

const name = document.getElementById("nameInput").value;

if(name===""){
alert("Enter name");
return;
}

document.getElementById("loginPage").style.display="none";
document.getElementById("mainPage").style.display="block";

renderPeople();

}


function showTab(tab){

document.getElementById("peopleSection").style.display="none";
document.getElementById("receivedSection").style.display="none";
document.getElementById("sentSection").style.display="none";

document.getElementById(tab).style.display="block";

}


function renderPeople(){

const container=document.getElementById("peopleList");

container.innerHTML="";

people.forEach(person=>{

const card=document.createElement("div");
card.className="personCard";

const name=document.createElement("span");
name.innerText=person;

const btn=document.createElement("button");

if(sentRequests.includes(person)){

btn.innerText="Requested";
btn.disabled=true;
btn.style.backgroundColor="#ddd";
btn.style.cursor="not-allowed";

}else{

btn.innerText="Connect";

btn.onclick=function(){
sendRequest(person);
};

}

card.appendChild(name);
card.appendChild(btn);

container.appendChild(card);

});

}


function sendRequest(person){

sentRequests.push(person);

renderPeople();
renderSentRequests();

}


function renderSentRequests(){

const container=document.getElementById("sentList");

container.innerHTML="";

sentRequests.forEach(person=>{

const item=document.createElement("div");

item.className="personCard";

item.innerText=person;

container.appendChild(item);

});

}


function toggleDropdown(){

const menu=document.getElementById("meDropdown");

if(menu.style.display==="block"){
menu.style.display="none";
}else{
menu.style.display="block";
}

}

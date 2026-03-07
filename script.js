let sentRequests = 0;

document.addEventListener("DOMContentLoaded", function(){

const buttons = document.querySelectorAll(".connectBtn");

buttons.forEach(button => {

button.addEventListener("click", function(){

if(button.classList.contains("requested")) return;

button.innerText="Requested";
button.classList.add("requested");
button.disabled=true;

const card = button.closest(".personCard");
const name = card.querySelector(".name").innerText;

addToSent(name);

sentRequests++;
updateCounter();

});

});

});


function addToSent(name){

const container=document.getElementById("sentList");

const div=document.createElement("div");
div.className="personCard";
div.innerHTML=`<div class="name">${name}</div>`;

container.appendChild(div);

}


function updateCounter(){

document.getElementById("sentTab").innerText=
"Req Sent ("+sentRequests+")";

}


function showTab(tab){

document.querySelectorAll(".tabContent").forEach(t=>{
t.classList.add("hidden");
});

document.getElementById(tab).classList.remove("hidden");

}

let sentRequests = [];
let receivedRequests = [];

/* TAB SWITCHING */

function showTab(tabName){

document.getElementById("peopleSection").style.display="none";
document.getElementById("receivedSection").style.display="none";
document.getElementById("sentSection").style.display="none";

document.getElementById(tabName).style.display="block";

}

/* CONNECT BUTTON LOGIC */

document.addEventListener("DOMContentLoaded",function(){

const connectButtons=document.querySelectorAll(".connectBtn");

connectButtons.forEach(button=>{

button.addEventListener("click",function(){

if(button.classList.contains("requested")) return;

button.classList.add("requested");
button.innerText="Requested";
button.disabled=true;

const card=button.closest(".personCard");
const name=card.querySelector(".name").innerText;

sentRequests.push(name);

addToSent(name);
updateCounters();

});

});

});

/* ADD TO SENT LIST */

function addToSent(name){

const container=document.getElementById("sentList");

if(!container) return;

const div=document.createElement("div");

div.className="personCard";

div.innerHTML=`
<div class="info">
<div class="name">${name}</div>
<div class="title">Connection request sent</div>
</div>
`;

container.appendChild(div);

}

/* COUNTERS */

function updateCounters(){

document.getElementById("sentTab").innerText=
"Req Sent ("+sentRequests.length+")";

}

/* ME DROPDOWN */

function toggleDropdown(){

const dropdown=document.getElementById("meDropdown");

if(!dropdown) return;

if(dropdown.style.display==="block"){
dropdown.style.display="none";
}else{
dropdown.style.display="block";
}

}

/* CLOSE DROPDOWN IF CLICKED OUTSIDE */

window.onclick=function(event){

if(!event.target.matches(".meButton")){

const dropdown=document.getElementById("meDropdown");

if(dropdown){
dropdown.style.display="none";
}

}

};

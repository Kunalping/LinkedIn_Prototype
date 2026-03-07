let sentCount = 0;

document.querySelectorAll(".connectBtn").forEach(button=>{

button.addEventListener("click",()=>{

if(button.classList.contains("requested")) return;

button.innerText="Requested";
button.classList.add("requested");
button.disabled=true;

sentCount++;

document.getElementById("sentTab").innerText=
"Req Sent ("+sentCount+")";

});

});

function showTab(tab){

document.querySelectorAll(".tabContent").forEach(t=>{
t.classList.add("hidden");
});

document.getElementById(tab).classList.remove("hidden");

}

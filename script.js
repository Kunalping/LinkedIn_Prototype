
let people = [
"Alex","Maria","David","Priya","Rahul","Sofia","John","Meera","Arjun","Nina",
"Karan","Aisha","Daniel","Sneha","Victor","Riya","Sam","Anita"
]

let received = ["Host"]
let sent = []

function enterSession(){
let name=document.getElementById("nameInput").value
if(!name){alert("Enter name");return;}
document.getElementById("nameScreen").classList.add("hidden")
document.getElementById("appScreen").classList.remove("hidden")
render()
}

function showTab(tab){
document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"))
document.getElementById(tab).classList.remove("hidden")
}

function render(){
let peopleDiv=document.getElementById("people")
peopleDiv.innerHTML=""
people.forEach(p=>{
if(sent.includes(p)) return
let div=document.createElement("div")
div.className="person"
div.innerHTML=`<span>${p}</span><button onclick="sendReq('${p}')">Connect</button>`
peopleDiv.appendChild(div)
})

let sentDiv=document.getElementById("sent")
sentDiv.innerHTML=""
sent.forEach(p=>{
let div=document.createElement("div")
div.className="person"
div.innerHTML=`<span>${p}</span><span>Request Sent</span>`
sentDiv.appendChild(div)
})

let recDiv=document.getElementById("received")
recDiv.innerHTML=""
received.forEach(p=>{
let div=document.createElement("div")
div.className="person"
div.innerHTML=`<span>${p}</span><button onclick="acceptReq('${p}')">Accept</button>`
recDiv.appendChild(div)
})
}

function sendReq(p){
sent.push(p)
render()
}

function acceptReq(p){
alert("Connected with "+p)
received = received.filter(x=>x!==p)
render()
}

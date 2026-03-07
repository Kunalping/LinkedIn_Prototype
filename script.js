// ----------------------
// DATA
// ----------------------

const people = [
{name:"Rahul Sharma",headline:"MBA Candidate | Marketing",img:"https://randomuser.me/api/portraits/men/32.jpg"},
{name:"Priya Patel",headline:"Finance Enthusiast",img:"https://randomuser.me/api/portraits/women/44.jpg"},
{name:"Sofia Khan",headline:"Product Manager",img:"https://randomuser.me/api/portraits/women/68.jpg"},
{name:"John Mathew",headline:"Software Engineer",img:"https://randomuser.me/api/portraits/men/52.jpg"},
{name:"Meera Iyer",headline:"Consulting Aspirant",img:"https://randomuser.me/api/portraits/women/12.jpg"}
]

let sent = []

let received = [
{name:"Daniel Lee",headline:"Data Scientist",img:"https://randomuser.me/api/portraits/men/14.jpg"},
{name:"Nina Roy",headline:"Business Analyst",img:"https://randomuser.me/api/portraits/women/21.jpg"}
]


// ----------------------
// SESSION TIMER
// ----------------------

const sessionEnd = new Date()

// example session: 1 day 4 hours
sessionEnd.setHours(sessionEnd.getHours() + 28)

function updateTimer(){

const now = new Date()

let diff = sessionEnd - now

let days = Math.floor(diff/(1000*60*60*24))
let hours = Math.floor((diff/(1000*60*60)) % 24)
let mins = Math.floor((diff/(1000*60)) % 60)

document.getElementById("timer").innerText =
`Session Live: ${days}d ${hours}h ${mins}m`

}

updateTimer()
setInterval(updateTimer,60000)


// ----------------------
// NAVBAR DROPDOWN
// ----------------------

function toggleDropdown(){

let menu = document.getElementById("profileDropdown")

if(menu.style.display === "block")
menu.style.display = "none"
else
menu.style.display = "block"

}


// close dropdown when clicking outside

window.onclick = function(event){

if(!event.target.closest(".dropdown")){

let menu = document.getElementById("profileDropdown")

if(menu)
menu.style.display = "none"

}

}


// ----------------------
// TAB NAVIGATION
// ----------------------

function showSection(section){

document.getElementById("people").classList.add("hidden")
document.getElementById("sent").classList.add("hidden")
document.getElementById("received").classList.add("hidden")

document.getElementById(section).classList.remove("hidden")

}


// ----------------------
// RENDER UI
// ----------------------

function render(){

document.getElementById("peopleCount").innerText = people.length
document.getElementById("sentCount").innerText = sent.length
document.getElementById("receivedCount").innerText = received.length

renderPeople()
renderSent()
renderReceived()

}


// ----------------------
// PEOPLE SECTION
// ----------------------

function renderPeople(){

let html = ""


// PREMIUM GROUP ENTRY

html += `
<div class="person">

<div class="person-info">

<div class="name">
LiveSync Official Group
<span class="premium-icon">★</span>
</div>

<div class="headline">
Join official event networking group
</div>

</div>

<button class="connect">Join</button>

</div>
`


// SEND REQUEST TO ALL (PREMIUM)

html += `
<div class="person">

<div class="person-info">

<div class="name">
Send Request to All
<span class="premium-icon">★</span>
</div>

<div class="headline">
Premium feature
</div>

</div>

<button class="connect" onclick="sendAllRequests()">
Send
</button>

</div>
`


// NORMAL PEOPLE

people.forEach(p=>{

if(!sent.find(x=>x.name === p.name)){

html += `
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">

<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>

</div>

<button class="connect"
onclick="sendRequest('${p.name}')">

Connect

</button>

</div>
`

}

})

document.getElementById("people").innerHTML = html

}


// ----------------------
// SENT REQUESTS
// ----------------------

function renderSent(){

let html = ""

sent.forEach(p=>{

html += `
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">

<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>

</div>

<button class="withdraw"
onclick="withdrawRequest('${p.name}')">

Withdraw

</button>

</div>
`

})

document.getElementById("sent").innerHTML = html

}


// ----------------------
// RECEIVED REQUESTS
// ----------------------

function renderReceived(){

let html = ""

received.forEach(p=>{

html += `
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">

<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>

</div>

<button class="accept"
onclick="acceptRequest('${p.name}')">

Accept

</button>

</div>
`

})

document.getElementById("received").innerHTML = html

}


// ----------------------
// ACTIONS
// ----------------------

function sendRequest(name){

let person = people.find(p=>p.name === name)

if(!sent.includes(person))
sent.push(person)

render()

}


function withdrawRequest(name){

sent = sent.filter(p=>p.name !== name)

render()

}


function acceptRequest(name){

let person = received.find(p=>p.name === name)

received = received.filter(p=>p.name !== name)

people.push(person)

render()

}


// PREMIUM FEATURE

function sendAllRequests(){

people.forEach(p=>{

if(!sent.includes(p))
sent.push(p)

})

render()

}


// ----------------------
// INITIAL RENDER
// ----------------------

render()

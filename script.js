const people=[
{name:"Rahul Sharma",headline:"MBA Candidate | Marketing",img:"https://randomuser.me/api/portraits/men/32.jpg"},
{name:"Priya Patel",headline:"Finance Enthusiast",img:"https://randomuser.me/api/portraits/women/44.jpg"},
{name:"Sofia Khan",headline:"Product Manager",img:"https://randomuser.me/api/portraits/women/68.jpg"},
{name:"John Mathew",headline:"Software Engineer",img:"https://randomuser.me/api/portraits/men/52.jpg"}
]

let sent=[]
let received=[
{name:"Daniel Lee",headline:"Data Scientist",img:"https://randomuser.me/api/portraits/men/14.jpg"}
]

const sessionEnd=new Date()
sessionEnd.setHours(sessionEnd.getHours()+5)

function updateTimer(){

const now=new Date()

let diff=sessionEnd-now

let days=Math.floor(diff/(1000*60*60*24))
let hours=Math.floor(diff/(1000*60*60)%24)
let mins=Math.floor(diff/(1000*60)%60)

document.getElementById("timer").innerText=
`Session Live: ${days}d ${hours}h ${mins}m`

}

setInterval(updateTimer,60000)
updateTimer()

function showSection(sec){

document.getElementById("people").classList.add("hidden")
document.getElementById("sent").classList.add("hidden")
document.getElementById("received").classList.add("hidden")

document.getElementById(sec).classList.remove("hidden")

}

function render(){

document.getElementById("peopleCount").innerText=people.length
document.getElementById("sentCount").innerText=sent.length
document.getElementById("receivedCount").innerText=received.length

let html=""

html+=`
<div class="person">
<div class="person-info">
<div class="name">
LiveSync Official Group
<span class="premium-icon">★</span>
</div>
<div class="headline">Join official event group</div>
</div>
<button class="connect">Join</button>
</div>
`

html+=`
<div class="person">
<div class="person-info">
<div class="name">
Send Request to All
<span class="premium-icon">★</span>
</div>
<div class="headline">Premium feature</div>
</div>
<button class="connect" onclick="sendAll()">Send</button>
</div>
`

people.forEach(p=>{
html+=`
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">
<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>
</div>

<button class="connect" onclick="sendRequest('${p.name}')">Connect</button>

</div>
`
})

document.getElementById("people").innerHTML=html

let sentHTML=""
sent.forEach(p=>{
sentHTML+=`
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">
<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>
</div>

<button class="withdraw" onclick="withdraw('${p.name}')">Withdraw</button>

</div>
`
})

document.getElementById("sent").innerHTML=sentHTML

let recHTML=""
received.forEach(p=>{
recHTML+=`
<div class="person">

<img class="avatar" src="${p.img}">

<div class="person-info">
<div class="name">${p.name}</div>
<div class="headline">${p.headline}</div>
</div>

<button class="accept" onclick="accept('${p.name}')">Accept</button>

</div>
`
})

document.getElementById("received").innerHTML=recHTML

}

function sendRequest(name){

let p=people.find(x=>x.name==name)
sent.push(p)

render()

}

function withdraw(name){

sent=sent.filter(p=>p.name!=name)

render()

}

function accept(name){

received=received.filter(p=>p.name!=name)

render()

}

function sendAll(){

people.forEach(p=>{
if(!sent.includes(p))
sent.push(p)
})

render()

}

render()

const peopleData = [
{name:"Rahul Sharma",headline:"MBA Candidate | Marketing",img:"https://randomuser.me/api/portraits/men/1.jpg"},
{name:"Priya Patel",headline:"Finance Enthusiast",img:"https://randomuser.me/api/portraits/women/2.jpg"},
{name:"Sofia Khan",headline:"Product Manager",img:"https://randomuser.me/api/portraits/women/3.jpg"},
{name:"John Mathew",headline:"Software Engineer",img:"https://randomuser.me/api/portraits/men/4.jpg"},
{name:"Meera Iyer",headline:"Consulting Aspirant",img:"https://randomuser.me/api/portraits/women/5.jpg"},
{name:"Nina Roy",headline:"Business Analyst",img:"https://randomuser.me/api/portraits/women/6.jpg"},
{name:"Karan Singh",headline:"Startup Founder",img:"https://randomuser.me/api/portraits/men/7.jpg"},
{name:"Aisha Khan",headline:"UX Designer",img:"https://randomuser.me/api/portraits/women/8.jpg"},
{name:"Daniel Lee",headline:"Data Scientist",img:"https://randomuser.me/api/portraits/men/9.jpg"},
{name:"Sneha Kulkarni",headline:"Operations Manager",img:"https://randomuser.me/api/portraits/women/10.jpg"}
]

let sentRequests=[]
let receivedRequests=[peopleData[1],peopleData[3]]

function showSection(section){

document.getElementById("people").classList.add("hidden")
document.getElementById("received").classList.add("hidden")
document.getElementById("sent").classList.add("hidden")

document.getElementById(section).classList.remove("hidden")

render()

}

function render(){

renderPeople()
renderSent()
renderReceived()

}

function createPersonCard(person,buttonType){

const div=document.createElement("div")
div.className="person"

let buttonHTML=""

if(buttonType==="connect"){
buttonHTML=`<button class="connect" onclick="sendRequest('${person.name}')">Connect</button>`
}

if(buttonType==="withdraw"){
buttonHTML=`<button class="withdraw" onclick="withdrawRequest('${person.name}')">Withdraw</button>`
}

if(buttonType==="accept"){
buttonHTML=`<button class="accept" onclick="acceptRequest('${person.name}')">Accept</button>`
}

div.innerHTML=`

<img class="avatar" src="${person.img}">

<div class="person-info">
<div class="name">${person.name}</div>
<div class="headline">${person.headline}</div>
</div>

${buttonHTML}

`

return div
}

function renderPeople(){

const container=document.getElementById("people")
container.innerHTML=""

peopleData.forEach(person=>{

if(!sentRequests.find(p=>p.name===person.name)){
container.appendChild(createPersonCard(person,"connect"))
}

})

}

function renderSent(){

const container=document.getElementById("sent")
container.innerHTML=""

sentRequests.forEach(person=>{
container.appendChild(createPersonCard(person,"withdraw"))
})

}

function renderReceived(){

const container=document.getElementById("received")
container.innerHTML=""

receivedRequests.forEach(person=>{
container.appendChild(createPersonCard(person,"accept"))
})

}

function sendRequest(name){

const person=peopleData.find(p=>p.name===name)
sentRequests.push(person)
render()

}

function withdrawRequest(name){

sentRequests=sentRequests.filter(p=>p.name!==name)
render()

}

function acceptRequest(name){

const person=receivedRequests.find(p=>p.name===name)

receivedRequests=receivedRequests.filter(p=>p.name!==name)

peopleData.push(person)

render()

}

render()

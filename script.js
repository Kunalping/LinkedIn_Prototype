let currentUser = "";
let sentRequests = [];
let receivedRequests = [];

// Dummy people list
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
  "Ananya Das",
  "Rohan Iyer",
  "Meera Nair"
];


// LOGIN FUNCTION
function enterApp() {
  const nameInput = document.getElementById("nameInput").value;

  if (nameInput.trim() === "") {
    alert("Please enter your name");
    return;
  }

  currentUser = nameInput;

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainPage").style.display = "block";

  renderPeople();
}


// TAB SWITCHING
function showTab(tabName) {

  document.getElementById("peopleSection").style.display = "none";
  document.getElementById("receivedSection").style.display = "none";
  document.getElementById("sentSection").style.display = "none";

  document.getElementById(tabName).style.display = "block";

}


// RENDER PEOPLE
function renderPeople() {

  const container = document.getElementById("peopleList");
  container.innerHTML = "";

  people.forEach(person => {

    const card = document.createElement("div");
    card.className = "personCard";

    const name = document.createElement("span");
    name.innerText = person;

    const button = document.createElement("button");

    if (sentRequests.includes(person)) {

      button.innerText = "Pending";
      button.disabled = true;
      button.style.backgroundColor = "#ccc";
      button.style.cursor = "not-allowed";

    } else {

      button.innerText = "Connect";
      button.onclick = () => sendRequest(person, button);

    }

    card.appendChild(name);
    card.appendChild(button);

    container.appendChild(card);

  });

}


// SEND REQUEST
function sendRequest(person, button) {

  sentRequests.push(person);

  button.innerText = "Pending";
  button.disabled = true;
  button.style.backgroundColor = "#ccc";

  renderSentRequests();

}


// RENDER SENT REQUESTS
function renderSentRequests() {

  const container = document.getElementById("sentList");
  container.innerHTML = "";

  sentRequests.forEach(person => {

    const item = document.createElement("div");
    item.className = "personCard";
    item.innerText = person;

    container.appendChild(item);

  });

}


// RENDER RECEIVED REQUESTS
function renderReceivedRequests() {

  const container = document.getElementById("receivedList");
  container.innerHTML = "";

  receivedRequests.forEach(person => {

    const item = document.createElement("div");
    item.className = "personCard";
    item.innerText = person;

    container.appendChild(item);

  });

}


// ME DROPDOWN
function toggleDropdown() {

  const dropdown = document.getElementById("meDropdown");

  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }

}


// CLOSE DROPDOWN IF CLICK OUTSIDE
window.onclick = function(event) {

  if (!event.target.matches('.meButton')) {

    const dropdown = document.getElementById("meDropdown");

    if (dropdown && dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }

  }

};

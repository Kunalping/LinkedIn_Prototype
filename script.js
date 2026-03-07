// Store sent requests
let sentRequests = [];

// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {

    const connectButtons = document.querySelectorAll(".connect-btn");

    connectButtons.forEach(button => {

        button.addEventListener("click", function () {

            if (button.classList.contains("requested")) return;

            const card = button.closest(".person-card");
            const name = card.querySelector(".person-name").innerText;

            // mark request sent
            button.innerText = "Requested";
            button.classList.add("requested");
            button.disabled = true;

            // store request
            sentRequests.push(name);

            addToSentList(name);
            updateCounters();

        });

    });

});


// Add profile to "Req Sent"
function addToSentList(name) {

    const sentContainer = document.getElementById("sentList");

    if (!sentContainer) return;

    const item = document.createElement("div");
    item.className = "person-card";

    item.innerHTML = `
        <div class="person-name">${name}</div>
    `;

    sentContainer.appendChild(item);

}


// Update tab counters
function updateCounters(){

    const sentTab = document.getElementById("sentTab");

    if(sentTab){
        sentTab.innerText = "Req Sent (" + sentRequests.length + ")";
    }

}


// Dropdown toggle for "Me ▼"
function toggleDropdown(){

    const dropdown = document.getElementById("meDropdown");

    if(!dropdown) return;

    if(dropdown.style.display === "block"){
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }

}


// Close dropdown if clicked outside
window.onclick = function(event){

    if(!event.target.closest(".me-menu")){

        const dropdown = document.getElementById("meDropdown");

        if(dropdown){
            dropdown.style.display = "none";
        }

    }

}

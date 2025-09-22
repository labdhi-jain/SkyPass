document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  // ========== Registration ==========
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      fetch("http://localhost:5500/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })
        .then(res => res.json())
        .then(() => {
          alert("✅ Registered successfully!");
          window.location.href = "login.html";
        })
        .catch(err => {
          alert("❌ Registration failed!");
          console.error(err);
        });
    });
  }

  // ========== Login ==========
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      fetch("http://localhost:5500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            alert("✅ Login successful!");
            window.location.href = "dashboard.html";
          } else {
            alert("❌ Invalid credentials");
          }
        })
        .catch(err => {
          alert("❌ Login failed");
          console.error(err);
        });
    });
  }
  init();
});

function init() {
  renderCustomers();
  renderAirlines();
  document.getElementById("airlineForm").addEventListener("submit", handleAirlineSubmit);
}

// Section toggle
function showSection(id) {
  document.querySelectorAll(".dash-section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "customers") {
    renderCustomers();
  } else if (id === "airlines") {
    renderAirlines();
  } else if (id === "trips") {
    renderTickets();
  }
}

// Booking
function bookFlight() {
  const from = document.getElementById("fromCity").value;
  const to = document.getElementById("toCity").value;
  const date = document.getElementById("travelDate").value;
  const airline = document.getElementById("airlineChoice").value;

  if (!from || !to || !date || !airline || airline === "Choose Airline") {
    alert("Please fill all fields.");
    return;
  }

  const ticket = { from, to, date, airline };
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  window.location.href = "payment.html";
  alert("Flight booked successfully!");
  document.getElementById("fromCity").value = "";
  document.getElementById("toCity").value = "";
  document.getElementById("travelDate").value = "";
  document.getElementById("airlineChoice").selectedIndex = 0;
}

// My Bookings
function renderTickets() {
  const list = document.getElementById("ticketList");
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  list.innerHTML = tickets.length
    ? tickets.map(t => `<div class="ticket-card">${t.from} ➡️ ${t.to} on ${t.date} via ${t.airline}</div>`).join("")
    : "<p>No bookings yet.</p>";
}

// Profile
function updateProfile() {
  const name = document.getElementById("profileUsername").value;
  const email = document.getElementById("profileEmail").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex(u => u.email === email);
  if (index !== -1) {
    users[index].username = name;
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("profileStatus").innerText = "Profile updated!";
    renderCustomers(); // Re-render customer list
  } else {
    document.getElementById("profileStatus").innerText = "User not found.";
  }
}

// Customers
function renderCustomers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = users.map(u => `<tr><td>${u.username}</td><td>${u.email}</td></tr>`).join("");
}

// Airlines
function handleAirlineSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("airlineName").value;
  const fleet = document.getElementById("fleetSize").value;
  const routes = document.getElementById("routes").value;

  if (!name || !fleet || !routes) {
    alert("Please fill all airline fields.");
    return;
  }

  const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
  airlines.push({ name, fleet, routes });
  localStorage.setItem("airlines", JSON.stringify(airlines));
  renderAirlines();

  document.getElementById("airlineForm").reset();
}

function renderAirlines() {
  const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
  const tableBody = document.querySelector("#airlineTable tbody");
  tableBody.innerHTML = airlines.map(a => `<tr><td>${a.name}</td><td>${a.fleet}</td><td>${a.routes}</td></tr>`).join("");
}

document.addEventListener('DOMContentLoaded', () => {
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
 
   // ========== Dashboard ==========
   if (window.location.pathname.includes("dashboard.html")) {
     const token = localStorage.getItem("token");
     if (!token) {
       alert("🔒 You must be logged in!");
       window.location.href = "login.html";
     }
 
     fetch("http://localhost:5500/api/user", {
       headers: { Authorization: `Bearer ${token}` }
     })
       .then(res => res.json())
       .then(user => {
         document.getElementById("welcomeUser").innerText = `Welcome, ${user.username}`;
       });
 
     fetch("http://localhost:5500/api/tickets", {
       headers: { Authorization: `Bearer ${token}` }
     })
       .then(res => res.json())
       .then(tickets => {
         const list = document.getElementById("ticketList");
         tickets.forEach(ticket => {
           const item = document.createElement("li");
           item.innerText = `${ticket.flightNumber} → ${ticket.destination} (${ticket.date}) - ${ticket.paid ? "✅ Paid" : "💰 Pay Now"}`;
           if (!ticket.paid) {
             const payBtn = document.createElement("button");
             payBtn.innerText = "Pay";
             payBtn.onclick = () => {
               fetch("http://localhost:5500/api/pay", {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json"
                 },
                 body: JSON.stringify({ ticketId: ticket._id })
               }).then(() => location.reload());
             };
             item.appendChild(payBtn);
           }
           list.appendChild(item);
         });
       });
   }
   
   // ========== Ticket Booking ==========
   if (window.location.pathname.includes("ticket.html")) {
     const bookingForm = document.getElementById("bookingForm");
     if (bookingForm) {
       bookingForm.addEventListener("submit", (e) => {
         e.preventDefault();
         const token = localStorage.getItem("token");
         if (!token) return alert("Please log in");
 
         const flightNumber = document.getElementById("flightNumber").value;
         const destination = document.getElementById("destination").value;
         const date = document.getElementById("date").value;
 
         fetch("http://localhost:5500/api/book", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
           },
           body: JSON.stringify({ flightNumber, destination, date })
         })
           .then(res => res.json())
           .then(() => {
             alert("✈️ Ticket booked!");
             window.location.href = "dashboard.html";
           });
       });
     }
   }
  // Helper: Section Toggle
  window.showSection = (id) => {
    document.querySelectorAll(".dash-section").forEach(section => {
      section.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");

    if (id === "trips") loadBookings();
    if (id === "customers") loadCustomers();
    if (id === "airlines") loadAirlines();
  };

  // ========== Load Bookings ==========
  function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const list = document.getElementById("ticketList");
    if (list) {
      list.innerHTML = bookings.length
        ? bookings.map(b => `<div>${b.from} ➡ ${b.to} on ${b.date} with ${b.airline}</div>`).join('')
        : "<p>No bookings yet.</p>";
    }
  }

  // ========== Book a Flight ==========
  window.bookFlight = () => {
    const from = document.getElementById('fromCity').value;
    const to = document.getElementById('toCity').value;
    const date = document.getElementById('travelDate').value;
    const airline = document.getElementById('airlineChoice').value;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ from, to, date, airline });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    window.location.href = "payment.html";
  };

  // ========== Profile Update ==========
  window.updateProfile = () => {
    document.getElementById('updateProfileBtn').addEventListener('click', () => {
      const username = document.getElementById('profileName').value;
      const email = document.getElementById('profileEmail').value;
    
      // You must already have userId stored from login – if you're using JWT, parse it
      const userId = localStorage.getItem('userId');
    
      fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, username, email})
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert('Profile updated successfully!');
            // optionally update the UI
          } else {
            alert('Failed to update profile.');
          }
        })
        .catch(err => {
          console.error('Profile update error:', err);
          alert('Error occurred while updating profile.');
        });
    });
    
    document.getElementById('profileStatus').innerText = `✔ Updated for ${name} (${email})`;
  };

  function loadCustomers() {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        const customerTable = document.getElementById('customerTable.tbody'); // tbody in your HTML
        customerTable.innerHTML = ''; // clear existing
  
        data.forEach(customer => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${customer.username}</td>
            <td>${customer.email}</td>
          `;
          customerTable.appendChild(row);
        });
      })
      .catch(err => {
        console.error('Error loading customers:', err);
      });
  }
  

  // ========== Airlines ==========
  const airlineForm = document.getElementById('airlineForm');
  if (airlineForm) {
    airlineForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('airlineName').value;
      const fleet = document.getElementById('fleetSize').value;
      const routes = document.getElementById('routes').value;

      fetch("http://localhost:5500/api/airlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, fleet, routes })
      })
        .then(res => res.json())
        .then(() => {
          alert("✅ Airline added!");
          loadAirlines();
          airlineForm.reset();
        })
        .catch(err => {
          alert("❌ Failed to add airline.");
          console.error(err);
        });
    });
  }

  function loadAirlines() {
    fetch("http://localhost:5500/api/airlines", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(airlines => {
        const tbody = document.querySelector('#airlineTable tbody');
        if (tbody) {
          tbody.innerHTML = airlines.map(a =>
            `<tr><td>${a.name}</td><td>${a.fleet}</td><td>${a.routes}</td></tr>`
          ).join('');
        }
      })
      .catch(err => console.error("Failed to load airlines:", err));
  }

  // ========== Auto Load Default Section ==========
  if (document.querySelector('.dash-section')) {
    showSection('book');
  }
});

# SkyPass ✈️

SkyPass is a simple flight booking web application with user registration, login, ticket booking, payment, and dashboard management. It features a Node.js/Express backend with MongoDB and a modern HTML/CSS/JS frontend.

## Features

- User registration and login
- Book flights and view tickets
- Payment simulation
- Dashboard with bookings, customer management, and airline management
- Animated UI with cloud and plane effects

## Project Structure

```
dashboard.html
index.html
login.html
payment.html
register.html
script_1.js
script.js
styles.css
ticket.html
backend/
  .env
  package.json
  server.js
  models/
    Ticket.js
    User.js
  routes/
    auth.js
    payment.js
    ticket.js
images/
  cloud.png
  plane-icon.png
  seamless_clouds.png
  stanley-font/
```

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Edit `backend/.env` for MongoDB URI and port.

3. **Start backend server:**
   ```sh
   npm start
   ```
   The server runs at [http://localhost:5500](http://localhost:5500).

### Frontend

- Open `index.html` in your browser.
- The frontend communicates with the backend via REST API.

## API Endpoints

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive JWT
- `POST /api/book` — Book a ticket (auth required)
- `POST /api/tickets` — Get user tickets (auth required)
- `POST /api/pay` — Pay for a ticket
- `GET /api/customers` — List all customers
- `PUT /api/update-profile` — Update user profile

## Technologies

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## License

MIT

---

Enjoy booking with SkyPass!

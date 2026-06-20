# Event Booking System

A full-stack event seat reservation and booking platform built using React, Node.js, Express, and MongoDB.

## Features

* User Registration and Login (JWT Authentication)
* Browse Available Events
* Interactive Seat Selection
* Reserve Seats for a Limited Time
* No Double Selection of seats possible
* Booking Confirmation
* Automatic Reservation Expiry
* Protected Routes
* Responsive UI using Tailwind CSS
* A global Error Handler to ensure consistent API responses


## Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS
* Axios
* React Toastify
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Running the Backend

cd backend
npm install

Create a `.env` file:

Refer the .env.example file

Start the server:

```bash
npm run dev
```

Backend runs on:


http://localhost:5000


---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:


http://localhost:5173


---

## Adding Events

## Seeding Sample Events

As the assignment did not require a event adding API, I used the seed script to
To populate the database with sample events and seats, to run the script:

```bash
npm run seed
```

This script creates sample events along with their associated seats, allowing the application to be tested immediately without manually creating event data.

Assumption:

* The seed script can be run on an empty database.
* Existing seeded data should be cleared before re-running the script (if applicable).


## Assumptions

* A user can reserve a maximum of 5 seats at a time.
* Reservations expire after 10 minutes if not confirmed.
* Users must be authenticated to reserve or book seats.
* Seat status can be:

  * available
  * reserved
  * booked

---

## Design Decisions

### Preventing Double Booking

To avoid multiple users booking the same seat:

1. Seats are stored as separate documents.
2. During reservation, seat status is updated from `available` to `reserved`.
3. MongoDB transactions are used when confirming bookings.
4. MongoDB transaction sessions prevent two users to book at a same time ,rollbacks and aborts the transaction.
5. Only seats currently marked as `reserved` can be converted to `booked`.
6. Expired reservations are cleaned automatically before booking-related operations using a cleanupFunction
7. Double booking problem can also be avoided using locks on rows or by using redis distributed locks

This ensures that once a seat is reserved by one user, other users cannot reserve or book it simultaneously.

### Reservation Timeout

Reservations are temporary and expire after 10 minutes. If the booking is not confirmed before expiry, the seats become available again.

### Frontend State Recovery

Reservation information is stored in localStorage so that refreshing the page does not lose the active reservation countdown.


### Issues faced and tackled while building the project
* Choosing the method to avoid double booking and making sure it doesnt happen
* Making sure the reserved seats are removed from database after 10mins if a person does not book
* Making sure the expiry timer stays on and user can still book after he/she refreshes the page after reservation

## Future Improvements

* Real-time seat updates using Socket.IO
* Admin dashboard for managing events
* Payment gateway integration
* Booking history page
* API endpoints for adding events and updating them
* A user dashboard for him to check his previous bookings and his profile
* Email confirmations using ingest

---

## Author

Soham More

const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Seat = require("../models/seatModel");
require("dotenv").config();
const connectDB = require("../config/db");


const events = [
  {
    eventName: "Coldplay Concert",
    dateTime: new Date("2026-08-15T19:00:00"),
    venue: "DY Patil Stadium",
    totalSeats: 500,
  },
  {
    eventName: "Tech Conference 2026",
    dateTime: new Date("2026-09-10T10:00:00"),
    venue: "BKC Convention Centre",
    totalSeats: 200,
  },
  {
    eventName: "Standup Comedy Night",
    dateTime: new Date("2026-07-25T20:00:00"),
    venue: "NCPA Mumbai",
    totalSeats: 100,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    // Optional: clear old data
    await Seat.deleteMany({});
    await Event.deleteMany({});

    for (const eventData of events) {
      const event = await Event.create(eventData);

      const seats = [];

      for (let i = 1; i <= event.totalSeats; i++) {
        seats.push({
          eventId: event._id,
          seatNumber: i,
          status: "available",
        });
      }

      await Seat.insertMany(seats);

      console.log(
        `${event.eventName} created with ${event.totalSeats} seats`
      );
    }

    console.log("Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDatabase();
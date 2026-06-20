import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import  api  from "../api/client";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f17] via-[#12131c] to-[#0a0a12] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-2">
          Now Booking
        </h1>

        <p className="text-gray-400 mb-10">
          Pick a show, then reserve your seats.
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!events.length && !error && (
          <p className="text-gray-400">Loading events...</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const left = ev.availableSeats;
            const total = ev.totalSeats;
            const soldOut = left === 0;

            return (
              <Link
                key={ev._id}
                to={soldOut ? "#" : `/events/${ev._id}`}
                onClick={(e) => soldOut && e.preventDefault()}
                className={`group rounded-2xl border border-gray-800 bg-[#171821] p-5 transition-all duration-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 ${
                  soldOut ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {ev.eventName}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {ev.venue}
                  </p>
                </div>

                <p className="mt-4 text-yellow-400 text-sm font-medium">
                  {formatDate(ev.dateTime)}
                </p>

                <p className="mt-4 text-gray-300 text-sm line-clamp-3">
                  {ev.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                  <span
                    className={`text-sm font-medium ${
                      soldOut
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {soldOut
                      ? "SOLD OUT"
                      : `${left} / ${total} seats left`}
                  </span>

                  {!soldOut && (
                    <span className="text-yellow-400 font-semibold group-hover:translate-x-1 transition-transform">
                      Reserve →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
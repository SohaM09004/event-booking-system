import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { toast } from "react-toastify";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reserved, setReserved] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [reservationId, setReservationId] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    const savedReservation = localStorage.getItem(
        `reservation-${id}`
    );

    if (!savedReservation) return;

    const data = JSON.parse(savedReservation);

    if (
        new Date(data.expiresAt).getTime() >
        new Date().getTime()
    ) {
        setReservationId(data.reservationId);
        setExpiresAt(data.expiresAt);
        setReserved(true);
    } else {
        localStorage.removeItem(`reservation-${id}`);
    }
    }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);

      setEvent(res.data.event);
      setSeats(res.data.seats);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "available" || reserved) return;

    const alreadySelected =
      selectedSeats.includes(seat.seatNumber);

    if (alreadySelected) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => s !== seat.seatNumber
        )
      );
      return;
    }

    if (selectedSeats.length >= 5) {
      toast.error("Maximum 5 seats can be selected");
      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seat.seatNumber,
    ]);
  };

  const reserveSeats = async () => {
    try {
      const res = await api.post("/reservations", {
        eventId: id,
        seatNumbers: selectedSeats,
      });

      setReserved(true);
      setExpiresAt(res.data.expiresAt);
      setReservationId(res.data.reservationId);

      localStorage.setItem(`reservation-${id}`,
      JSON.stringify({
        reservationId: res.data.reservationId,
        expiresAt: res.data.expiresAt,
      })
      );

      setSeats((prev) =>
        prev.map((seat) =>
          selectedSeats.includes(seat.seatNumber)
            ? { ...seat, status: "reserved" }
            : seat
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reservation Failed"
      );

      fetchEvent();
    }
  };

  const confirmBooking = async () => {
  try {
    await api.post("/reservations/bookings", {
      reservationId,
    });

    toast.success("Booking Confirmed!");

    setReserved(false);
    setExpiresAt(null);
    setReservationId(null);
    setShowConfirmModal(false);
    localStorage.removeItem(`reservation-${id}`);

    await fetchEvent();

    setSelectedSeats([]);
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Booking Failed"
    );
  }
};

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff =
        new Date(expiresAt).getTime() -
        new Date().getTime();

      if (diff <= 0) {
        clearInterval(interval);

        localStorage.removeItem(`reservation-${id}`);

        setReserved(false);
        setExpiresAt(null);
        setSelectedSeats([]);

        fetchEvent();
        return;
      }

      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${mins}:${secs
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">


        <button
          onClick={() => navigate("/events")}
          className="mb-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          ← Back to Events
        </button>


        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            {event.eventName}
          </h1>

          <p className="text-gray-400 mt-2">
            {event.venue}
          </p>

          <p className="text-indigo-400">
            {new Date(
              event.dateTime
            ).toLocaleString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

         

          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800">

            

            <div className="mb-10">
              <div className="h-4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

              <p className="text-center mt-2 text-gray-400 tracking-widest">
                STAGE
              </p>
            </div>

            

            <div className="grid grid-cols-8 gap-3 justify-center">

              {seats.map((seat) => {
                const selected =
                  selectedSeats.includes(
                    seat.seatNumber
                  );

                const limitReached =
                  selectedSeats.length >= 5 &&
                  !selected;

                return (
                  <button
                    key={seat._id}
                    disabled={
                      reserved ||
                      seat.status !==
                        "available" ||
                      limitReached
                    }
                    onClick={() =>
                      toggleSeat(seat)
                    }
                    className={`
                      h-12 w-12 rounded-lg font-semibold
                      transition-all duration-200

                      ${
                        selected
                        ? "bg-indigo-600 scale-105"
                        : seat.status === "available"
                        ? "bg-slate-700 hover:bg-slate-600 hover:scale-105"
                        : seat.status === "reserved"
                        ? "bg-yellow-500"
                        : seat.status === "booked"
                        ? "bg-green-600"
                        : "bg-red-600"
                        }

                      ${
                        reserved ||
                        seat.status !==
                          "available" ||
                        limitReached
                          ? "cursor-not-allowed opacity-70"
                          : ""
                      }
                    `}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>

            {/* Legend */}

            <div className="flex flex-wrap gap-6 mt-8">
              <Legend
                color="bg-slate-700"
                text="Available"
              />
              <Legend
                color="bg-indigo-600"
                text="Selected"
              />
              <Legend
                color="bg-yellow-500"
                text="Reserved"
              />
              <Legend
                color="bg-green-600"
                text="Booked"
              />
            </div>
          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit sticky top-5">

            <h2 className="text-2xl font-bold mb-2">
              🎟 Booking Summary
            </h2>

            <p className="text-gray-400 mb-6">
              Select up to 5 seats
            </p>

            <div className="space-y-4">

              <div>
                <p className="text-gray-400">
                  Selected Seats
                </p>

                <p className="font-semibold">
                  {selectedSeats.length
                    ? selectedSeats.join(
                        ", "
                      )
                    : "None"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Total Seats
                </p>

                <p>{selectedSeats.length}</p>
              </div>

              <div>
                <p className="text-gray-400">
                  Remaining Selection
                </p>

                <p>
                  {5 -
                    selectedSeats.length}{" "}
                  / 5
                </p>
              </div>

              {reserved && (
                <div className="bg-yellow-500/20 border border-yellow-500 p-4 rounded-xl">

                  <p className="font-semibold">
                    Reserved Successfully
                  </p>

                  <p className="text-yellow-400 mt-2 text-lg font-bold">
                    ⏳ {timeLeft}
                  </p>

                </div>
              )}

              {!reserved ? (
                <button
                  disabled={
                    selectedSeats.length === 0
                  }
                  onClick={reserveSeats}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700"
                >
                  Reserve Seats
                </button>
              ) : (
                <button
                     onClick={() => setShowConfirmModal(true)}
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700"
                >
                    Book Now
                </button>
              )}
            </div>
          </div>
        </div>
        {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[400px]">
            <h2 className="text-2xl font-bold mb-4">
              Confirm Booking
            </h2>

            <p className="text-gray-400 mb-3">
              You are about to book:
            </p>

            <div className="mb-5 text-yellow-400 font-semibold">
              Seats {selectedSeats.join(", ")}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
 
    );
}


function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-4 w-4 rounded ${color}`}
      />
      <span className="text-sm text-gray-300">
        {text}
      </span>
    </div>
  );
}
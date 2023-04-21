import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(()=>{
    if(user){
      setFullName(user.name)
    }
  },[user])

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    console.log(fullName, mobileNumber);
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      guests,
      fullName,
      mobileNumber,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className=" py-3 px-4">
            <label>Check in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className=" py-3 px-4 border-t">
            <label>Check out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className=" py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={guests}
            onChange={(ev) => setGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className=" py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(ev) => setMobileNumber(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && <span>${numberOfNights * place.price}</span>}
      </button>
    </div>
  );
};

export default BookingWidget;

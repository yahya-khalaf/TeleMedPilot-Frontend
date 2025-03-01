"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import AppointmentsGrid from "./AppointmentsGrid";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Appointments = () => {
  const { profileData } = useProfile();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/Doctor/profile/appointments`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.length > 0) {
          setAppointments(response);
        } else {
          setAppointments([]); // Set to an empty array if there are no appointments
        }
      })
      .catch((error) => {
        console.error("Error fetching appointments: ", error);
        setAppointments([]); // Handle error by setting an empty array
      })
      .finally(() => setLoading(false));
  }, [profileData]);
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <CircularProgress />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center my-4">No profile data available.</div>
    );
  }
  return (
    <div className="flex flex-col m-4 p-7">
      {appointments?.length > 0 ? (
        <AppointmentsGrid appointments={appointments} />
      ) : (
        <div className="flex justify-center text-xl font-semibold">
          No appointments available
        </div>
      )}
    </div>
  );
};

export default Appointments;
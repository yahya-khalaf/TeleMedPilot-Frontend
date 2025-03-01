"use client";
import React, { useEffect, useState } from "react";
import AppointmentsGrid from "./AppointmentsGrid";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Appointments: React.FC = () => {
  const { profileData, loading } = useProfile();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/profile/appointments`,
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
      .then((response) => setAppointments(response.appointments));
  }, []);
  console.log("Appointments: ", appointments);

  return (
    <div className="m-4  flex flex-col">
      {appointments?.length > 0 ? (
        <AppointmentsGrid
          appointments={appointments}
          profileData={profileData}
        />
      ) : (
        <p className="font-semibold">
          {loading ? "Loading..." : "Your upcoming appointments will appear here."}
        </p>
      )}
    </div>
  );
};

export default Appointments;

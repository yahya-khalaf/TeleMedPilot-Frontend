"use client";
import React, { useEffect, useState } from "react";
import PendingGrid from "./pendingGrid";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Pendingappointments: React.FC = () => {
  const { profileData, loading } = useProfile();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/pendingappointments`,
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
        <PendingGrid
          appointments={appointments}
          profileData={profileData}
        />
      ) : (
        <p className="font-semibold">
          {loading ? "Loading..." : "Your pending appointments will appear here."}
        </p>
      )}
    </div>
  );
};

export default Pendingappointments;

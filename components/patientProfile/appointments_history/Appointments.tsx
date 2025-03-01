"use client";
import React, { useEffect, useState } from "react";
import AppointmentsGrid from "./AppointmentsGrid";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Appointments: React.FC = () => {
  const { profileData } = useProfile();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/appointmentsHistory`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAppointments(data?.appointments);
        console.log('appointments', data);
        
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col m-4">
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : appointments?.length > 0 ? (
        <AppointmentsGrid appointments={appointments} profileData={profileData} />
      ) : (
        <p className="font-semibold">No Appointment History Available</p>
      )}
    </div>
  );
};

export default Appointments;

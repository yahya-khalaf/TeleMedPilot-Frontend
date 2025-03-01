import React from "react";
import PendingCard from "./PendingCard";

const PendingGrid = ({
  appointments,
  profileData,
}: {
  appointments: any[];
  profileData: any;
}) => {
  let appointmentList = appointments.map((appointment) => {
    return (
      <PendingCard
        appointment={appointment}
        key={appointment.appointment_id}
        profileData={profileData}
      />
    );
  });
  return (
    <div className="col-span-2 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {appointmentList}
      </div>
    </div>
  );
};

export default PendingGrid;

import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from "../../../utils/date";
import HistoryDetails from "./HistoryDetails";
import { Rating } from 'primereact/rating';

const AppointmentCard = ({
  appointment,
  profileData,
}: {
  appointment: any;
  profileData: any;
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col space-y-3 border border-gray-200">
      {/* Patient Information */}
      <div className="flex items-center space-x-4">
        <FaUserCircle className="h-20 w-20 text-[#035fe9]" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">
            {`${appointment.patient_first_name} ${appointment.patient_last_name}`}
          </h2>
          <p className="text-sm text-[#035fe9] font-medium">
            {"Patient"}
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="text-sm text-gray-600 space-y-2">
        <p>
          <strong>Date:</strong>{" "}{appointment.doctor_availability_day_hour && formatDate(appointment.doctor_availability_day_hour)}
        </p>
        <p>
          <strong>Duration:</strong> {appointment.appointment_duration} min
        </p>
        <p>
          <strong>Type:</strong> {appointment.appointment_type}
        </p>

      </div>
            
      {/* Follow-Up Button */}
      <HistoryDetails appointment={appointment} />

    </div>
  );
};

export default AppointmentCard;

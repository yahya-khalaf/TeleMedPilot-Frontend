import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from "../../../utils/date";
import ReadMore from "../../common/ReadMore";
import VideoCallButton from "@/components/common/VideoCallButton";
import { useRouter } from "next/navigation";

const PendingCard = ({
  appointment,
  profileData,
}: {
  appointment: any;
  profileData: any;
}) => {
  const userImage = <FaUserCircle className="h-20 w-20 text-[#035fe9]" />;
  const [showButton, setShowButton] = useState(false); // New state for button visibility
  const router = useRouter(); // Initialize the router
  const [userRole, setUserRole] = useState<any>();

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    console.log("aappp", appointment)
  }, [userRole]);

  const handleAskForDetails = () => {
    localStorage.setItem("chat_appointmentId", appointment.appointment_id);
    localStorage.setItem("chat_doctorId", appointment.appointment_doctor_id);
    localStorage.setItem("chat_doctor_firstname", appointment.doctor_first_name);
    localStorage.setItem("chat_doctor_lastname", appointment.doctor_last_name);
    router.push(`/patientProfile/chat`);
  };

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_NAME}/appointment-chat/${appointment.appointment_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            mode: "cors",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setShowButton(true); // Show the button if response is 200

        } else {
          console.error("No chat to view");
          setShowButton(false); // Hide the button if there's an error
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        setShowButton(false); // Hide the button if there's an error

        // Handle the error, e.g., display an error message
      }
    };

    fetchAppointmentData();
  }, [appointment.appointment_id]); // Run effect when appointment_id changes

  // Buffer to Base64 conversion for the doctor's image
  const bufferToBase64 = (buffer: number[]) => {
    const binary = String.fromCharCode.apply(null, buffer);
    return window.btoa(binary);
  };

  const base64Image = appointment.image
    ? `data:image/jpeg;base64,${bufferToBase64(appointment.image.data)}`
    : ""; // Placeholder for missing image

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg flex flex-col space-y-3">
      <div className="flex items-center space-x-4">
        {base64Image ? (
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={base64Image}
            alt="Doctor"
          />
        ) : (
          userImage
        )}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{`Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</h2>
          <p className="text-sm text-[#035fe9]">
            {appointment.doctor_specialization || "Specialist"}
          </p>
        </div>
      </div>

      {/* Patient Information */}
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-600">
          <strong>Patient:</strong>{" "}
          {`${appointment.patient_first_name} ${appointment.patient_last_name}`}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Appointment Type:</strong>{" "}
            {appointment.appointment_type || "N/A"}
          </p>
          <div>
            <strong>Complaint:</strong>{" "}
            {appointment.appointment_complaint ? (
              <ReadMore text={appointment.appointment_complaint} />

            ) : (
              "N/A"
            )}
          </div>
          <p>
            <strong>Settings Type:</strong>{" "}
            {appointment.appointment_settings_type || "N/A"}
          </p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {appointment.doctor_availability_day_hour &&
              formatDate(appointment.doctor_availability_day_hour)}
          </p>
          <p>
            <strong>Duration:</strong> {appointment.appointment_duration} min
          </p>
          <p>
            <strong>State: </strong>
            Not confirmed
          </p>
          {showButton && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAskForDetails}
              >
              Answer Doctor Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingCard;

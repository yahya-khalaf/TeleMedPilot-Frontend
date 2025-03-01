import React, { useEffect, useState, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { formatDate } from "../../../utils/date";
import stylesButton from "../../navbarComp/navbar.module.css";
import ReadMore from "../../common/ReadMore";
import 'primereact/resources/primereact.min.css';
import ReviewDialog from './ReviewDialog';

interface HistoryDetailsProps {
  appointment: any;
}

const HistoryDetails: React.FC<HistoryDetailsProps> = ({ appointment }) => {
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const fetchAppointmentDetails = useCallback(async () => {
    if (appointment?.appointment_id) {
      setLoading(true);
      setError(null);

      try {
   
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const url = `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/appointmentdetails/${appointment.appointment_id}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Appointment Details Response:', data);
        
        if (data && data.appointment) {
          setAppointmentDetails(data.appointment);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setError(error instanceof Error ? error.message : "Error fetching appointment details");
      } finally {
        setLoading(false);
      }
    }
  }, [appointment]);

  useEffect(() => {
    if (showDialog) {
      fetchAppointmentDetails();
    }
  }, [showDialog, appointment, fetchAppointmentDetails]);


  return (
    <>
      <div className="flex gap-2">
        <button
          className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg w-full`}
          onClick={() => setShowDialog(true)}
        >
          View Details
        </button>
        
        {!appointment.appointment_review_communication_rating &&
         !appointment.appointment_review_understanding_rating &&
         !appointment.appointment_review_providing_solutions_rating &&
         !appointment.appointment_review_commitment_rating && (
          <ReviewDialog
            appointmentId={appointment.appointment_id}
            doctorId={appointment.appointment_doctor_id}
          />
        )}
      </div>

     <Dialog
        className="bg-opacity-100 bg-gray-50 rounded-lg shadow-2xl"
        style={{
          width: "90vw",
          minHeight: "200px",
          maxWidth: "600px",
          padding: "1rem",
          zIndex: 1000,
        }}
        header="Appointment Details"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        footer={
          <button
            className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white mt-2 py-2 px-4 rounded-lg disabled:opacity-50`}
            onClick={() => setShowDialog(false)}
          >
            Back
          </button>
        }
      >
        {loading ? (
          <p className="mt-4 text-center text-gray-500">
            Loading appointment details...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : appointmentDetails ? (
          <Card
            title={`Dr. ${appointmentDetails.doctor_first_name} ${appointmentDetails.doctor_last_name}`}
          >
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <strong>Specialization:</strong>{" "}
                {appointmentDetails.doctor_specialization}
              </div>
              <div>
                <strong>Appointment Type:</strong>{" "}
                {appointmentDetails.appointment_type}
              </div>
              <div>
                <strong>Date & Time:</strong>{" "}
                {appointmentDetails.doctor_availability_day_hour &&
                  formatDate(appointmentDetails.doctor_availability_day_hour)}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {appointmentDetails.appointment_duration} min
              </div>

              {/* Treatment Plan */}
              {Object.values(appointmentDetails.treatmentPlan).includes("") || Object.values(appointmentDetails.treatmentPlan).length === 0 ? (
                <div>
                <strong>Treatment Plan:</strong> No treatment plan available
              </div>
              ) : (
                <div>
                <strong>Treatment Plan:</strong>{" "}
                {appointmentDetails.treatmentPlan.treatment_plan_operations}
              </div>
              )}

                {/* Appointment Status and Complaint */}
                  <div className="flex gap-2 flex-col">
                  <div>
                    <strong>Status:</strong>{" "}
                    {appointmentDetails.appointment_status}
                  </div>
                  <div>
                    <strong>Complaint:</strong>{" "}
                    {appointmentDetails.appointment_complaint ? (
                      <ReadMore
                        text={appointmentDetails.appointment_complaint}
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              

              {/* Appointment Results */}
              {appointmentDetails.appointmentResults &&
                appointmentDetails.appointmentResults.length > 0 ? (
                  <div className="flex gap-2 flex-col">
                    <strong>Appointment Results:</strong>
                    {appointmentDetails.appointmentResults.map(
                      (result: any, index: number) => (
                        <div key={index}>

                        <u>Diagnosis: </u>
                        <p>
                          {result.appointment_diagnosis} <br />
                        </p>

                        <u>Report: </u>
                        <p>
                          {result.appointment_report} <br />
                        </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div>
                     <strong>Appointment Results: </strong>
                     No results available
                  </div>
                 
                  
                )}

              {/* Medications */}
            </div>
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              {appointmentDetails.medications &&
                appointmentDetails.medications.length > 0 ? (
                  <div>
                    <strong>Medications:</strong>
                    {appointmentDetails.medications.map(
                      (med: any, index: number) => (
                        <p key={index}>
                          {med.medication_name}: {med.medication_dosage} <br />
                          From {formatDate(med.medication_start_date)} to{" "}
                          {formatDate(med.medication_end_date)} <br />
                          Note: {med.medication_note}
                        </p>
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    <strong>Medications:</strong> No medications available
                  </div>
                )}
            </div>
          </Card>
        ) : (
          <p className="mt-4 text-center text-gray-500">
            No appointment details available.
          </p>
        )}
      </Dialog>

      <style jsx global>{`
        /* Base star styling */
        .p-rating .p-rating-item .p-rating-icon {
          font-size: 1.5rem;
          color: #64748B !important;
          transition: all 0.2s ease;
        }
        
        /* Active (selected) star styling */
        .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
          color: #FCD34D !important;
          filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.3));
        }

        /* Star spacing and size */
        .p-rating .p-rating-item {
          margin: 0 0.2rem;
          cursor: default;
        }

        /* Container spacing */
        .p-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default HistoryDetails;

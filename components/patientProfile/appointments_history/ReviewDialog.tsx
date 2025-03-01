import React, { useState } from 'react';
import { Dialog } from "primereact/dialog";
import { Rating } from 'primereact/rating';
import stylesButton from "../../navbarComp/navbar.module.css";

interface ReviewDialogProps {
  appointmentId: number;
  doctorId: number;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  appointmentId,
  doctorId,
}) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [ratings, setRatings] = useState({
    communication_rating: 0,
    understanding_rating: 0,
    providing_solution_rating: 0,
    commitment_rating: 0
  });

  // Submit review with correct endpoint and body structure
  const handleSubmitReview = async () => {
    const requestBody = {
      doctorId: doctorId,
      ...ratings
    }

    console.log('Submitting review with body:', requestBody);
    console.log('To appointment ID:', appointmentId);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/${appointmentId}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        }
      );

      console.log('Review submission response:', response);
      const data = await response.json();
      console.log('Review submission data:', data);

      if (response.ok) {
        setShowReviewDialog(false);
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleCloseReviewDialog = () => {
    setShowReviewDialog(false);
    setRatings({
      communication_rating: 0,
      understanding_rating: 0,
      providing_solution_rating: 0,
      commitment_rating: 0
    });
  };

  return (
    <>
      <button
        className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg w-full`}
        onClick={() => setShowReviewDialog(true)}
      >
        Add Review
      </button>

      <Dialog
        className="bg-opacity-100 bg-gray-50 rounded-lg shadow-2xl"
        style={{
          width: "90vw",
          maxWidth: "600px",
          minHeight: "400px",
          padding: "2rem",
          zIndex: 1000,
        }}
        header={<span className="text-2xl font-semibold">Review Doctor</span>}
        visible={showReviewDialog}
        onHide={handleCloseReviewDialog}
        footer={
          <div className="flex gap-2 justify-end">
            <button
              className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg`}
              onClick={handleCloseReviewDialog}
            >
              Back
            </button>
            <button
              className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg`}
              onClick={handleSubmitReview}
            >
              Submit
            </button>
          </div>
        }
      >
        {/* Rating Dialog Content */}
        <div className="flex flex-col gap-8 p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Communication:</span>
            <Rating
              value={ratings.communication_rating}
              onChange={(e) => setRatings(prev => ({ ...prev, communication_rating: e.value || 0 }))}
              stars={5}
              cancel={false}
              className="text-2xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Understanding:</span>
            <Rating
              value={ratings.understanding_rating}
              onChange={(e) => setRatings(prev => ({ ...prev, understanding_rating: e.value || 0 }))}
              stars={5}
              cancel={false}
              className="text-2xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Problem Solving:</span>
            <Rating
              value={ratings.providing_solution_rating}
              onChange={(e) => setRatings(prev => ({ ...prev, providing_solution_rating: e.value || 0 }))}
              stars={5}
              cancel={false}
              className="text-2xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Commitment:</span>
            <Rating
              value={ratings.commitment_rating}
              onChange={(e) => setRatings(prev => ({ ...prev, commitment_rating: e.value || 0 }))}
              stars={5}
              cancel={false}
              className="text-2xl"
            />
          </div>
        </div>
      </Dialog>

      <style jsx global>{`
        /* Base star styling */
        .p-rating .p-rating-item .p-rating-icon {
          font-size: 1.5rem;
          color: #64748B !important; /* Changed to a darker gray */
          transition: all 0.2s ease;
        }
        
        /* Active (selected) star styling */
        .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
          color: #FCD34D !important; /* Warmer yellow color */
          filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.3));
        }

        /* Hover effect */
        .p-rating .p-rating-item:hover .p-rating-icon {
          color: #FBBF24 !important; /* Slightly darker yellow on hover */
          transform: scale(1.1);
        }

        /* Star spacing and size */
        .p-rating .p-rating-item {
          margin: 0 0.2rem;
          cursor: pointer;
        }

        /* Read-only stars */
        .p-rating.p-readonly .p-rating-item .p-rating-icon {
          cursor: default;
        }

        .p-rating.p-readonly .p-rating-item:hover .p-rating-icon {
          transform: none;
        }

        /* Container spacing */
        .p-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .p-rating .p-rating-item {
          transform: scale(1.5);
          margin: 0 0.5rem;
        }
      `}</style>
    </>
  );
};

export default ReviewDialog; 
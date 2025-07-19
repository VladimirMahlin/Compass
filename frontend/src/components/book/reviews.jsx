// src/components/book/reviews.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import Postcard from "../shared/Postcard";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";
import { fetchData } from "../../utils/api";

const Reviews = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const reviewsData = await fetchData(`posts/book/${bookId}`);

        if (isMounted) {
          if (Array.isArray(reviewsData)) {
            const reviewsWithUser = await Promise.all(
              reviewsData.map(async (review) => {
                try {
                  const userData = await fetchData(`users/${review.user_id}`);
                  return { ...review, user: userData };
                } catch (userError) {
                  console.error(
                    `Failed to fetch user data for review ${review._id}:`,
                    userError.message,
                  );
                  return {
                    ...review,
                    user: { name: "Unknown User", avatar: "" },
                  };
                }
              }),
            );
            setReviews(reviewsWithUser);
          } else {
            setReviews([]);
            setError("Failed to load reviews.");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching reviews:", error.message);
          setError("Failed to fetch reviews. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [bookId]);

  const handleDelete = async (reviewId) => {
    try {
      await fetchData(`posts/${reviewId}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error.message);
      setError("Failed to delete the review. Please try again later.");
    }
  };

  const handleEdit = async (reviewId, updatedData) => {
    try {
      const updatedReview = await fetchData(`posts/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      setReviews(
        reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r)),
      );
    } catch (error) {
      console.error("Error updating review:", error.message);
      setError("Failed to update the review. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="mb-5">
      <h2 className="text-center mb-4">Book Reviews</h2>

      {reviews.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Alert variant="info">No reviews available for this book.</Alert>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {reviews.map((review, index) => (
            <Col key={index}>
              <Postcard
                review={review}
                showUserInfo={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Reviews;

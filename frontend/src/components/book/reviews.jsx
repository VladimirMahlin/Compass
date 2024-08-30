import React, { useEffect, useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import Postcard from "../shared/Postcard";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";

const Reviews = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/book/${bookId}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();

        if (isMounted) {
          if (response.ok && Array.isArray(data)) {
            const reviewsWithUser = await Promise.all(
              data.map(async (review) => {
                const userResponse = await fetch(
                  `http://localhost:3001/api/users/${review.user_id}`,
                );
                const userData = await userResponse.json();
                return { ...review, user: userData };
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
          console.error("Error fetching reviews:", error);
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
      const response = await fetch(
        `http://localhost:3001/api/posts/${reviewId}`,
        { method: "DELETE", credentials: "include" },
      );

      if (!response.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Failed to delete the review. Please try again later.");
    }
  };

  const handleEdit = async (reviewId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/posts/${reviewId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to update review");

      const updatedReview = await response.json();
      setReviews(
        reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r)),
      );
    } catch (error) {
      console.error("Error updating review:", error);
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

import React, { useEffect, useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import Postcard from "../shared/Postcard";
import Loading from "../shared/Loading";

const Reviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/user/${user.id}`,
          {
            credentials: "include",
          },
        );
        const reviewsData = await response.json();
        if (response.ok) {
          const reviewsWithUser = reviewsData.map((review) => ({
            ...review,
            user: user,
          }));
          setReviews(reviewsWithUser);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

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
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mb-5">
      <h2 className="text-center mb-4">User Reviews</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Col key={index}>
              <Postcard
                review={review}
                showUserInfo={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info">No reviews available.</Alert>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Reviews;

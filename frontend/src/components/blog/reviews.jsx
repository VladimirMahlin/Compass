import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Container } from "react-bootstrap";
import Postcard from "../shared/Postcard";
import LoadingSpinner from "../shared/Loading";

const BlogReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/all`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const reviewsData = await response.json();

        const reviewsWithUser = await Promise.all(
          reviewsData.map(async (review) => {
            const userResponse = await fetch(
              `http://localhost:3001/api/users/${review.user_id}`,
            );
            if (!userResponse.ok) {
              throw new Error(
                `Failed to fetch user data for review: ${review._id}`,
              );
            }
            const userData = await userResponse.json();
            return { ...review, user: userData };
          }),
        );
        setReviews(reviewsWithUser);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

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
      setError("Failed to delete the review. Please try again.");
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
      setError("Failed to update the review. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">All User Reviews</h2>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      <Row xs={1} md={2} lg={3} className="g-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Col key={index} className="mb-4">
              <Postcard
                review={review}
                showUserInfo={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Col>
          ))
        ) : !error ? (
          <Col xs={12}>
            <Alert variant="info" className="mt-3 p-4">
              No reviews available.
            </Alert>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
};

export default BlogReviews;

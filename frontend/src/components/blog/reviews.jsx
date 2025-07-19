import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Container } from "react-bootstrap";
import Postcard from "../shared/Postcard";
import LoadingSpinner from "../shared/Loading";
import { fetchData } from "../../utils/api";

const BlogReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const reviewsData = await fetchData(`posts/all`);
        if (!Array.isArray(reviewsData)) {
          throw new Error("Invalid data format for reviews.");
        }

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
              return { ...review, user: { name: "Unknown User", avatar: "" } };
            }
          }),
        );
        setReviews(reviewsWithUser);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      await fetchData(`posts/${reviewId}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error.message);
      setError("Failed to delete the review. Please try again.");
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
      setError("Failed to update the review. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">All User Reviews</h2>

      {reviews.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Alert variant="info">No reviews available.</Alert>
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
    </Container>
  );
};

export default BlogReviews;

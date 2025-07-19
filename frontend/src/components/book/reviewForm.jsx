// src/components/book/reviewForm.jsx
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import LoadingSpinner from "../shared/Loading";
import { fetchData } from "../../utils/api"; // Import fetchData

function ReviewForm({ bookId, userId }) {
  const [review, setReview] = useState({
    title: "",
    content: "",
    user_id: userId,
    book_id: bookId,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fetchData("posts", {
        method: "POST",
        body: JSON.stringify(review),
      });
      setSuccess("Review submitted successfully");
      setReview({ ...review, title: "", content: "" });
    } catch (error) {
      setError(error.message || "Error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="my-4">
      <h2>Leave a Review</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group className="mb-3" controlId="reviewTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={review.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="reviewContent">
        <Form.Label>Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={review.content}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <LoadingSpinner size="sm" /> : "Submit Review"}{" "}
      </Button>
    </Form>
  );
}

export default ReviewForm;

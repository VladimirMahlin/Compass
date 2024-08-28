import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import LoadingSpinner from "../shared/Loading";

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
    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });
      if (response.ok) {
        setSuccess("Review submitted successfully");
        setReview({ ...review, title: "", content: "" });
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      setError(`Error submitting review: ${error.message}`);
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

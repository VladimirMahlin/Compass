import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";

function BookInformation({ book, userId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/books/favorites/check`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ book_id: book.id, user_id: userId }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to check favorite status");
        }

        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        setError("Failed to check favorite status");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkIfFavorite();
    } else {
      setLoading(false);
    }
  }, [book.id, userId]);

  const handleFavoriteToggle = async () => {
    try {
      const url = `http://localhost:3001/api/books/favorites`;
      const method = isFavorite ? "DELETE" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: book.id, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setError("Failed to update favorite status");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Image src={book.cover_link} alt={book.title} fluid />
        </Col>
        <Col md={8}>
          <h1>{book.title}</h1>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Date Published:</strong> {book.date_published || "Unknown"}
          </p>
          <h5>Description:</h5>
          <p>{book.description}</p>
          {userId && (
            <Button
              variant={isFavorite ? "danger" : "primary"}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BookInformation;

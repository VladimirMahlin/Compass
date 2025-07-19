import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";
import { fetchData } from "../../utils/api";

function BookInformation({ book, userId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const data = await fetchData("books/favorites/check", {
          method: "POST",
          body: JSON.stringify({ book_id: book.id, user_id: userId }),
        });
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error.message);
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
      const endpoint = `books/favorites`;
      const method = isFavorite ? "DELETE" : "POST";

      await fetchData(endpoint, {
        method: method,
        body: JSON.stringify({ book_id: book.id, user_id: userId }),
      });

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error.message);
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

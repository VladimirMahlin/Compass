import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";
import { fetchData } from "../../utils/api";

function FavoriteBooks({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await fetchData(`books/favorites/${userId}`);
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorite books:", error.message);
        setError("Failed to fetch favorite books.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="mb-5">
      <h2 className="text-center mb-4">Favorite Books</h2>

      {favorites.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center">
          <Alert variant="info">No favorite books yet.</Alert>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {favorites.map((data, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm hover-shadow">
                <Link to={`/book/${data.id}`} className="text-decoration-none">
                  <Card.Img
                    variant="top"
                    src={data.cover_link}
                    alt={data.title}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      {data.title}
                    </Card.Title>
                    <Card.Text className="text-muted">{data.author}</Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FavoriteBooks;

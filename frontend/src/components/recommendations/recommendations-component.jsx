import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Col,
  Row,
  Tabs,
  Tab,
  Accordion,
  Card,
  ListGroup,
} from "react-bootstrap";
import { FaPlus, FaMinus, FaBook, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import uniqueGenres from "./unique_genres.json";
import bookTitlesData from "./book_titles.json";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";

function RecommendationsComponent({ userId }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [bookTitles1, setBookTitles1] = useState([""]);
  const [bookTitleSuggestions, setBookTitleSuggestions] = useState([[]]);
  const [genre, setGenre] = useState("");
  const [genreSuggestions, setGenreSuggestions] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/recommendations/${userId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (e) => {
    const userInput = e.target.value;
    setGenre(userInput);

    if (userInput.length > 0) {
      const suggestions = uniqueGenres.filter((g) =>
        g.toLowerCase().startsWith(userInput.toLowerCase()),
      );
      setGenreSuggestions(suggestions);
    } else {
      setGenreSuggestions([]);
    }
  };

  const handleGenreClick = (suggestedGenre) => {
    setGenre(suggestedGenre);
    setGenreSuggestions([]);
  };

  const handleBookTitleChange = (e, index) => {
    const userInput = e.target.value;
    setBookTitles1((prev) => prev.map((t, i) => (i === index ? userInput : t)));

    if (userInput.length > 0) {
      const suggestions = bookTitlesData.filter((title) =>
        title.toLowerCase().startsWith(userInput.toLowerCase()),
      );
      setBookTitleSuggestions((prev) =>
        prev.map((suggestionsList, i) =>
          i === index ? suggestions : suggestionsList,
        ),
      );
    } else {
      setBookTitleSuggestions((prev) =>
        prev.map((suggestionsList, i) => (i === index ? [] : suggestionsList)),
      );
    }
  };

  const handleBookTitleClick = (suggestedTitle, index) => {
    setBookTitles1((prev) =>
      prev.map((title, i) => (i === index ? suggestedTitle : title)),
    );
    setBookTitleSuggestions((prev) =>
      prev.map((suggestionsList, i) => (i === index ? [] : suggestionsList)),
    );
  };

  const handleSubmit = async (titles, url, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3001/api/recommendations/${url}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            book_titles: titles,
            user_id: userId,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recommendations");
      }
      await fetchRecommendations();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleSubmit = async (url, e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/recommendations/${url}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            sub_genre: genre,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recommendations");
      }
      await fetchRecommendations();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recommendationId, index, e) => {
    e.stopPropagation();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3001/api/recommendations/${recommendationId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete recommendation");
      }
      setRecommendations((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookTitle = () => {
    setBookTitles1((prev) => [...prev, ""]);
    setBookTitleSuggestions((prev) => [...prev, []]);
  };

  const handleRemoveBookTitle = () => {
    if (bookTitles1.length > 1) {
      setBookTitles1((prev) => prev.slice(0, -1));
      setBookTitleSuggestions((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="recommendations-list-component">
      {error && <ErrorComponent message={error} />}
      {loading && <LoadingSpinner />}
      <Tabs defaultActiveKey="tab1" id="recommendations-tabs" className="mb-3">
        <Tab eventKey="tab1" title="Similar Books">
          <Form
            onSubmit={(e) => handleSubmit(bookTitles1, "books", e)}
            className="mb-4"
          >
            {bookTitles1.map((title, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Control
                  type="text"
                  placeholder={`Enter book title ${index + 1}`}
                  value={title}
                  onChange={(e) => handleBookTitleChange(e, index)}
                />
                {bookTitleSuggestions[index]?.length > 0 && (
                  <ListGroup className="title-suggestions">
                    {bookTitleSuggestions[index].map((suggestedTitle, i) => (
                      <ListGroup.Item
                        key={i}
                        action
                        onClick={() =>
                          handleBookTitleClick(suggestedTitle, index)
                        }
                      >
                        {suggestedTitle}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>
            ))}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Button
                  variant="outline-secondary"
                  onClick={handleAddBookTitle}
                  disabled={bookTitles1.length >= 3}
                  className="me-2"
                >
                  <FaPlus /> Add Book
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleRemoveBookTitle}
                  disabled={bookTitles1.length <= 1}
                >
                  <FaMinus /> Remove Book
                </Button>
              </div>
              <Button variant="primary" type="submit" disabled={loading}>
                <FaBook className="me-2" /> Get Recommendations
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="tab2" title="By Genre">
          <Form
            onSubmit={(e) => handleSingleSubmit("genre", e)}
            className="mb-4"
          >
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={genre}
                onChange={handleGenreChange}
              />
              {genreSuggestions.length > 0 && (
                <ListGroup className="genre-suggestions">
                  {genreSuggestions.map((suggestedGenre, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={() => handleGenreClick(suggestedGenre)}
                    >
                      {suggestedGenre}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                <FaSearch className="me-2" /> Get Recommendations
              </Button>
            </div>
          </Form>
        </Tab>
      </Tabs>
      <Accordion>
        {Array.isArray(recommendations) &&
          recommendations.map((section, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>
                    Recommendations from{" "}
                    {new Date(section.created_at).toLocaleString()}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-center mb-3">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => handleDelete(section._id, index, e)}
                  >
                    <FaTrash /> Delete Recommendation
                  </Button>
                </div>
                {Array.isArray(section.books) ? (
                  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {section.books.map((book, i) => (
                      <Col key={i}>
                        <Card className="h-100 shadow-sm hover-shadow">
                          <Link
                            to={`/book/${book.id}`}
                            className="text-decoration-none"
                          >
                            <Card.Img
                              variant="top"
                              src={book.cover_link}
                              alt={book.title}
                            />
                            <Card.Body>
                              <Card.Title className="text-truncate">
                                {book.title}
                              </Card.Title>
                              <Card.Text className="text-muted">
                                {book.author}
                              </Card.Text>
                            </Card.Body>
                          </Link>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No books available for this recommendation.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
}

export default RecommendationsComponent;

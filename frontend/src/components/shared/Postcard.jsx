import React, { useState, useContext, useEffect } from "react";
import { Card, Modal, Button, Form, Image, Alert } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Postcard = ({ review, showUserInfo = true, onDelete, onEdit }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.content);
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/books/${review.book_id}`,
        );
        const data = await response.json();
        setBook(data.book);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [review.book_id]);

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setError("");
  };

  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    if (review.user_id !== currentUser?.id) {
      setError("Unauthorized: Cannot delete another user's review");
      return;
    }
    try {
      await onDelete(review._id);
      handleClose();
      window.location.reload();
    } catch (error) {
      setError(`Error deleting review: ${error.message}`);
    }
  };

  const handleEdit = async () => {
    if (review.user_id !== currentUser?.id) {
      setError("Unauthorized: Cannot edit another user's review");
      return;
    }
    try {
      await onEdit(review._id, { title, content });
      handleClose();
      window.location.reload();
    } catch (error) {
      setError(`Error updating review: ${error.message}`);
    }
  };

  const isOwnReview = review.user_id === currentUser?.id;

  const getPreviewText = (text) => {
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  };

  return (
    <>
      <Card
        className="h-100 shadow-sm hover-shadow transition"
        onClick={handleShow}
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          {showUserInfo && (
            <div className="d-flex align-items-center mb-3">
              <Image
                src={
                  review.user?.avatar ||
                  `https://ui-avatars.com/api/?name=${review.user?.name || "Unknown"}`
                }
                roundedCircle
                className="me-3"
                style={{ width: 50, height: 50 }}
              />
              <div>
                <Card.Title className="mb-0">{review.title}</Card.Title>
                <Card.Subtitle className="text-muted">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${review.user?.id || ""}`);
                    }}
                  >
                    {review.user?.name || "Unknown User"}
                  </span>
                </Card.Subtitle>
              </div>
            </div>
          )}
          <Card.Text>{getPreviewText(review.content)}</Card.Text>
          {/* Display book details */}
          {book && (
            <div className="mt-4">
              <div className="d-flex align-items-center mb-2">
                <Image
                  src={book.cover_link}
                  rounded
                  style={{ width: 50, height: 75 }}
                  className="me-3"
                />
                <div>
                  <Link
                    to={`/book/${review.book_id}`}
                    className="text-decoration-none"
                  >
                    <Card.Title className="mb-1">
                      <strong>{book.title}</strong>
                    </Card.Title>
                  </Link>
                  <Card.Subtitle className="text-muted mb-2">
                    <em>by {book.author}</em>
                  </Card.Subtitle>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none text-primary"
                  >
                    View on Goodreads
                  </a>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{review.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showUserInfo && (
            <div className="d-flex align-items-center mb-3">
              <Image
                src={
                  review.user?.avatar ||
                  `https://ui-avatars.com/api/?name=${review.user?.name || "Unknown"}`
                }
                roundedCircle
                className="me-3"
                style={{ width: 50, height: 50 }}
              />
              <Link
                to={`/user/${review.user?.id || ""}`}
                className="text-decoration-none"
              >
                <strong>{review.user?.name || "Unknown User"}</strong>
              </Link>
            </div>
          )}
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <p>{review.content || "No content available"}</p>
          )}
          {/* Display book details in the modal */}
          {book && (
            <div className="mt-4">
              <div className="d-flex align-items-center mb-2">
                <Image
                  src={book.cover_link}
                  rounded
                  style={{ width: 50, height: 75 }}
                  className="me-3"
                />
                <div>
                  <Link
                    to={`/book/${review.book_id}`}
                    className="text-decoration-none"
                  >
                    <Card.Title className="mb-1">
                      <strong>{book.title}</strong>
                    </Card.Title>
                  </Link>
                  <Card.Subtitle className="text-muted mb-2">
                    <em>by {book.author}</em>
                  </Card.Subtitle>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none text-primary"
                  >
                    View on Goodreads
                  </a>
                </div>
              </div>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          {isOwnReview && (
            <>
              {isEditing ? (
                <Button variant="success" onClick={handleEdit}>
                  <FaEdit className="me-2" /> Save Changes
                </Button>
              ) : (
                <>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="me-2"
                  >
                    <FaTrash className="me-2" /> Delete
                  </Button>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    <FaEdit className="me-2" /> Edit
                  </Button>
                </>
              )}
            </>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Postcard;

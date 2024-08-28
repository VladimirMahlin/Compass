import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Button,
  Form,
  Image,
  Row,
  Col,
  Container,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaEnvelope, FaCalendar } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";

const defaultAvatars = [
  "https://compassreads.com/images/avatars/1.png",
  "https://compassreads.com/images/avatars/2.png",
  "https://compassreads.com/images/avatars/3.png",
  "https://compassreads.com/images/avatars/4.png",
  "https://compassreads.com/images/avatars/5.png",
  "https://compassreads.com/images/avatars/6.png",
];

const Profile = ({ userId }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatars[0]);
  const [created_at, setCreated_at] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${userId}`,
        );
        const data = await response.json();
        if (response.ok) {
          setName(data.name);
          setBio(data.bio);
          setAvatar(data.avatar);
          setCreated_at(data.created_at);
          setEmail(data.email);
        } else {
          setError(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        setError("An error occurred while fetching the user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, bio, avatar }),
          credentials: "include",
        },
      );
      const result = await response.json();
      if (response.ok) {
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      } else {
        setError(result.message || "Failed to update profile.");
      }
    } catch (error) {
      setError("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Container className="py-5">
      <Card className="border-0 shadow">
        <Card.Body className="p-4 p-md-5">
          <Row className="align-items-center mb-4">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <Image
                src={avatar || `https://ui-avatars.com/api/?name=${name}`}
                roundedCircle
                className="mb-3 shadow-sm"
                width={200}
                height={200}
              />
            </Col>
            <Col md={8}>
              <h1 className="mb-3 text-black">{name}</h1>
              <p className="text-muted mb-4 fs-5">{bio || "No bio provided"}</p>
              <Row className="mb-3">
                <Col sm={6}>
                  <p className="text-muted mb-2">
                    <FaEnvelope className="me-2" /> {email}
                  </p>
                  <p className="text-muted">
                    <FaCalendar className="me-2" /> Joined on {formattedDate}
                  </p>
                </Col>
                <Col sm={6} className="text-sm-end mt-3 mt-sm-0">
                  {!isEditing && userId === user?.id && (
                    <Button variant="outline-primary" onClick={handleEditClick}>
                      <FaEdit className="me-2" /> Edit Profile
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          {message && (
            <Alert variant="success" className="mb-4">
              {message}
            </Alert>
          )}
          {isEditing && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Choose Avatar</Form.Label>
                <Row className="g-3 mb-3">
                  {defaultAvatars.map((avatarUrl, index) => (
                    <Col key={index} xs={4} sm={2}>
                      <Image
                        src={avatarUrl}
                        roundedCircle
                        className={`w-100 h-auto cursor-pointer ${
                          avatar === avatarUrl
                            ? "border border-primary border-3"
                            : "border border-3 border-transparent"
                        }`}
                        onClick={() => setAvatar(avatarUrl)}
                      />
                    </Col>
                  ))}
                </Row>
                <Form.Control
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Or enter a custom avatar URL"
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={handleCancelClick}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveClick}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;

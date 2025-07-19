import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import validateForm from "../../validation";
import { FaEnvelope, FaLock, FaUserLock } from "react-icons/fa";
import { fetchData } from "../../utils/api";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { isValid, error: validationError } = validateForm(
      email,
      password,
      confirmPassword,
    );
    if (!isValid) {
      setError(validationError);
      return;
    }

    try {
      await fetchData("users/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.message ||
          "An unexpected error occurred. Please try again later.",
      );
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 font-weight-bold">
                Join Compass
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white">
                      <FaEnvelope />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white">
                      <FaUserLock />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="py-2"
                    />
                  </div>
                </Form.Group>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="py-2"
                  >
                    Create Account
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary">
              Log in
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;

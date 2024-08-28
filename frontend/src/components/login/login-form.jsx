import React, { useState, useContext } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate(`/user/${data.user.id}`);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 font-weight-bold">
                Welcome Back
              </h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={handleLogin}>
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    Log In
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/" className="text-primary">
              Sign up
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

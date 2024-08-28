import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Access Denied</Alert.Heading>
        <p>
          You must be logged in to view this page. Please log in or create an
          account to continue.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/login">
            <Button variant="outline-danger">Log In</Button>
          </Link>
          <Link to="/" className="ms-2">
            <Button variant="outline-primary">Sign Up</Button>
          </Link>
        </div>
      </Alert>
    </Container>
  );
};

export default Error;

import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className="mt-5">
      <Alert variant="warning">
        <Alert.Heading>Page Not Found</Alert.Heading>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/">
            <Button variant="outline-primary">Go to Home</Button>
          </Link>
        </div>
      </Alert>
    </Container>
  );
};

export default NotFound;

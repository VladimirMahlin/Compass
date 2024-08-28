import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import backgroundImage from "../../img/backgrounds/index.jpg";

const Hero = ({ scrollToRegistration }) => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "50vh",
  };

  return (
    <div className="text-white d-flex align-items-center" style={heroStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="text-center">
            <h1 className="display-4 mb-4">Welcome to Compass</h1>
            <p className="lead mb-4">
              A place to share and discover book reviews and recommendations
              with fellow book lovers.
            </p>
            <Button variant="light" href="/login" className="me-2">
              Login
            </Button>
            <Button variant="outline-light" onClick={scrollToRegistration}>
              Sign Up
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;

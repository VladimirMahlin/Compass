import React from "react";
import { Container, Button } from "react-bootstrap";
import backgroundImage from "../../img/backgrounds/user.jpg";

const Hero = ({ scrollToUser, scrollToBooks, scrollToReviews }) => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
    padding: "5rem 0",
    marginBottom: "2rem",
  };

  return (
    <div style={heroStyle}>
      <Container className="text-center">
        <h1 className="display-4 mb-4">User Profile</h1>
        <p className="lead mb-4">
          Explore your personal book journey, favorite reads, and shared
          reviews.
        </p>
        <Button variant="light" onClick={scrollToUser} className="me-2">
          Profile
        </Button>
        <Button
          variant="outline-light"
          onClick={scrollToBooks}
          className="me-2"
        >
          Favorite Books
        </Button>
        <Button variant="outline-light" onClick={scrollToReviews}>
          Reviews
        </Button>
      </Container>
    </div>
  );
};

export default Hero;

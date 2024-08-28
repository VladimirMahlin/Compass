import React from "react";
import { Container } from "react-bootstrap";
import backgroundImage from "../../img/backgrounds/library.jpg";

const Hero = () => {
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
        <h1 className="display-4 mb-4">Compass Library</h1>
        <p className="lead">
          Explore our extensive collection of books and discover your next great
          read.
        </p>
      </Container>
    </div>
  );
};

export default Hero;

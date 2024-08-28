import React, { useContext, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Hero from "../components/index/hero";
import RegistrationForm from "../components/index/registration-form";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/Loading";

function Index() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const registrationRef = useRef(null);

  const scrollToRegistration = () => {
    registrationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  }, [user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid className="p-0">
      <Hero scrollToRegistration={scrollToRegistration} />
      <Container ref={registrationRef} className="py-5">
        <RegistrationForm />
      </Container>
    </Container>
  );
}

export default Index;

import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Hero from "../components/library/hero";
import Books from "../components/library/books";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "../components/shared/Loading";
import ErrorComponent from "../components/shared/Error";

const Library = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useContext(AuthContext);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (authError) {
    return <ErrorComponent message={authError} />;
  }

  return (
    <Container fluid className="p-0">
      <Hero />
      <Container>
        <Books />
      </Container>
    </Container>
  );
};

export default Library;

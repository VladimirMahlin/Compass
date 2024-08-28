import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Hero from "../components/recommendations/hero";
import RecommendationsComponent from "../components/recommendations/recommendations-component";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "../components/shared/Loading";
import ErrorComponent from "../components/shared/Error";

function Recommendations() {
  const navigate = useNavigate();
  const { user, loading, error } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Container fluid className="p-0">
      <Hero />
      <Container>
        <RecommendationsComponent userId={user?.id} />
      </Container>
    </Container>
  );
}

export default Recommendations;

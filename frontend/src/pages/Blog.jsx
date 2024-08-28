import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import BlogReviews from "../components/blog/reviews";
import LoadingSpinner from "../components/shared/Loading";
import ErrorComponent from "../components/shared/Error";

const Blog = () => {
  const { user, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/`);
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
      <BlogReviews />
    </Container>
  );
};

export default Blog;

import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import LoginForm from "../components/login/login-form";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/Loading";

function Login() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  }, [user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="mt-5">
      <LoginForm />
    </Container>
  );
}

export default Login;

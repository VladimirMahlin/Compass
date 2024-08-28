import React, { useEffect, useRef, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import Profile from "../components/user/profile";
import Hero from "../components/user/hero";
import FavoriteBooks from "../components/user/favorite-books";
import Reviews from "../components/user/reviews";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/shared/Loading";
import ErrorComponent from "../components/shared/Error";
import { AuthContext } from "../contexts/AuthContext";

const User = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useContext(AuthContext);
  const { id: userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRef = useRef(null);
  const booksRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`);
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          setError(data.error || "Failed to load user data.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && !authError) {
      if (userId) {
        if (userId === user?.id) {
          setUserData(user);
          setLoading(false);
        } else {
          fetchUserData(userId);
        }
      } else if (user) {
        fetchUserData(user.id);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [authLoading, authError, userId, user, navigate]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (authError) {
    return <ErrorComponent message={authError} />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container fluid className="p-0">
      <Hero
        scrollToUser={() => scrollToSection(userRef)}
        scrollToBooks={() => scrollToSection(booksRef)}
        scrollToReviews={() => scrollToSection(reviewsRef)}
      />
      <Container>
        <div ref={userRef} className="mt-5">
          <Profile userId={userData.id} />
        </div>
        <div ref={booksRef} className="mt-5">
          <FavoriteBooks userId={userData.id} />
        </div>
        <div ref={reviewsRef} className="mt-5">
          <Reviews user={userData} />
        </div>
      </Container>
    </Container>
  );
};

export default User;

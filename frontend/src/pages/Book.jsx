import React, { useContext, useEffect, useState } from "react";
import { Container, Alert } from "react-bootstrap";
import BookInformation from "../components/book/book-information";
import ReviewForm from "../components/book/reviewForm";
import Reviews from "../components/book/reviews";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "../components/shared/Loading";
import ErrorComponent from "../components/shared/Error";
import { fetchData } from "../utils/api";

function Book() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useContext(AuthContext);
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const data = await fetchData(`books/${bookId}`);
        setBookData(data);
      } catch (error) {
        console.error("Error fetching book:", error.message);
        setError("Failed to fetch book data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookData();
    }
  }, [bookId, user]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (authError || error) {
    return <ErrorComponent message={authError || error} />;
  }

  const userHasReviewed =
    bookData?.reviews?.some((review) => review.user_id === user?.id) || false;

  return (
    <Container>
      <BookInformation book={bookData.book} userId={user?.id} />
      {user && !userHasReviewed && (
        <ReviewForm bookId={bookId} userId={user?.id} />
      )}
      <Reviews bookId={bookId} />
    </Container>
  );
}

export default Book;

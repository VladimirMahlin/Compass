import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Form, InputGroup, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import LoadingSpinner from "../shared/Loading";
import ErrorComponent from "../shared/Error";

function Books() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/books/all");
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.statusText}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, books]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBooks]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 576) {
        setBooksPerPage(6);
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        setBooksPerPage(9);
      } else {
        setBooksPerPage(12);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <Pagination.Ellipsis key="ellipsis" />;

    if (totalPages <= maxVisiblePages) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
            aria-label={`Page ${number}`}
          >
            {number}
          </Pagination.Item>,
        );
      }
    } else {
      items.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
          aria-label="Page 1"
        >
          1
        </Pagination.Item>,
      );

      if (currentPage > 3) {
        items.push(ellipsis);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let number = start; number <= end; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
            aria-label={`Page ${number}`}
          >
            {number}
          </Pagination.Item>,
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(ellipsis);
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </Pagination.Item>,
      );
    }

    return items;
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="books-component my-5">
      <h2 className="text-center mb-4">Library</h2>
      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form>
      {filteredBooks.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {currentBooks.map((book) => (
            <Col key={book.id}>
              <Card className="h-100 shadow-sm hover-shadow">
                <Link to={`/book/${book.id}`} className="text-decoration-none">
                  <Card.Img
                    variant="top"
                    src={book.cover_link}
                    alt={book.title}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      {book.title}
                    </Card.Title>
                    <Card.Text className="text-muted">{book.author}</Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No books found</p>
      )}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          />
          {renderPaginationItems()}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          />
        </Pagination>
      )}
    </div>
  );
}

export default Books;

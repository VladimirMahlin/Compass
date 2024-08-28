import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { FaBook, FaSignOutAlt, FaUser, FaCompass } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <Navbar bg="primary" variant="dark" expand="md">
        <Container>
          <Navbar.Brand>Loading...</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="py-3">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          <FaCompass className="me-2" />
          Compass
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link onClick={() => navigate("/blog")} className="mx-2">
                  <FaBook className="me-1" />
                  Blog
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="mx-2"
                >
                  <FaUser className="me-1" />
                  Profile
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate(`/recommendations/${user.id}`)}
                  className="mx-2"
                >
                  Recommendations
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/library")} className="mx-2">
                  Library
                </Nav.Link>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  <FaSignOutAlt className="me-1" />
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                onClick={() => navigate("/login")}
                className="ms-2"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

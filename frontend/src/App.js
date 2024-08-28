import React, { lazy, Suspense, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/shared/Header";
import Loading from "./components/shared/Loading";
import "./custom-bootstrap.scss";
import { AuthContext } from "./contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const User = lazy(() => import("./pages/User"));
const Book = lazy(() => import("./pages/Book"));
const Login = lazy(() => import("./pages/Login"));
const Library = lazy(() => import("./pages/Library"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Error = lazy(() => import("./pages/Error"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ProtectedRoute = ({ children }) => {
  const { user, loading, checkSession } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      checkSession();
    }
  }, [loading, checkSession]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/error" element={<Error />} />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <ProtectedRoute>
                <Book />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations/:userId"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

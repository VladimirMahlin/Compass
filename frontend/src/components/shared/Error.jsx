import React from "react";
import { Alert } from "react-bootstrap";

const ErrorComponent = ({ message }) => (
  <Alert variant="danger" className="mt-3">
    {message}
  </Alert>
);

export default ErrorComponent;

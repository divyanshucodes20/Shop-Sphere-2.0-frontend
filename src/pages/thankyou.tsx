import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "2rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.8rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Thank You!</h1>
      <p style={messageStyle}>
        We have received your message and will get back to you shortly.
      </p>
      <button
        onClick={() => navigate("/")}
        style={buttonStyle}
      >
        Return to Homepage
      </button>
    </div>
  );
};

export default ThankYouPage;

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserReducerInitialState } from "../types/reducer-types";

const About = () => {

  const {user}=useSelector(
    (state:{userReducer:UserReducerInitialState})=>state.userReducer
  )


  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", color: "#333" }}>
      {/* Header Section */}
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#2d89ff" }}>Welcome to ShopSphere</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Your one-stop platform for shopping and selling reusable products with ease.
        </p>
      </header>

      {/* About Us Section */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", color: "#222", marginBottom: "1rem" }}>
          Who We Are
        </h2>
        <p>
          ShopSphere is a dynamic e-commerce platform designed to provide a seamless
          experience for buying, selling, and reselling products. We empower users with
          tools to track their activities, manage their items, and enjoy a comprehensive
          shopping and selling experience.
        </p>
      </section>

      {/* Website Flow Section */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", color: "#222", marginBottom: "1rem" }}>
          Our Platform Flow
        </h2>
        {[
          {
            step: "1. Home Page",
            description:
              "Explore the latest products and reusable items right on our home page. Discover trending deals, browse categories, and check out what’s new and popular in both segments.",
          },
          {
            step: "2. Product Search",
            description:
              "Easily find what you’re looking for using our advanced search filters. Separate searches for products and reusable items ensure you always get the most relevant results.",
          },
          {
            step: "3. User Dashboard",
            description:
              "Your personalized dashboard provides all the information you need, from tracking your queries to managing your items listed for sale. Stay informed about product stock, price updates, and status changes in real time.",
          },
          {
            step: "4. Reusable Items Workflow",
            description:
              "Submit a query to sell your reusable items. Once approved, the item becomes a product listed for sale on ShopSphere. You can monitor its lifecycle, including stock availability and price updates.",
          },
          {
            step: "5. Payment Tracking",
            description:
              "Once your reusable item is sold, our payment tracking system keeps you updated on the payment status. You'll know when the payment is processed and when it’s successfully credited to your account.",
          },
        ].map(({ step, description }, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.4rem", color: "#2d89ff", marginBottom: "0.5rem" }}>
              {step}
            </h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      {/* Key Features Section */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", color: "#222", marginBottom: "1rem" }}>
          Why Choose ShopSphere?
        </h2>
        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
          {[
            "Explore the latest products and reusable items on a single platform.",
            "Separate search functionality for regular and reusable products.",
            "Real-time updates on stock, price, and query status.",
            "Seamless lifecycle tracking for reusable items from query to sale.",
            "Secure and transparent payment process with live status updates.",
          ].map((feature, index) => (
            <li key={index} style={{ marginBottom: "0.5rem", color: "#555" }}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Us Section */}
      <section
  style={{
    textAlign: "center",
    padding: "1rem",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  }}
>
  <h2 style={{ fontSize: "1.8rem", color: "#222", marginBottom: "1rem" }}>
    Get in Touch
  </h2>
  <p>
    Have questions or need assistance? Reach out to us anytime, and we’ll make sure
    you have the best experience with ShopSphere.
  </p>
  <Link
    to="/contact"
    style={{
      display: "inline-block",
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      color: "white",
      backgroundColor: "#2d89ff",
      textDecoration: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "1rem",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056d6")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2d89ff")}
  >
    Contact Us
  </Link>

  <h2 style={{ fontSize: "1.8rem", color: "#222", marginTop: "2rem" }}>
        List Your Product with Us
      </h2>
      <p>
        Submit a query, and we'll review it. After approval, we’ll pick up your item,
        perform the necessary reviews, and list it on our platform. Start your journey
        with us today!
      </p>
      {user ? (
  user.role === 'admin' ? (
    <Link
      to="/admin/dashboard"
      style={{
        display: "inline-block",
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#ff5722",
        textDecoration: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "1rem",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e64a19")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff5722")}
    >
      Go to Admin Dashboard
    </Link>
  ) : (
    <Link
      to="/user/queries"
      style={{
        display: "inline-block",
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#ff5722",
        textDecoration: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "1rem",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e64a19")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff5722")}
    >
      Get Started
    </Link>
  )
) : (
  <Link
    to="/login"
    style={{
      display: "inline-block",
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      color: "white",
      backgroundColor: "#ff5722",
      textDecoration: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "1rem",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e64a19")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff5722")}
  >
    Login to Get Started
  </Link>
)}
  
</section>

    </div>
  );
};

export default About;

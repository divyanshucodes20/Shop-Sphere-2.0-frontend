import { signOut } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaRecycle,
  FaSearch,
  FaShoppingBag,
  FaUser
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { User } from "../types/types";

const logo = "https://res.cloudinary.com/dmwfyn2op/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1732248470/Screenshot_2024-11-22_093737_ujy0tc.png";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);  // Dropdown starts closed

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false); // Close dropdown on sign out
    } catch (error) {
      toast.error("Sign Out Failed");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);  // Toggles dropdown visibility
  };

  return (
    <nav className="header">
      {/* ShopSphere Logo and Title */}
      <div className="logo-container">
        <Link onClick={() => setIsOpen(false)} to={"/"} className="logo-link">
          <img src={logo} alt="ShopSphere Logo" className="logo" />
          <span className="title">ShopSphere</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/reusable-search"}>
        <FaRecycle/>
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>

      {/* User Actions */}
      {user?._id ? (
        <>
          <button onClick={toggleDropdown}>
            <FaUser />
          </button>
          {/* Dropdown menu, only open if isOpen is true */}
          {isOpen && (
            <dialog open={isOpen} className="dropdown-menu">
              <div>
                {user.role === "admin" && (
                  <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                    Admin
                  </Link>
                )}
                <Link onClick={() => setIsOpen(false)} to="/orders">
                  Orders
                </Link>
                {user.role === "user" && (
                  <Link onClick={() => setIsOpen(false)} to="/user/queries">
                    Queries
                  </Link>
                )}
                {user.role === "user" && (
                  <Link onClick={() => setIsOpen(false)} to="/user/payments">
                    Payments
                  </Link>
                )}
                <button className="logout-btn" onClick={logoutHandler}>
                  Logout
                </button>
              </div>
            </dialog>
          )}
        </>
      ) : (
        <Link to={"/login"} className="login-btn">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Header;

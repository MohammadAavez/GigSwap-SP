import { NavLink, useLocation } from "react-router-dom"; // ✅ useLocation import kiya
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export const Navbar = () => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // ✅ Current path lene ke liye

  const toggleMenu = () => setSidebarOpen(!isSidebarOpen);

  if (isLoading) {
    return null;
  }

  return (
    <header>
      <div className="container navbar">
        <div className="logo-brand">
          <NavLink to="/">GigSwap</NavLink>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav
          className={isSidebarOpen ? "active" : ""}
          onClick={() => setSidebarOpen(false)}
        >
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/service">Services</NavLink></li>

            {/* ✅ Navbar ke Book button mein state add kiya */}
            {isLoggedIn ? (
              <li><NavLink to="/contact">Book</NavLink></li>
            ) : (
              <li>
                <NavLink to="/login" state={{ from: location.pathname }}>
                  Book
                </NavLink>
              </li>
            )}

            {isLoggedIn && user?.isAdmin && (
              <li><NavLink to="/admin/users">Admin Panel</NavLink></li>
            )}

            {isLoggedIn && user?.isWorker && (
              <li><NavLink to="/worker/contacts">Worker Panel</NavLink></li>
            )}

            {isLoggedIn ? (
              <li><NavLink to="/logout">Logout</NavLink></li>
            ) : (
              <>
                <li><NavLink to="/register">Register</NavLink></li>
                <li>
                  {/* ✅ Login link mein bhi state add kiya */}
                  <NavLink to="/login" state={{ from: location.pathname }}>
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
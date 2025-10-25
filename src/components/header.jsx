import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCartShopping,
  faUser,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Left: Logo + Brand */}
      <div className="logo-area">
        <img src={logo} alt="Shop LazyE Logo" className="logo" />

      </div>

      {/* Middle: Nav Links (hidden on mobile) */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="#">
          Collections{" "}
          <FontAwesomeIcon icon={faChevronDown} className="icon-small" />
        </Link>
        <Link to="/">All Products</Link>
      </nav>

      {/* Right: Icons */}
      <div className="icons">
        <Link to="/cart" className="icon-button">
          <FontAwesomeIcon icon={faCartShopping} />
        </Link>
        <Link to="/account" className="icon-button">
          <FontAwesomeIcon icon={faUser} />
        </Link>

        {/* Mobile Menu Toggle (Three Dots) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
    </header>
  );
}

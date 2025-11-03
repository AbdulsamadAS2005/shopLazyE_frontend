import React, { useState, useEffect, Suspense } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCartShopping,
  faUser,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import AllCollectionsInHeader from "./allCollectionsInHeader";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collection, setCollection] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".collections-wrapper") &&
        !e.target.closest(".collections-dropdown")
      ) {
        setCollection(false);
      }
    };
    if (collection && isMobile) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [collection, isMobile]);

  const handleLogoError = (e) => {
    e.target.src =
      "https://via.placeholder.com/150x50.png?text=Shop+LazyE+Logo";
  };

  const handleMouseEnter = () => {
    if (!isMobile) setCollection(true);
  };
  const handleMouseLeave = () => {
    if (!isMobile) setCollection(false);
  };

  const handleToggleCollections = (e) => {
    e.preventDefault();
    if (isMobile) setCollection((prev) => !prev);
  };

  return (
    <>
      <header className="header">
        <div className="logo-area">
          <Link to={'/'}>
            <img
              src={logo}
              alt="Shop LazyE Logo"
              className="logo"
              onError={handleLogoError}
            />
          </Link>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div
            className="collections-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="#"
              aria-haspopup="true"
              aria-expanded={collection}
              onClick={handleToggleCollections}
            >
              Collections{" "}
              <FontAwesomeIcon
                icon={faChevronDown}
                className="icon-small"
                style={{
                  transform: collection ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Link>

            {collection && (
              <div
                className={`collections-dropdown ${collection ? "show" : ""
                  } ${isMobile ? "mobile" : "desktop"}`}
              >
                <Suspense
                  fallback={
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      Loading collections...
                    </div>
                  }
                >
                  <SafeAllCollectionsInHeader />
                </Suspense>
              </div>
            )}
          </div>

          <Link to="/allproducts">All Products</Link>
        </nav>

        <div className="icons">
          <Link to="/cart" className="icon-button">
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
          <Link to="/account" className="icon-button">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </header>
    </>
  );
}

function SafeAllCollectionsInHeader() {
  try {
    return <AllCollectionsInHeader />;
  } catch (error) {
    console.error("❌ Failed to render AllCollectionsInHeader:", error);
    return (
      <div
        style={{
          backgroundColor: "#fff",
          color: "#222",
          padding: "2rem",
          textAlign: "center",
          border: "1px solid #ccc",
        }}
      >
        <p>⚠️ Something went wrong loading collections.</p>
        <small>Please refresh the page or try again later.</small>
      </div>
    );
  }
}

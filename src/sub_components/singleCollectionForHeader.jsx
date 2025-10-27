import React from "react";
import { Link } from "react-router-dom";

export default function SingleCollectionForHeader({ button, name, img }) {
  return (
    <div
      className="SingleCollectionForHeader"
      style={{
        backgroundImage: `linear-gradient(
            rgba(0, 0, 0, 0.4), 
            rgba(0, 0, 0, 0.4)
          ), url(${img})`,
      }}
    >
      <div className="collection-content">
        <h3>{name}</h3>
        <Link to="/shop">
          <button>{button}</button>
        </Link>
      </div>
    </div>
  );
}

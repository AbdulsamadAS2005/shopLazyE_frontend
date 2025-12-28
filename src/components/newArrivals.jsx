import React, { useEffect, useState } from "react";
import ListingSingleProduct from "../sub_components/listingSingleProduct";
import { Link } from "react-router-dom";
const apiURL = import.meta.env.VITE_Backend;

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleNewArrivals = async () => {
      try {
        const response = await fetch(`${apiURL}/newArrivals`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNewArrivals(data);
        } else {
          console.error("Failed to fetch new arrivals");
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    handleNewArrivals();
  }, []);

  return (
    <>
    {
        newArrivals.length>=1?
        <div className="newarrivals">
      <h2>NEW ARRIVALS</h2>
      <div className="allarrivals">
        {newArrivals.length > 0 ? (
          newArrivals.slice(0, 8).map((product, i) => (
            <ListingSingleProduct key={product._id || i} Name={product.Name} Price={product.Price} DiscountedPrice={product.DiscountedPrice} img={product.ImageUrl} link={product._id} />
          ))
        ) : (
          ""
        )}
      </div>
      <div className="viewAll">
        <Link to={'/newarrivals'}>View All</Link>
      </div>
    </div>
    : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading New Arrivals...</p>
        </div>
      ) : ""
    }
    </>
  );
}
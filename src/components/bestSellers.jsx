import React, { useEffect, useState } from "react";
import ListingSingleProduct from "../sub_components/listingSingleProduct";
const apiURL = import.meta.env.VITE_Backend;
import { Link } from "react-router-dom";

export default function BestSeller() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleBestSellers = async () => {
      try {
        const response = await fetch(`${apiURL}/bestSellers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBestSellers(data);
        } else {
          console.error("Failed to fetch best sellers");
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    handleBestSellers();
  }, []);

  return (
    <>
    {
        bestSellers.length>=1?
        <div className="newarrivals">
      <h2>BEST SELLERS</h2>
      <div className="allarrivals">
        {bestSellers.length > 0 ? (
          bestSellers.slice(0, 8).map((product, i) => (
            <ListingSingleProduct key={product._id || i} Name={product.Name} Price={product.Price} DiscountedPrice={product.DiscountedPrice} img={product.ImageUrl} link={product._id} />
          ))
        ) : (
          ""
        )}
      </div>
      <div className="viewAll">
        <Link to={'/bestsellers'}>View All</Link>
      </div>
    </div>
    : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Best Sellers...</p>
        </div>
      ) : ""
    }
    </>
  );
}
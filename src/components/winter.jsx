import React, { useEffect, useState } from "react";
import ListingSingleProduct from "../sub_components/listingSingleProduct";
const apiURL = import.meta.env.VITE_Backend;
import { Link } from "react-router-dom";

export default function WinterCollection() {
  const [winterCollection, setWinterCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinterCollection = async () => {
      try {
        const response = await fetch(`${apiURL}/winterCollection`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWinterCollection(data);
        } else {
          console.error("Failed to fetch winter collection");
        }
      } catch (error) {
        console.error("Error fetching winter collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinterCollection();
  }, []);

  return (
    <>
      {winterCollection.length >= 1 ? (
        <div className="newarrivals">
          <h2>WINTER SALES</h2>
          <div className="allarrivals">
            {winterCollection.length > 0
              ? winterCollection.slice(0, 8).map((product, i) => (
                <ListingSingleProduct
                  key={product._id || i}
                  Name={product.Name}
                  Price={product.Price}
                  DiscountedPrice={product.DiscountedPrice}
                  img={product.ImageUrl}
                  link={product._id}
                />
              ))
              : ""}
          </div>
          <div className="viewAll">
            <Link to={"/wintercollection"}>View All</Link>
          </div>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Winter Collection...</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
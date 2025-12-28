import React, { useEffect, useState } from "react";
import ListingSingleProduct from "../sub_components/listingSingleProduct";
const apiURL = import.meta.env.VITE_Backend;
import { Link } from "react-router-dom";

export default function SummerCollection() {
  const [summerCollection, setSummerCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummerCollection = async () => {
      try {
        const response = await fetch(`${apiURL}/summerCollection`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSummerCollection(data);
        } else {
          console.error("Failed to fetch summer collection");
        }
      } catch (error) {
        console.error("Error fetching summer collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummerCollection();
  }, []);

  return (
    <>
      {summerCollection.length >= 1 ? (
        <div className="newarrivals">
          <h2>SUMMER SALES</h2>
          <div className="allarrivals">
            {summerCollection.length > 0
              ? summerCollection.slice(0, 8).map((product, i) => (
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
            <Link to={"/summercollection"}>View All</Link>
          </div>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Summer Collection...</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
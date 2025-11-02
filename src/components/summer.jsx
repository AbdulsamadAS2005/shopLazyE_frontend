import React, { useEffect, useState } from "react";
import ListingSingleProduct from "../sub_components/listingSingleProduct";
const apiURL = import.meta.env.VITE_Backend;
import { Link } from "react-router-dom";

export default function SummerCollection() {
  const [summerCollection, setSummerCollection] = useState([]);

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
                  />
                ))
              : ""}
          </div>
          <div className="viewAll">
            <Link to={"/summercollection"}>View All</Link>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

import React from "react";
import summer from "../assets/SummerCollection.png";
import winter from "../assets/WinterCollection.png";
import bestseller from "../assets/bestSeller.jpg";
import newArrivals from "../assets/newArrivals.png";
import SingleCollectionForHeader from "../sub_components/singleCollectionForHeader";

export default function AllCollectionsInHeader() {
  const collections = [
    { link:"/collections/summer", name: "Summer Collection", img: summer },
    { link:"/collections/winter", name: "Winter Collection", img: winter },
    { link:"/bestsellers", name: "Best Sellers", img: bestseller },
    { link:"/newarrivals", name: "New Arrivals", img: newArrivals },
  ];

  return (
    <div className="AllCollectionsInHeader">
      {collections.map((col, idx) => (
        <SingleCollectionForHeader
          key={idx}
          button="Shop Now"
          name={col.name}
          img={col.img}
          link={col.link}
        />
      ))}
    </div>
  );
}

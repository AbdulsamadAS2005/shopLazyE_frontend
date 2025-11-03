import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import TopOfHeader from '../components/TopOfHeader';
import ListingSingleProduct from "../sub_components/listingSingleProduct";
import { Link } from 'react-router-dom';
import UpperFooter from '../components/upperFooter';
import Footer from '../components/footer';
const apiURL = import.meta.env.VITE_Backend;

export default function Newarrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchNewArrivals = async () => {
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
          setFilteredProducts(data);
        } else {
          console.error("Failed to fetch new arrivals");
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Sort products
  useEffect(() => {
    const sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low-high':
        sortedProducts.sort((a, b) => (a.DiscountedPrice || a.Price) - (b.DiscountedPrice || b.Price));
        break;
      case 'price-high-low':
        sortedProducts.sort((a, b) => (b.DiscountedPrice || b.Price) - (a.DiscountedPrice || a.Price));
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'newest':
      default:
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }, [sortBy, newArrivals]);

  if (loading) {
    return (
      <div className="newarrivals-page">
        <TopOfHeader />
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading New Arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="newarrivals-page">
      <TopOfHeader />
      <Header />
      
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>NEW ARRIVALS</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>New Arrivals</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="container">
          {/* Filters and Sort Bar */}
          <div className="products-controls">
            <div className="results-count">
              Showing {filteredProducts.length} products
            </div>
            <div className="sort-options">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, i) => (
                <ListingSingleProduct 
                  key={product._id || i} 
                  Name={product.Name} 
                  Price={product.Price} 
                  DiscountedPrice={product.DiscountedPrice} 
                  img={product.ImageUrl} 
                />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h3>No New Arrivals Found</h3>
              <p>Check back soon for new products!</p>
              <Link to="/" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <UpperFooter/>
      <Footer/>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import UpperFooter from '../components/upperFooter';

const apiURL = import.meta.env.VITE_Backend;

// Cart item structure for localStorage
const CART_STORAGE_KEY = 'shopLazy-shopping_cart';

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/singleProduct/${id}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const productData = await response.json();
      setProduct(productData);
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateDiscountPercentage = () => {
    if (!product) return 0;
    const originalPrice = parseFloat(product.Price.replace('$', ''));
    const discountedPrice = parseFloat(product.DiscountedPrice.replace('$', ''));
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  // Function to get cart from localStorage
  const getCartFromStorage = () => {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  };

  // Function to save cart to localStorage
  const saveCartToStorage = (cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Function to handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    
    // Get existing cart
    const existingCart = getCartFromStorage();
    
    // Find if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => item.id === product._id);
    
    if (existingProductIndex > -1) {
      // Update quantity if product exists
      existingCart[existingProductIndex].quantity += quantity;
      existingCart[existingProductIndex].totalPrice = 
        existingCart[existingProductIndex].quantity * 
        parseFloat(product.DiscountedPrice?.replace('$', '') || product.Price.replace('$', ''));
    } else {
      const cartItem = {
        id: product._id,
        name: product.Name,
        price: parseFloat(product.Price.replace('$', '')),
        discountedPrice: parseFloat(product.DiscountedPrice?.replace('$', '') || product.Price.replace('$', '')),
        image: product.ImageUrl,
        category: product.Category,
        subCategory: product.SubCategory,
        bestSeller: product.BestSeller || false,
        quantity: quantity,
        totalPrice: quantity * parseFloat(product.DiscountedPrice?.replace('$', '') || product.Price.replace('$', ''))
      };
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    saveCartToStorage(existingCart);
    
    // Show success message
    setCartMessage(`${product.Name} (${quantity} item${quantity > 1 ? 's' : ''}) added to cart!`);
    
    // Reset adding state
    setIsAddingToCart(false);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setCartMessage('');
    }, 3000);
    
    // Optional: You can also dispatch an event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Optional: Function to handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    // You can redirect to checkout page here
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const discountPercentage = calculateDiscountPercentage();

  return (
    <>
      <Header />
      <div className="single-product">
        {cartMessage && (
          <div className="cart-message">
            {cartMessage}
          </div>
        )}
        
        <div className="product-breadcrumb">
          <span>Home</span>
          <span>/</span>
          <span>{product.Category}</span>
          <span>/</span>
          <span>{product.SubCategory}</span>
          <span>/</span>
          <span className="current">{product.Name}</span>
        </div>

        <div className="product-container">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.ImageUrl} 
                alt={product.Name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-image.jpg';
                }}
              />
              {product.BestSeller && (
                <div className="best-seller-badge">Best Seller</div>
              )}
              {discountPercentage > 0 && (
                <div className="discount-badge">-{discountPercentage}%</div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title">{product.Name}</h1>
              <div className="product-categories">
                <span className="category-tag">{product.Category}</span>
                <span className="subcategory-tag">{product.SubCategory}</span>
              </div>
            </div>

            <div className="product-pricing">
              {product.DiscountedPrice && product.DiscountedPrice !== product.Price ? (
                <>
                  <span className="current-price">{product.DiscountedPrice}</span>
                  <span className="original-price">{product.Price}</span>
                  {discountPercentage > 0 && (
                    <span className="discount-percentage">Save {discountPercentage}%</span>
                  )}
                </>
              ) : (
                <span className="current-price">{product.Price}</span>
              )}
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>Free shipping on orders over Rs. 5000</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">↩️</span>
                <span>3-day return policy</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="product-description">
          <h3>Product Description</h3>
          <p>
            Discover the exceptional quality and design of {product.Name}. This {product.SubCategory.toLowerCase()} 
            from our {product.Category} collection combines style with functionality to meet your needs.
            {product.BestSeller && " As a best-selling product, it has been highly rated by our customers for its outstanding performance and value."}
          </p>
          
          <div className="specifications">
            <h4>Key Features</h4>
            <ul>
              <li>Premium quality materials</li>
              <li>Expert craftsmanship</li>
              <li>Designed for durability</li>
              <li>Customer favorite</li>
            </ul>
          </div>
        </div>
      </div>
      <UpperFooter />
      <Footer />
    </>
  );
}
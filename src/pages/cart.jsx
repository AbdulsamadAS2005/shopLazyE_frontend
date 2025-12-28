import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import UpperFooter from '../components/upperFooter';
import NewArrivals from '../components/newArrivals';

const CART_STORAGE_KEY = 'shopLazy-shopping_cart';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
    // Listen for cart updates from other pages
    window.addEventListener('cartUpdated', loadCartItems);
    return () => {
      window.removeEventListener('cartUpdated', loadCartItems);
    };
  }, []);

  const loadCartItems = () => {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.discountedPrice
        };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 10000 ? 0 : 200; // Free shipping over Rs.  10000
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.13; // 13% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    // In a real app, you would navigate to checkout page

    navigate('/checkout')
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Shopping Cart</h1>
          <div className="cart-stats">
            <span className="item-count">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/allproducts" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <div className="header-product">Product</div>
                <div className="header-price">Price</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total">Total</div>
                <div className="header-actions">Actions</div>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-product">
                      <div className="product-image-container">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-image.jpg';
                          }}
                        />
                        {item.bestSeller && (
                          <span className="product-badge">Best Seller</span>
                        )}
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">
                          <Link to={`/product/Rs. {item.id}`}>{item.name}</Link>
                        </h3>
                        <div className="product-category">
                          <span className="category">{item.category}</span>
                          <span className="divider">•</span>
                          <span className="subcategory">{item.subCategory}</span>
                        </div>
                      </div>
                    </div>

                    <div className="item-price">
                      <div className="price-container">
                        {item.price > item.discountedPrice ? (
                          <>
                            <span className="discounted-price">
                              Rs. {item.discountedPrice.toFixed(2)}
                            </span>
                            <span className="original-price">
                              Rs. {item.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="current-price">
                            Rs. {item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="item-quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-total">
                      <span className="total-price">
                        Rs. {item.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="item-actions">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                        aria-label="Remove item"
                      >
                        <svg className="trash-icon" viewBox="0 0 24 24">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          <path d="M10 11v6"/>
                          <path d="M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <Link to="/allproducts" className="continue-shopping-link">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={() => {
                    const updatedCart = cartItems.map(item => ({
                      ...item,
                      quantity: 1,
                      totalPrice: 1 * item.discountedPrice
                    }));
                    setCartItems(updatedCart);
                    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
                  }}
                  className="update-cart-btn"
                >
                  Update All Quantities to 1
                </button>
              </div>
            </div>

            <div className="order-summary-section">
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="free-shipping">Free</span>
                      ) : (
                        `Rs. ${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="total-amount">
                      Rs. {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="shipping-note">
                  {calculateSubtotal() < 10000 && (
                    <p className="shipping-info">
                      <span className="info-icon">ℹ️</span>
                      Add Rs. {(10000 - calculateSubtotal()).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <p className="delivery-time">
                    <span className="truck-icon">🚚</span>
                    Estimated delivery: 3-5 business days
                  </p>
                </div>

                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <div className="payment-methods">
                  <p className="payment-title">Secure payment with:</p>
                  <div className="payment-icons">
                    <span className="payment-icon">💳</span>
                    <span className="payment-icon">📱</span>
                    <span className="payment-icon">🔒</span>
                    <span className="payment-icon">🏦</span>
                  </div>
                </div>

                <div className="security-badge">
                  <span className="lock-icon">🔒</span>
                  <span>SSL Secure Checkout • 256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="recommended-products">
            <h2 className="recommended-title">Frequently bought together</h2>
            <div className="recommended-grid">
              {/* You can add recommended products here */}
              <NewArrivals/>
            </div>
          </div>
        )}
      </div>
      <UpperFooter />
      <Footer />
    </>
  );
}
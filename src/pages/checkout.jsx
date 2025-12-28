import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import UpperFooter from '../components/upperFooter';
import Footer from '../components/footer';
import TopOfHeader from '../components/TopOfHeader';

const CART_STORAGE_KEY = 'shopLazy-shopping_cart';
const apiURL = import.meta.env.VITE_Backend;

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        PaymentMethod: 'COD'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [shakeFields, setShakeFields] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        console.log(savedCart);

        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    const calculateTotal = () => {
        const totalPrice = cartItems.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
        if (totalPrice > 10000) {
            return totalPrice;
        }
        else {
            return totalPrice + 200;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['Name', 'Email', 'PhoneNumber', 'Address'];

        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field} is required`;
            }
        });

        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            newErrors.Email = 'Please enter a valid email address';
        }

        if (formData.PhoneNumber && !/^[0-9]{10,}$/.test(formData.PhoneNumber.replace(/\D/g, ''))) {
            newErrors.PhoneNumber = 'Please enter a valid 10-digit phone number';
        }

        if (cartItems.length === 0) {
            newErrors.cart = 'Your cart is empty';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const invalidFields = Object.keys(newErrors);
            setShakeFields(invalidFields);
            setTimeout(() => setShakeFields([]), 500);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentMethodClick = (method) => {
        if (method === 'COD') {
            setFormData(prev => ({ ...prev, PaymentMethod: 'COD' }));
        } else {
            // Show coming soon toast
            const toast = document.createElement('div');
            toast.className = 'coming-soon-toast';
            toast.textContent = 'Coming Soon! 🚀';
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('show');
            }, 10);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 1500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const Totalprice = calculateTotal();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const orderData = {
                products: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                PaymentMethod: formData.PaymentMethod,
                Name: formData.Name,
                Email: formData.Email,
                PhoneNumber: formData.PhoneNumber,
                Address: formData.Address,
                Totalprice: Totalprice
            };
            console.log(orderData);

            const response = await fetch(`${apiURL}/newOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem(CART_STORAGE_KEY);
                setOrderPlaced(true);


                setTimeout(() => {
                    setFormData({
                        Name: '',
                        Email: '',
                        PhoneNumber: '',
                        Address: '',
                        PaymentMethod: 'COD'
                    });
                    setCartItems([]);
                }, 3000);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setCheckoutMessage('Failed to place order. Please try again.');
            setTimeout(() => {
                setCheckoutMessage('');
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="success-container">
                <div className="success-animation">
                    <div className="success-checkmark">
                        <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                        </div>
                    </div>
                    <div className="success-message">
                        <h2>Order Confirmed! 🎉</h2>
                        <p>Thank you for shopping with us!</p>
                        <p className="success-detail">We'll contact you shortly to confirm delivery.</p>
                        <div className="confetti-container">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="confetti"></div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="continue-shopping-btn"
                        onClick={() => window.location.href = '/'}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <TopOfHeader />
            <Header />

            <div className="checkout-container">
                {/* Mobile Cart Toggle Button */}
                <div className="mobile-cart-toggle">
                    <button
                        className="cart-toggle-btn"
                        onClick={() => setShowCart(!showCart)}
                    >
                        <span className="cart-icon">🛒</span>
                        <span className="cart-count">{cartItems.length} items</span>
                        <span className="toggle-arrow">{showCart ? '▼' : '▲'}</span>
                    </button>
                </div>

                <div className="checkout-header">
                    <h1 className="header-title">Checkout</h1>
                    <p className="header-subtitle">Complete your purchase</p>
                </div>

                <div className="checkout-content">
                    {/* Mobile Order Summary - Collapsible */}
                    <div className={`order-summary-mobile ${showCart ? 'show' : ''}`}>
                        <div className="mobile-summary-header">
                            <h3>Order Summary</h3>
                            <span className="total-amount">Rs. {calculateTotal().toFixed(2)}</span>
                        </div>

                        <div className="cart-items-mobile">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart">
                                    <div className="empty-icon">🛒</div>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div key={index} className="cart-item-mobile">
                                        <div className="item-image-mobile">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <div className="item-image-placeholder">📦</div>
                                            )}
                                        </div>
                                        <div className="item-details-mobile">
                                            <h4>{item.name}</h4>
                                            <div className="item-meta">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="item-price-mobile">Rs. {(item.discountedPrice * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mobile-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>Rs. {calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>Rs. {calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {checkoutMessage && (
                        <div className="checkout-toast">
                            {checkoutMessage}
                        </div>
                    )}
                    {/* Checkout Form */}
                    <div className="checkout-form-container">
                        <form onSubmit={handleSubmit} className="checkout-form">
                            {/* Contact Info Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <span className="section-number">1</span>
                                    <h2 className="section-title">Contact Information</h2>
                                </div>

                                <div className={`form-group ${shakeFields.includes('Name') ? 'shake' : ''}`}>
                                    <label htmlFor="Name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="Name"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className={errors.Name ? 'error' : ''}
                                    />
                                    {errors.Name && <span className="error-message">{errors.Name}</span>}
                                </div>

                                <div className={`form-group ${shakeFields.includes('Email') ? 'shake' : ''}`}>
                                    <label htmlFor="Email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="Email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        placeholder="you@example.com"
                                        className={errors.Email ? 'error' : ''}
                                    />
                                    {errors.Email && <span className="error-message">{errors.Email}</span>}
                                </div>

                                <div className={`form-group ${shakeFields.includes('PhoneNumber') ? 'shake' : ''}`}>
                                    <label htmlFor="PhoneNumber">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="PhoneNumber"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Your phone number"
                                        className={errors.PhoneNumber ? 'error' : ''}
                                    />
                                    {errors.PhoneNumber && <span className="error-message">{errors.PhoneNumber}</span>}
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <span className="section-number">2</span>
                                    <h2 className="section-title">Delivery Address</h2>
                                </div>
                                <div className={`form-group ${shakeFields.includes('Address') ? 'shake' : ''}`}>
                                    <label htmlFor="Address">Complete Address *</label>
                                    <textarea
                                        id="Address"
                                        name="Address"
                                        value={formData.Address}
                                        onChange={handleInputChange}
                                        placeholder="House number, street, city, postal code"
                                        rows="3"
                                        className={errors.Address ? 'error' : ''}
                                    />
                                    {errors.Address && <span className="error-message">{errors.Address}</span>}
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <span className="section-number">3</span>
                                    <h2 className="section-title">Payment Method</h2>
                                </div>
                                <div className="payment-methods">
                                    <div
                                        className={`payment-method ${formData.PaymentMethod === 'COD' ? 'selected' : ''}`}
                                        onClick={() => handlePaymentMethodClick('COD')}
                                    >
                                        <div className="payment-icon">💵</div>
                                        <div className="payment-details">
                                            <h3>Cash on Delivery</h3>
                                            <p>Pay when you receive your order</p>
                                        </div>
                                        <div className="payment-radio">
                                            <div className="radio-dot"></div>
                                        </div>
                                    </div>

                                    <div
                                        className="payment-method coming-soon"
                                        onClick={() => handlePaymentMethodClick('paypal')}
                                    >
                                        <div className="payment-icon">🔒</div>
                                        <div className="payment-details">
                                            <h3>PayPal</h3>
                                            <p>Secure online payment</p>
                                            <span className="coming-soon-badge">Coming Soon</span>
                                        </div>
                                    </div>

                                    <div
                                        className="payment-method coming-soon"
                                        onClick={() => handlePaymentMethodClick('card')}
                                    >
                                        <div className="payment-icon">💳</div>
                                        <div className="payment-details">
                                            <h3>Credit/Debit Card</h3>
                                            <p>Pay with your card</p>
                                            <span className="coming-soon-badge">Coming Soon</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Order Summary */}
                            <div className="desktop-order-summary">
                                <h3 className="summary-title">Order Summary</h3>

                                <div className="cart-items-desktop">
                                    {cartItems.length === 0 ? (
                                        <div className="empty-cart">
                                            <div className="empty-icon">🛒</div>
                                            <p>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        cartItems.map((item, index) => (
                                            <div key={index} className="cart-item-desktop">
                                                <div className="item-image-desktop">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} />
                                                    ) : (
                                                        <div className="item-image-placeholder">📦</div>
                                                    )}
                                                </div>
                                                <div className="item-details-desktop">
                                                    <h4>{item.name}</h4>
                                                    <p>Qty: {item.quantity}</p>
                                                </div>
                                                <div className="item-price-desktop">
                                                    Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div 
  className="summary-totals"
  style={{
    borderTop: '2px solid #eaeaea',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}
>
  <div 
    className="total-row"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #f0f0f0'
    }}
  >
    <span style={{
      fontSize: '0.95rem',
      color: '#555',
      fontWeight: '500'
    }}>
      Subtotal
    </span>
    <span style={{
      fontSize: '1rem',
      color: '#333',
      fontWeight: '600'
    }}>
      Rs. {calculateTotal().toFixed(2)}
    </span>
  </div>

  <div 
    className="total-row"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #f0f0f0'
    }}
  >
    <span style={{
      fontSize: '0.95rem',
      color: '#555',
      fontWeight: '500'
    }}>
      Shipping
    </span>
    <span 
      className="free"
      style={{
        fontSize: '0.95rem',
        color: '#10b981',
        fontWeight: '600',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}
    >
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        style={{ marginRight: '0.25rem' }}
      >
        <path d="M5 13l4 4L19 7"></path>
      </svg>
      FREE
    </span>
  </div>

  <div 
    className="total-row grand-total"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1rem',
      marginTop: '1rem',
      borderTop: '2px solid #eaeaea'
    }}
  >
    <span style={{
      fontSize: '1.2rem',
      color: '#1a1a1a',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    }}>
      Total Amount
    </span>
    <span style={{
      fontSize: '1.4rem',
      color: '#1a1a1a',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      Rs. {calculateTotal().toFixed(2)}
    </span>
  </div>

  {/* Optional: Tax calculation note */}
  <div style={{
    fontSize: '0.8rem',
    color: '#888',
    textAlign: 'center',
    marginTop: '1rem',
    paddingTop: '0.5rem',
    borderTop: '1px dashed #e0e0e0',
    fontStyle: 'italic'
  }}>
    All prices include applicable taxes
  </div>
</div>
                            </div>

                            {/* Place Order Button */}
                            <div className="place-order-section">
                                <button
                                    type="submit"
                                    disabled={isLoading || cartItems.length === 0}
                                    className="place-order-btn"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <span className="order-total">Rs. {calculateTotal().toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                <div className="security-notice">
                                    <div className="lock-icon">🔒</div>
                                    <p>Your information is secure and encrypted</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <UpperFooter />
            <Footer />
        </>
    );
};

export default Checkout;
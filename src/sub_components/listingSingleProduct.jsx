import React, { useState } from 'react'
import {Link} from 'react-router-dom'

export default function ListingSingleProduct({ Name, Price, DiscountedPrice, img, link }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const calculateDiscount = () => {
    if (!Price || !DiscountedPrice) return 0
    const original = parseFloat(Price)
    const discounted = parseFloat(DiscountedPrice)
    return Math.round(((original - discounted) / original) * 100)
  }

  const discountPercentage = calculateDiscount()

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const formatPrice = (price) => {
    if (!price) return 'RS. 0'
    return `RS. ${parseFloat(price).toLocaleString('en-IN')}`
  }

  return (
    <div className="singleProduct">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="discount-badge">
          {discountPercentage}% OFF
        </div>
      )}
      
      {/* Product Image */}
      <div className="image-container">
        <img 
          src={imageError ? '/api/placeholder/300/300' : img} 
          alt={Name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-loader"></div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <p className="product-name">{Name}</p>
        
        <div className="price-section">
          {Price && DiscountedPrice && Price !== DiscountedPrice ? (
            <>
              <p className="original-price">{formatPrice(Price)}</p>
              <p className="discounted-price">{formatPrice(DiscountedPrice)}</p>
            </>
          ) : (
            <p className="regular-price">{formatPrice(DiscountedPrice || Price)}</p>
          )}
        </div>
        
        <Link to={`/product/${link}`} className="quick-view-btn">
          Quick View
        </Link>
      </div>
    </div>
  )
}
import React from 'react';
import SingleUpperFooter from '../sub_components/singleUpperFooter';
import { faTruck, faHeadset, faExchangeAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export default function UpperFooter() {
  const Data = [
    {
      icon: faTruck,
      heading: "FREE SHIPPING", 
      text: "Free shipping on shopping over Rupees 5,000 all over Pakistan"
    },
    {
      icon: faHeadset,
      heading: "SUPPORT 24/7", 
      text: "Contact us 24 hours a day, 7 days a week"
    },
    {
      icon: faExchangeAlt,
      heading: "30 DAYS RETURN", 
      text: "Simply return it within 30 days for an exchange."
    },
    {
      icon: faShieldAlt,
      heading: "100% PAYMENT SECURE", 
      text: "We ensure secure payment with PEV"
    }
  ];
  
  return (
    <div className="upperfooter">
      <div className="innerupperfooter">
        {Data.map((item, index) => (
          <SingleUpperFooter 
            key={index}
            icon={item.icon}
            heading={item.heading}
            text={item.text}
          />
        ))}
      </div>
    </div>
  );
}
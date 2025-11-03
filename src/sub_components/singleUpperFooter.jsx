import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SingleUpperFooter({ icon, heading, text }) {
  return (
    <div className="singleUpperFooter">
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} className="feature-icon" />
      </div>
      <div className="content-container">
        <h3 className="feature-heading">{heading}</h3>
        <p className="feature-text">{text}</p>
      </div>
    </div>
  );
}
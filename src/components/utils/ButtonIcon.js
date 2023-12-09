import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonIcon = ({ icon, label, onClick, type }) => {
  return (
    <button className={`add-btn btn btn-outline-${type} shadow`}  type="button" onClick={onClick}>
      <span className="button-label">{label}</span>
      <FontAwesomeIcon icon={icon} className="ml-2" />
    </button>
  );
};

export default ButtonIcon;

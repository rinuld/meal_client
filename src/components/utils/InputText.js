import React from 'react';

const InputText = ({ label, id, type, placeholder, name, value, onChange, disabled }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        className='input-text'
        id={id}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete='off'
        disabled={disabled}
        required
      />
    </div>
  );
};

export default InputText;

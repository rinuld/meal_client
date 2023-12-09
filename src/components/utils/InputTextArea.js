import React from 'react';

const InputTextArea = ({ label, id, placeholder, name, value, onChange }) => {
    return (
        <div className='input-textarea'>
            <label htmlFor={id}>{label}</label>
            <br />
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
            />
        </div>
    );
};

export default InputTextArea;

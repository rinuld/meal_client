

export default function InputTexticon({ icon, label, id, type, placeholder, name, value, onChange, required }) {

  const inputStyle = {
    paddingLeft: `calc(${icon.length}px * 10 + 10px)`
  };
   

  return (
    <div className="input-with-icon">
      <label htmlFor={id}>{label}</label>
      <div className="input-container">
        <span className="unit">{icon}</span>
        <input
          label={label}
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          style={inputStyle}
          required={required}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
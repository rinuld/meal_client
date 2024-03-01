

export default function InputTexticon({ icon, label, id, type, placeholder, name, value, onChange, required }) {    
  return (
    <div>
      <label htmlFor={id}>{label}</label><label className="unit-space">in</label><label>{icon}</label>
      <div>
        <input
          className='input-text'
          label={label}
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
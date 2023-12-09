import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '85%',
        outline: state.isFocused ? '2px solid #A3C639' : 'none',
        fontSize: '14px',
        padding: '5px 5px 5px 10px',
        borderColor: 'gray',
    }),
};

const InputSelection = ({ label, data, onChange, value }) => {

    return (
        <div className='input-sepection'>
        <label>{label}</label>
        <Select
            options={data}
            value={value}
            styles={customStyles}
            onChange={onChange}
        />
        </div>
    );
};

export default InputSelection;

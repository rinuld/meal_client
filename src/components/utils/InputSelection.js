import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        height: '2.5em',
        outline: '1px solid transparent',
        border: '1px solid #202020',
        borderRadius: '1px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': { // Override hover styles
            border: '1px solid #202020', // Keep border color on hover
          },
        '&:focus': {
            outline: '1px solid #ACCF4F',
            border: '1px solid #ACCF4F',
        },
        '&:focus-within': { // Apply styles when select is focused or an option is selected
            outline: '1px solid #ACCF4F',
            border: '1px solid #ACCF4F',
        }
    }),
};


const InputSelection = ({ label, data, onChange, value }) => {

    return (
        <div className='input-selection'>
        <label>{label}</label>
        <Select
            className='input-selection'
            options={data}
            value={value}
            styles={customStyles}
            onChange={onChange}
        />
        </div>
    );
};

export default InputSelection;

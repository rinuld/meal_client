
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerInput = ({selectedDate, onChange, label, disabled}) => {
    const parsedDate = new Date(selectedDate);

    return (
        <div className='input-datepicker'>
        <label>{label}</label>
        <DatePicker
            className='input'
            selected={parsedDate}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="select a date"
            disabled={disabled}
        />
        </div>
    );
};

export default DatePickerInput;

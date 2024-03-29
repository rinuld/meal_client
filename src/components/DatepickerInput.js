
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerInput = ({selectedDate, onChange, label, disabled}) => {
    const parsedDate = new Date(selectedDate);

    return (
        <div>
        <label>{label}</label><br></br>
        <DatePicker
            className='input-text'
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

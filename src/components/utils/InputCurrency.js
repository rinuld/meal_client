function InputCurrency(input) {
    // Remove non-digit characters
    input = input.replace(/[^\d.]/g, '');
    
    input = input.replace(/^0+(?=\d)/, '');
    
    // Split the input into integer and decimal parts (if any)
    const [integerPart, decimalPart] = input.split('.');
    
    // Add commas every three digits in the integer part
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Add the decimal part (if any)
    const formattedNumber = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

    // const result = "Php " + formattedNumber;
    
    return formattedNumber;
  }

  export default InputCurrency
  
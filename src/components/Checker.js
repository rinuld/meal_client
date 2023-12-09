import React, { useState, useEffect } from 'react';

const Checker = ({ input, tableValues, column }) => {
    const [exists, setExists] = useState(false);
  
    useEffect(() => {  
      const valueExist = tableValues.some((row) => row[column]===input);
      setExists(valueExist);
    }, [input]);
  
    return (
      <div className='checker-result'>
        {exists ? 
        <div className='notvalid'>
        <p>value not available</p>
        </div> : 
        <div className='valid'>
        <p>value is available</p>
        </div>}
      </div>
    );
  };

export default Checker;

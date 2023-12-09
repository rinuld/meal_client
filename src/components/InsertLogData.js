
export const InsertLogData = (description, user) => {
    const currentDate = new Date();
    const date = currentDate.toDateString() + " " + currentDate.toLocaleTimeString();
  
    const requestData = {
      date,
      description,
      user
    };
  
    fetch('http://localhost:3001/api/createlogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });

  };
  
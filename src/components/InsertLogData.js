
export const InsertLogData = (description, user) => {
    const currentDate = new Date();
    const date = currentDate.toDateString() + " " + currentDate.toLocaleTimeString();
  
    const requestData = {
      date,
      description,
      user
    };
  
    fetch('https://meal-server.negrosanonyoungleaders.org/api/createlogs', {
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
  
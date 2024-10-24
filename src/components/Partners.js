import DataTable from "./DataTable";
import React, { useMemo, useState, useEffect, memo } from 'react';

const Partners = memo(({ projectID }) => {

  // initialize the table content
  const [partnerData, setData] = useState([]);

  // fetch data from the database and assign the value to the setData variable
  useEffect(() => {
    fetch(`https://meal-server.negrosanonyoungleaders.org/api/partners/${projectID}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log('Error fetching partners:', error);
      });
  }, [projectID]);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // setting up the table header and data
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'source',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Date Added',
        accessor: 'date',
        Cell: ({ value }) => formatDate(value), // Use formatDate function to format the date
      },
    ],
    []
  );

  
  console.log("Render Partners Table");

  return (
    <>
      <DataTable columns={columns} data={partnerData} />
    </>
  )
})

export default Partners;
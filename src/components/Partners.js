import DataTable from "./DataTable";
import React, { useMemo, useState, useEffect, memo } from 'react';

const Partners = memo(() => {

  // initialize the table content
  const [teamData, setData] = useState([]);

  // fetch data from the database and assign the value to the setData variable
  useEffect(() => {
    fetch('http://localhost:3001/api/partners')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log('Error fetching users:', error);
      });
  }, []);


  // setting up the table header and data
  const columns = useMemo(
    () => [
      {
        Header: 'Partner',
        accessor: 'partnerName',
      },
      {
        Header: 'Country',
        accessor: 'country',
      },
    ],
    []
  );

  
  console.log("Render Partners Table");

  return (
    <>
      <DataTable columns={columns} data={teamData} />
    </>
  )
})

export default Partners;
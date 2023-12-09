import DataTable from "../components/DataTable";
import React, { useMemo, useState, useEffect, memo } from 'react';

const Team = memo(() => {

  // initialize the table content
  const [teamData, setData] = useState([]);

  // fetch data from the database and assign the value to the setData variable
  useEffect(() => {
    fetch('http://localhost:3001/api/team')
      .then(response => response.json())
      .then(data => {
        // console.log(data)
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
        Header: 'Name',
        accessor: row => `${row.firstname} ${row.lastname}`,
        width: '30%',
      },
      {
        Header: 'Role',
        accessor: 'role',
        width: '30%',
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: '60%',
      }
    ],
    []
  );

  console.log("Render Team Table");

  return (
    <>
      <DataTable columns={columns} data={teamData} />
    </>
  )
})

export default Team;
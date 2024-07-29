// import DataTable from "../components/DataTable";
import DataTable from "./DataTable";
import React, { useMemo, useState, useEffect, memo } from 'react';

const Team = memo(({ projectID }) => { // Accept projectId as a prop

  // Initialize the table content
  const [teamData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the team members of the selected project first
    fetch(`http://localhost:3001/api/projectMembers/${projectID}`)
      .then(response => response.json())
      .then(data => {
        const members = data.teamMembers.split(', ').map(member => member.trim());
        return fetchUsers(members); // Fetch users based on the team members
      })
      .then(users => {
        setData(users);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        console.log('Error fetching users:', error);
        setLoading(false); // Stop loading on error
      });
  }, [projectID]);

  // Function to fetch users based on team members
  const fetchUsers = async (members) => {
    const userPromises = members.map(member => {
      const [firstname, lastname] = member.split(' '); // Split member name
      return fetch(`http://localhost:3001/api/users?firstname=${firstname}&lastname=${lastname}`)
        .then(response => response.json());
    });

    const userResults = await Promise.all(userPromises);
    return userResults.flat(); // Flatten the array of user results
  };

  // Setting up the table header and data
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: row => `${row.firstname} ${row.middlename || ''} ${row.lastname}`.trim(),
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

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <>
      <DataTable columns={columns} data={teamData} />
    </>
  );
})

export default Team;

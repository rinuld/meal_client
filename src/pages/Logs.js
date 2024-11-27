import { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable"


function Logs(){

    // initialize the table content
    const [logData, setData] = useState([]);
    

    // fetch data from the database and assign the value to the setData variable
    useEffect(() => {
        fetchLogs();
      }, []);
    
      const fetchLogs = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/logs');
          const data = await response.json();
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          const formattedData = sortedData.map(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true
            });
            
            return {
              ...item,
              formateddate: formattedDate
            };
          });
          setData(formattedData);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      };
      
    // setting up the table header and data
    const columns = useMemo(
        () => [
          {
            Header: 'Date',
            accessor: 'formateddate',
            width:'25%'
          },
          {
            Header: 'Description',
            accessor: 'description',
            width:'55%'
          },
          {
            Header: 'User',
            accessor: 'user',
            width:'10%'
          },
        ],
        []
      );

    return(
        <DataTable columns={columns} data={logData}/>
    )
}

export default Logs
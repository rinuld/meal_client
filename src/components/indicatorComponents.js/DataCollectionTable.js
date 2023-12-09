import React, { memo, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

const ParticipantsTable = memo(({ participantsdata }) => {
    const [sortedData, setSortedData] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');


    useEffect(() => {
        setSortedData(participantsdata);
    }, [participantsdata]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    useEffect(() => {
        const sortData = () => {
            const sorted = [...participantsdata].sort((a, b) => {
                if (sortColumn === 'name') {
                    return sortOrder === 'asc' ? a.lastname.localeCompare(b.lastname) : b.lastname.localeCompare(a.lastname);
                } else if (sortColumn === 'age') {
                    return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
                } else if (sortColumn === 'sex') {
                    return sortOrder === 'asc' ? a.sex.localeCompare(b.sex) : b.sex.localeCompare(a.sex);
                } else if (sortColumn === 'address') {
                    return sortOrder === 'asc'
                        ? a.cityMun.localeCompare(b.cityMun)
                        : b.cityMun.localeCompare(a.cityMun);
                } else if (sortColumn === 'org') {
                    return sortOrder === 'asc'
                        ? a.organization.localeCompare(b.organization)
                        : b.organization.localeCompare(a.organization);
                } else if (sortColumn === 'row') {
                    return sortOrder === 'asc' ? a.order - b.order : b.order - a.order;
                }
                return 0;
            });

            setSortedData(sorted);
        };

        sortData();
    }, [participantsdata, sortColumn, sortOrder]);

    console.log("Participants Table");
    return (
        <div className="card-table">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('row')}>No.</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('age')}>Age</th>
                        <th onClick={() => handleSort('sex')}>Sex</th>
                        <th onClick={() => handleSort('address')}>Address</th>
                        <th onClick={() => handleSort('org')}>Organization</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((participants) => (
                        <tr className='row-theme-1' key={participants.id}>
                            <td>{participants.order}</td>
                            <td>{participants.lastname} {participants.firstname}</td>
                            <td>{participants.age}</td>
                            <td>{participants.sex}</td>
                            <td>{participants.cityMun}</td>
                            <td>{participants.organization}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default ParticipantsTable;

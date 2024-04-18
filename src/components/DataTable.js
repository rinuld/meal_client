import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';

function DataTable({ columns, data }) {
    const defaultPageSize = 10;
    const {
        setGlobalFilter,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { globalFilter, pageIndex, pageSize }, setPageSize
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: defaultPageSize },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const handleGlobalFilterChange = e => {
        const value = e.target.value || '';
        setGlobalFilter(value);
    };

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize);
        gotoPage(0);
    };


    const paginatedRows = rows.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);


    console.log('Render Datatable.js');
    return (
        <>
            <div className='datatable card-table'>
                <div class="row">
                    <div class="col-12 col-md-6">
                    <select className='textbox show-page' value={pageSize} onChange={handlePageSizeChange}>
                        {[10, 25, 50, 70, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div class="col-12 col-md-6">
                        <input
                            className='search-btn'
                            type="text"
                            value={globalFilter}
                            onChange={handleGlobalFilterChange}
                            placeholder="Search..."
                            defaultValue=""
                        />
                    </div>
                </div>
                <table className='overflow-hidden nowrap' {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    style={{ width: column.width }}>
                                      <div className='datatable-header'>
                                        <span>{column.render('Header')}</span>
                                            <span className='sort-columns'>
                                                {column.isSorted ? (column.isSortedDesc ? <i className="fas fa-sort-down"></i> : <i className="fas fa-sort-up"></i>) : <i className="fas fa-minus"></i>}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {data.length === 0 ? (
                        <tbody>
                            <tr className='datatable-row'>
                                <td colSpan={headerGroups[0].headers.length} className="no-data-cell">
                                    <div className="no-data-content">No data available</div>
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody {...getTableBodyProps()}>
                            {paginatedRows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr className='datatable-row' {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                <div class="row">
                    <div class="col-12 col-md-6 show-page-number">               
                        <span>
                            | Go to page:{' '}
                            <input className='textbox'
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(page);
                                }}
                                style={{ width: '50px' }}
                            />
                        </span>{' '}

                        <span className='row-count' >
                            Showing {paginatedRows.length} of {data.length} entries
                        </span>
                    </div> 
                    <div class="col-12 col-md-6 show-pagination"> 
                        <div className="pagination">
                            <button className='textbox-page' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                {'<<'}
                            </button>{' '}
                            <button className='textbox-page' onClick={() => previousPage()} disabled={!canPreviousPage}>
                                {'<'}
                            </button>{' '}
                            <span>
                                Page{' '}
                                <strong>
                                    {pageIndex + 1} of {pageOptions.length}
                                </strong>{' '}
                            </span>
                            <button className='textbox-page' onClick={() => nextPage()} disabled={!canNextPage}>
                                {'>'}
                            </button>{' '}
                            <button className='textbox-page' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                {'>>'}
                            </button>{' '}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}



export default DataTable
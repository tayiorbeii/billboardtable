import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import { readRemoteFile } from "react-papaparse";
import {useRowSelect, useTable, useBlockLayout, useSortBy, useFilters} from 'react-table'
import {FixedSizeList} from 'react-window'

export default function Home() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    async function getData() {
      readRemoteFile("/data/billboard.csv", {
        complete: (data) => setData(data.data),
        header: true,
      });
    }
    getData();
  }, []);



  // console.log(data)

  // console.log(data);

  const DanceabilityRangeColumnFilter = ({column: filterValue = [], preFilteredRows, setFilter, id}) => {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min)
        max = Math.max(row.values[id], max)
      })
      return [min, max]
    }, [id, preFilteredRows])

    return (
      <div className='flex'>
        <input value={filterValue[0] || ''}
            type="number"
            onChange={e => {
              const val = e.target.value
              setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
            }}
            placeholder={`Min (${min})`}
            style={{
              width: '70px',
              marginRight: '0.5rem',
            }}
          />
          to
          <input
            value={filterValue[1] || ''}
            type="number"
            onChange={e => {
              const val = e.target.value
              setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
            }}
            placeholder={`Max (${max})`}
            style={{
              width: '70px',
              marginLeft: '0.5rem',
            }}
          />
      </div>
    )
  }

    // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length

    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    )
  }

  const columns = React.useMemo(() => [
    {
      Header: 'Rank',
      accessor: 'rank',
      width: 30
    },
    {
      Header: 'Song Title',
      accessor: 'track'
    },
    {
      Header: 'Artist',
      accessor: 'primaryArtist'
    },
    {
      Header: 'Artwork',
      accessor: 'albumArtUrl',
      Cell: ({value}) => console.log(value ? value : 'http://www.fillmurray.com/100/100') || <img src={value ? value : 'http://www.fillmurray.com/100/100'} />,
      width: 100
    },
    {
      Header: 'Danceability',
      accessor: 'danceability',
      Filter: DanceabilityRangeColumnFilter,
      filter: 'between'
    },
  ], [])

  const defaultColumn = React.useMemo(
    () => ({
      width: 300,
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth
  } = useTable({
    columns,
    data,
    defaultColumn,
    filterTypes
  }, useBlockLayout, useFilters, useSortBy)


  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => {
          return (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? '☝️'
                      : '👇'
                    : ''
                  }
                </span>
                <div>
                  {column.canFilter
                    ? column.render('Filter')
                    : null
                  }
                </div>
               </th>
            ))}
          </tr>
        )})}
      </thead>
      <tbody {...getTableBodyProps()}>
        <FixedSizeList height={800} width={totalColumnsWidth} itemCount={rows.length} itemSize={100}>
          {({index, style}) => {
            const row = rows[index]
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} style={style}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          }}
        </FixedSizeList>
      </tbody>
    </table>
  );
}

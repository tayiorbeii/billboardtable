import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import { readRemoteFile } from "react-papaparse";
import {useRowSelect, useTable, useBlockLayout} from 'react-table'
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
    }
  ], [])

  const defaultColumn = React.useMemo(
    () => ({
      width: 300,
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
    defaultColumn
  }, useBlockLayout)


  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => {
          return (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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

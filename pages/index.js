import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import { readRemoteFile } from "react-papaparse";
import {useRowSelect, useTable} from 'react-table'

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
      accessor: 'rank'
    },
    {
      accessor: 'track'
    }
  ], [])



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

import React from 'react';
import { FaBarcode } from 'react-icons/fa';
const Table = ({ data, handleBarCode }) => {
    const columns = data[0] && Object.keys(data[0])

    return <table className='table'>
        <thead>
            <tr>
                <th className="text-uppercase">BarCode</th>
                {data[0] && columns.map(header => <th className="text-uppercase">{header}</th>)}
            </tr>
        </thead>
        <tbody>
            {data.map(row => <tr key={row.code}>
                <td>
                    <FaBarcode onClick={() => handleBarCode(row.code, row.mrp, row.name)} size={35} />
                </td>
                {
                    columns.map(column => <td>{row[column]}</td>)
                }
            </tr>)}
        </tbody>
    </table>
};

export default Table;

import React from "react";
import { FaBarcode, FaEdit, DollarOutline } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as Icons from "heroicons-react";

const ProductTable = ({
  data,
  handleBarCode,
  handelDeleteProduct,
  handelPriceUpdateModal,
}) => {
  const columns = data[0] && Object.keys(data[0]);
  //   console.log(columns);
  //   console.log(data);

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-uppercase">BC</th>
          {data[0] &&
            columns.map((header) =>
              header === "id" ? (
                ""
              ) : (
                <th className="text-uppercase">{header}</th>
              )
            )}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row["id"]}>
            <td>
              <FaBarcode
                onClick={() => handleBarCode(row.code, row.mrp, row.name)}
                size={25}
              />
            </td>
            {columns.map((column) =>
              column === "id" ? (
                ""
              ) : (
                <td>
                  {column === "name"
                    ? row[column].substring(0, 30)
                    : row[column]}
                </td>
              )
            )}
            <td>
              <Icons.CurrencyBangladeshiOutline
                className="icon-mrp"
                onClick={() => handelPriceUpdateModal(row["code"])}
                size={20}
              ></Icons.CurrencyBangladeshiOutline>
              {/* <Link to={`/product/${row["id"]}`}>
                <Icons.EyeOutline
                  className="icon-eye"
                  size={20}
                ></Icons.EyeOutline>
              </Link> */}
              <Link to={`/product/update/${row["id"]}`} target="_blank">
                <Icons.PencilAltOutline
                  className="icon-edit"
                  size={20}
                ></Icons.PencilAltOutline>
              </Link>
              <Icons.TrashOutline
                className="icon-trash"
                onClick={() => handelDeleteProduct(row["id"])}
                size={20}
              ></Icons.TrashOutline>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;

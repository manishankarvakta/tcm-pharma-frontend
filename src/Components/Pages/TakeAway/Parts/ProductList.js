import React from "react";
import { BsPlusCircleFill, BsPlusCircleOutline } from "react-icons/bs";

const ProductList = () => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Size</th>
            <th>Price</th>
            <th>Add</th>
          </tr>
        </thead>
        <thead>
          <tr>
            <td>
              <img />
            </td>
            <td>Name Name Name Name</td>
            <td>100g</td>
            <td>250tk</td>
            <td>
              <BsPlusCircleFill></BsPlusCircleFill>
            </td>
          </tr>
          <tr>
            <td>
              <img />
            </td>
            <td>Name Name Name Name</td>
            <td>100g</td>
            <td>250tk</td>
            <td>
              <BsPlusCircleFill></BsPlusCircleFill>
            </td>
          </tr>
          <tr>
            <td>
              <img />
            </td>
            <td>Name Name Name Name</td>
            <td>100g</td>
            <td>250tk</td>
            <td>
              <BsPlusCircleFill></BsPlusCircleFill>
            </td>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ProductList;

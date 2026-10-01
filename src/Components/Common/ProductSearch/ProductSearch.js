import React, { Component } from "react";
import Select from "react-select";
import useProducts from "../../Hooks/useProducts";

const ProductSearch = ({ handleProductOnChange, searchResult, addToCart }) => {
  // const [products] = useProducts()
  // const options = products;
  console.log();

  // const MyComponent = () => (
  //     <Select options={options} />
  // )
  return (
    <>
      <div className="col-md-12">
        {/* {MyComponent()} */}
        {
          <input
            type="text"
            onChange={handleProductOnChange}
            id="productSearch"
            placeholder="Product"
            className="form-control"
            autoFocus
          />
        }
        <div className="search-wrapper w-70">
          {searchResult?.length > 0 ? (
            <ul>
              {searchResult?.map((product) => (
                <li
                  key={product.article_code}
                  onClick={() => addToCart(product)}
                >
                  {product.ean} - {product.name} - ({product.article_code}) - {product.price} BDT
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ProductSearch;

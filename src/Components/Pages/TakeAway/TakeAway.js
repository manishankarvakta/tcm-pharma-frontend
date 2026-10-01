import React, { useState, useEffect } from "react";
import CategoryList from "./Parts/CategoryList";
import ProductList from "./Parts/ProductList";
import ProductGird from "./Parts/ProductGird";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";

const App = () => {
  const [productView, setProductView] = useState(false);
  return (
    <div className="pos-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2">
            <CategoryList></CategoryList>
          </div>
          <div className="col-sm-7">
            <div className="row">
              <div className="col-12">
                <p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Foods"
                  />
                </p>
                <div className="ProductView">
                  {productView === false ? (
                    <ProductList></ProductList>
                  ) : (
                    <ProductGird></ProductGird>
                  )}
                </div>
              </div>
              <div className="col-12 fixed-bottom d-flex w-100 bottom-0">
                <div
                  class="btn-group  pb-1"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    onClick={(e) => setProductView(false)}
                    class="btn btn-dark"
                  >
                    <BsListUl size={22}></BsListUl>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => setProductView(true)}
                    class="btn btn-dark"
                  >
                    <BsGrid3X3Gap size={22}></BsGrid3X3Gap>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <p>POS Finalizer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

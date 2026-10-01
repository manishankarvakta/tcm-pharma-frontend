import React from "react";
import photo from "../../../../product.jpg";

const ProductGrid = () => {
  return (
    <div className="row g-0">
      <div className="col-3">
        <div className="card text-center">
          <span className="badge badge-dark position-absolute">420৳</span>
          <img className="card-img-top" src={photo} alt="Card image cap" />
          <div className="card-body  p-1">
            <p className="card-text mb-1" style={{ fontSize: "10px" }}>
              Some quick example text
            </p>
          </div>
        </div>
      </div>
      <div className="col-3">
        <div className="card text-center">
          <span className="badge badge-dark position-absolute">420৳</span>
          <img className="card-img-top" src={photo} alt="Card image cap" />
          <div className="card-body  p-1">
            <p className="card-text mb-1" style={{ fontSize: "10px" }}>
              Some quick example text
            </p>
          </div>
        </div>
      </div>
      <div className="col-3">
        <div className="card text-center">
          <span className="badge badge-dark position-absolute">420৳</span>
          <img className="card-img-top" src={photo} alt="Card image cap" />
          <div className="card-body  p-1">
            <p className="card-text mb-1" style={{ fontSize: "10px" }}>
              Some quick example text
            </p>
          </div>
        </div>
      </div>
      <div className="col-3">
        <div className="card text-center">
          <span className="badge badge-dark position-absolute">420৳</span>
          <img className="card-img-top" src={photo} alt="Card image cap" />
          <div className="card-body  p-1">
            <p className="card-text mb-1" style={{ fontSize: "10px" }}>
              Some quick example text
            </p>
          </div>
        </div>
      </div>
      <div className="col-3">
        <div className="card text-center">
          <span className="badge badge-dark position-absolute">420৳</span>
          <img className="card-img-top" src={photo} alt="Card image cap" />
          <div className="card-body  p-1">
            <p className="card-text mb-1" style={{ fontSize: "10px" }}>
              Some quick example text
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;

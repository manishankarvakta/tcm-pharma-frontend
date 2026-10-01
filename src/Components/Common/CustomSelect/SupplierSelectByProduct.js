import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useSupplierByProductQuery } from "../../../services/supplierApi";

const SupplierSelectByProduct = ({
  article_code,
  handleOnChange,
  name,
  value,
}) => {
  // console.log("articleCode:", article_code);
  let [supplier, setSupplier] = useState([]);
  const supplierList = useSupplierByProductQuery(article_code);

  // console.log(value);
  //   const id = "5410235"

  useEffect(() => {
    let vendors = [];
    if (supplierList.data) {
      supplierList.data?.map((vendor) => {
        let item = vendor.products.find((v) => v.article_code === article_code);
        // item?.map(v => {
        // console.log("items:", item);
        vendors = [
          ...vendors,
          {
            option: vendor._id,
            label: `${vendor?.company} - ${vendor.name}`,
          },
        ];

        // })
        // console.log(vendor);
      });
      // supplierList.data.map((vendor) => {
      //   // if (item) {
      // console.log(supplierList.data.length);
    }
    // });
    // console.log(vendors);
    setSupplier(vendors);
  }, [supplierList.data]);

  // console.log("vendor:", supplier);
  // console.log("vendorList:", supplierList.data);
  // console.log(supplier[supplier.map((obj) => obj.option).indexOf(value[0].id))
  // console.log(supplier[0]);
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={supplier[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={(e) => handleOnChange(name, e)}
        name={name}
        options={supplier}
        value={
          value &&
          supplier[supplier.map((obj) => obj.option).indexOf(value)]
        }
      />
    </Fragment>
  );
};

export default SupplierSelectByProduct;

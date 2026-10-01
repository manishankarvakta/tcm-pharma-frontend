import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useWarehousesQuery } from "../../../services/warehouseApi";

const WareHouseDW = ({ warehouse, handleOnChange, name, value }) => {
  const { data, error, isLoading, isFetching, isSuccess } =
    useWarehousesQuery();
  let [warehouseOption, setWarehouseOption] = useState([]);

  // console.log(warehouse)
  useEffect(() => {
    let warehouseOptions = [{ option: "no-warehouse", label: "Select Warehouse" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((warehouse) => {
          warehouseOptions = [
            ...warehouseOptions,
            {
              option: warehouse._id,
              label: `${warehouse.name} - [ ${warehouse.address} ]`,
            },
          ];
        });
        setWarehouseOption(warehouseOptions);
      }
    }
  }, [data]);

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={warehouseOption[0]}
        value={
          warehouse &&
          warehouseOption[warehouseOption.map((obj) => obj.option).indexOf(warehouse)]
        }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        name={name}
        onChange={handleOnChange}
        options={warehouseOption}
      />
    </Fragment>
  );
};

export default WareHouseDW;

import { id } from "date-fns/locale";
import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useWarehouseQuery } from "../../../services/warehouseApi";

const WareHouseDWPurchaseUpdate = ({ wh, handleOnChange, name }) => {
  const { data, error, isLoading, isFetching, isSuccess } = useWarehouseQuery(
    `${wh}`
  );
  let [warehouseOption, setWarehouseOption] = useState([]);
  // console.log("warehouse", data)
  useEffect(() => {
    let warehouseOptions = [];
    if (isSuccess) {
      if (data) {
        warehouseOptions = [
          ...warehouseOptions,
          {
            option: data._id,
            label: `${data.name} - [ ${data.address} ]`,
          },
        ];
      }

      setWarehouseOption(warehouseOptions);
    }
  }, [data]);

  // console.log("warehouseOption", warehouseOption);

  return (
    <Fragment>
      <Select
        // options={options}
        defaultValue={warehouseOption[0]}
        value={warehouseOption[0]}
        isDisabled={true}
        // onChange={handleSelectChange}
      />
      {/* <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={data[0].warehouse}
        // value={data[0].warehouse}
        defaultValue={warehouseOption[0]}
        // value={warehouseOption[warehouseOption.indexOf(0)]?.option}
        // value={warehouseOption[warehouseOption.indexOf(wh)].option}
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        name={name}
        onChange={handleOnChange}
      // options={warehouseOption}
      /> */}
    </Fragment>
  );
};

export default WareHouseDWPurchaseUpdate;

import { Fragment, useEffect, useState } from "react";
import Select from "react-select";

const PriceSelectByProductPromoPrice = ({ handleOnChangePP, data, spp }) => {
  const [options, setOptions] = useState([]);
  const [defaultP, setDefaultP] = useState({ label: "no price", option: 0 });

  // console.log("data", data?.priceList)
  useEffect(() => {
    let selectedPrice = [];
    if (data) {
      data?.priceList
        ?.slice()
        .filter((p) => p.status === "active")
        .map((price) => {
          selectedPrice = [
            ...selectedPrice,
            {
              option: price?._id,
              label: `${price?.mrp} BDT`,
            },
          ];
        });
      // if (data?.promo_price._id) {
      //     setSelected({ label: `${data?.promo_price?.mrp} BDT`, option: `${data?.promo_price?._id}` })
      // }
      setOptions(selectedPrice);
      setDefaultP(selectedPrice[0]);
    }
  }, [data]);

  // console.log(options);
  return (
    <Fragment>
      <Select
        // styles={customStyles}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={spp.length > 0 ? defaultP : spp}
        value={spp}
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={(e) => handleOnChangePP(e)}
        options={options}
      />
    </Fragment>
  );
};

export default PriceSelectByProductPromoPrice;

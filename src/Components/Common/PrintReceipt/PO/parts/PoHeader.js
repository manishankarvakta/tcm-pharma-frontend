/* eslint-disable jsx-a11y/img-redundant-alt */
import Barcode from "react-barcode";
import Logo from "../../../../../logo_pharma.jpg";

const PoHeader = ({ purchase, format, title, storeSettings }) => {
  const supplier = purchase?.supplier;
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  // console.log(supplier);
  // console.log(purchase);
  return (
    <>
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-7">
          <img
            src={Logo}
            height="60"
            alt="not Image"
            className="print-logo"
          />
        </div>

        <div className="col-5">
          <p className="p-0 m-0 text-end">
            <b>Hotline: </b> {storeSettings?.phone}
          </p>
          <p className="p-0 m-0 text-end">
            <small>{storeSettings?.address?.street},{storeSettings?.address?.state}-{storeSettings?.address?.zip}</small>{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 print-header-text">
          <p>
            <b>To:</b> <br />
            {supplier?.company} <br />
            {supplier?.email} <br />
            {supplier?.phone} <br />
            {supplier?.address} <br />
          </p>

          <p>
            <b>Form:</b> <br />
            {storeSettings?.storeName || "Aamar Dokan"} <br />
            {storeSettings?.email} <br />
            {storeSettings?.phone} <br />
            {storeSettings?.address?.state},
            {storeSettings?.address?.country} <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              PO No: {purchase?.poNo}
              <br />
              PO Date:{" "}
              {purchase?.createdAt &&
                format(new Date(purchase?.createdAt), "MM-dd-yyyy")}{" "}
              <br />
              PO Time:{" "}
              {purchase?.createdAt &&
                format(new Date(purchase?.createdAt), "h:m:s aaa")}
              <br />
              Status: {purchase?.status}
            </p>
            <p className="text-end bar-code">
              <Barcode
                value={purchase?.poNo}
                height="60"
                width="2"
                fontSize="10"
              />
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default PoHeader;

/* eslint-disable jsx-a11y/img-redundant-alt */
import Barcode from "react-barcode";
import Logo from "../../logo_pharma.jpg";
import { signInUser } from "../Utility/Auth";

const TpnHeader = ({ tpn, format, title }) => {
  const auth =signInUser();
  const {storeSettings}=auth;
   const PHOTO_BASE_URL =
     process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  // const supplier = purchase.supplier;
  console.log("tpn", tpn);
  // console.log(purchase);
  return (
    <>
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-7">
          <img
            src={Logo}
            height="60"
            alt="Image"
          />
        </div>

        <div className="col-5">
          <p className="p-0 m-0 text-end">
            <b>Hotline: </b> {storeSettings?.phone}
          </p>
          <p className="p-0 m-0 text-end">
            <small>
              {storeSettings?.address?.street},{storeSettings?.address?.state}-
              {storeSettings?.address?.zip}
            </small>{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 print-header-text">
          <p>
            <b>To</b> <br />
            Warehouse: {tpn?.warehouseTo?.name} <br />
            {/* {tpn?.warehouseTo?.email} <br /> */}
            Phone: {tpn?.warehouseTo?.phone} <br />
            Address: {tpn?.warehouseTo?.address} <br />
          </p>

          <p>
            <b>Form</b> <br />
            WareHouse: {tpn?.warehouseFrom?.name} <br />
            {/* {tpn?.warehouseTo?.email} <br /> */}
            Phone: {tpn?.warehouseFrom?.phone} <br />
            Address: {tpn?.warehouseFrom?.address} <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              Tpn No: {tpn?.tpnNo}
              <br />
              PO Date:{" "}
              {tpn?.createdAt &&
                format(new Date(tpn?.createdAt), "MM-dd-yyyy")}{" "}
              <br />
              PO Time:{" "}
              {tpn?.createdAt && format(new Date(tpn?.createdAt), "h:m:s aaa")}
              <br />
              Status: {tpn.status}
            </p>
            <p className="text-end bar-code">
              {/* <Barcode
                value={purchase?.poNo}
                height="60"
                width="2"
                fontSize="10"
              /> */}
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default TpnHeader;

import Barcode from "react-barcode";
import { signInUser } from "../../Utility/Auth";
import Logo from "../../../logo_pharma.jpg"
const auth = signInUser();
const storeSettings = auth?.storeSettings;
const PopularProductsSalesHeader = ({
  data,
  format,
  title,
  endDate,
  startDate,
}) => {
  console.log(data);
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  const now = format(new Date(), "MM-dd-yyyy hh:mm:ss");
  return (
    <>
      <div className="row pt-3 pb-3 mb-2 border-bottom">
        <div className="col-7">
          <img
            src={Logo}
            alt=""
            width="180"
            className="print-logo"
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
            <b>Form:</b> <br />
            {storeSettings?.storeName || "Aamar Dokan"} <br />
            {storeSettings?.email} <br />
            {storeSettings?.phone} <br />
            {storeSettings?.address?.state},{storeSettings?.address?.country}{" "}
            <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              {startDate} to {endDate}
            </p>
            <p>Print Time : {now && now}</p>
            <p className="text-end bar-code">
              <Barcode value={data?._id} height="60" width="2" fontSize="10" />
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default PopularProductsSalesHeader;

import { format } from "date-fns";
import Logo from "../../../logo_pharma.jpg";
import { signInUser } from "../../Utility/Auth";
const auth = signInUser();
const storeSettings = auth?.storeSettings;
const AllCategoriesSalePrintHeader = ({ endDate, startDate }) => {
  const now = format(new Date(), "MM-dd-yyyy hh:mm:ss");
  console.log(now);
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  return (
    <>
      <div className="row  border-bottom">
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
            </small>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 print-header-text">
          <h3>All Categories Sale</h3>
        </div>
        <div className="col-6 print-header-text">
          <p>From: {startDate}</p>
          <p>To :{endDate}</p>
        </div>
        <div className="col-6 text-end">
          <p>Print Time : {now && now}</p>
        </div>
      </div>
    </>
  );
};

export default AllCategoriesSalePrintHeader;

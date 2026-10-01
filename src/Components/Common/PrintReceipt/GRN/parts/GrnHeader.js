/* eslint-disable jsx-a11y/img-redundant-alt */
import Barcode from "react-barcode";
import Logo from "../../../../../logo_pharma.jpg";
import { signInUser } from "../../../../Utility/Auth";

const GrnHeader = ({ grn, format, title }) => {
  const auth = signInUser();
  const { storeSettings } = auth;
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const [supplier, setSupplier] = useState({});
  // const getSupplier = async () => {
  //   await axios
  //     .get(`${BASE_URL}/supplier/${grn?.supplier}`)
  //     .then((response) => setSupplier(response.data));
  // };
  // useEffect(() => {
  //   getSupplier();
  // }, [grn]);
  console.log(grn);
  return (
    <>
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-md-7 col-3">
          <img src={Logo} height="70" alt="not Image" className="print-logo" />
        </div>

        <div className="col-md-5 col-9">
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
            <b>To</b>
            {grn?.supplier?.name} <br />
            {grn?.supplier?.company} <br />
            {grn?.supplier?.phone} <br />
            {grn?.supplier?.email} <br />
            {grn?.supplier?.address} <br />
          </p>

          <p>
            <b>Form</b> <br />
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
              GRN No: {grn?.grnNo}
              <br />
              PO No: {grn?.poNo?.poNo}
              <br />
              PO Date:{" "}
              {grn?.createdAt &&
                format(new Date(grn?.createdAt), "yyyy-MM-dd")}{" "}
              <br />
              PO Time:{" "}
              {grn?.createdAt && format(new Date(grn?.createdAt), "h:m:s aaa")}
              <br />
            </p>
            <p className="text-end bar-code">
              <Barcode value={grn?._id} height="60" width="2" fontSize="10" />
            </p>
          </span>
        </div>
        
      </div>
    </>
  );
};

export default GrnHeader;

import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { useProductLedgerDetailsQuery } from "../../services/productApi";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SideBar from "../Common/SideBar/SideBar";

const ProductLedger = () => {
  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);
  const [id, setId] = useState();
  const { productId } = useParams();

  //   console.log(productId);

  useEffect(() => {
    setId(productId);
  }, [productId]);

  // const [page, setPage] = useState(0);
  // const [size, setSize] = useState(100);
  // const [q, setQ] = useState("");

  // const [pageCount, setPageCount] = useState(0);
  // const [pageNo, setPageNo] = useState();

  // const pageCountQuery = useInventoriesCountQuery();
  // console.log('Inventory count ', pageCount)

  // useEffect(() => {
  //     const { data } = pageCountQuery;
  //     setPageCount(data);
  // }, [pageCountQuery]);

  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));

  const [onExportShow, setOnExportShow] = useState(false);
  const handleExportClose = () => setOnExportShow(false);

  // const [onDetailsShow, setOnDetailsShow] = useState(false);
  // const handleDetailsClose = () => setOnDetailsShow(false);

  // const [onExportSummaryShow, setOnExportSummarytShow] = useState(false);
  // const handleExportSummaryClose = () => setOnExportSummarytShow(false);

  // const { data, error, isLoading, isFetching, isSuccess, refetch } =
  //     useProductLedgerPagenationQuery({
  //         startDate,
  //         endDate,
  //         page,
  //         size,
  //         q,
  //     });
  // const { data: exportP, isSuccess: eIsExport, refetch: eRefetch } = useProductLedgerExportQuery({
  //     startDate,
  //     endDate,
  // });
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductLedgerDetailsQuery({
      id,
      startDate,
      endDate,
    });

  useEffect(() => {
    isSuccess ? setLoader(false) : setLoader(true);
  }, [isSuccess]);

  // // console.log("ledger", data)
  console.log("data",data);
  // console.log("datasalereturndetails",data?.saleReturnDetails);
  // useEffect(() => {
  //     refetch()
  // }, [startDate, endDate, page, size, q]);

  useEffect(() => {
    console.log(startDate, endDate, id);
    refetch();
    setLoader(true);
  }, [startDate, endDate, id]);

  // useEffect(() => {
  //     eRefetch()
  //     if (exportP?.message) {
  //         notify("Report Generation SuccessFull")
  //     }
  // }, [exportP, startDate, endDate, eIsExport]);

  // // console.log("exportP", exportP)

  // const handleDataLimit = (e) => {
  //     setSize(parseInt(e.target.value));
  //     setPageNo(getPageNumber);
  //     refetch();
  // }
  // const handleSearch = (e) => {
  //     setQ(e.target.value);
  //     refetch();
  // }
  // const handlePageClick = (data) => {
  //     setPage(parseInt(data.selected));
  //     setPageNo(getPageNumber);
  //     refetch();
  // };
  // const getPageNumber = () => {
  //     const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  // };
  const handelExportModal = () => {
    // console.log("hello");
    setOnExportShow(true);
  };
  // const handelExportSummaryModal = () => {
  //     // console.log("hello");
  //     setOnExportSummarytShow(true);
  // };

  // const handleProductDetailsView = (id) => {
  //     // console.log("id", id);
  //     setOnDetailsShow(true)
  //     setId(id)
  //     prefetch()

  // };
  return (
    <div>
      <div className="container-fluid ">
        <LoadingModal
          title={"Please Wait"}
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="All Products"></Header>
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="date-picker d-flex align-items-center gap-2">
                  <strong>Start:</strong>
                  <DatePicker
                    selected={new Date(startDate)}
                    className="form-control"
                    onChange={(date) =>
                      setStartDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                  <strong>End:</strong>
                  <DatePicker
                    selected={new Date(endDate)}
                    className="form-control"
                    onChange={(date) =>
                      setEndDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2 mt-md-0 d-flex justify-content-end">
                <Button
                  variant="dark"
                  className="d-flex align-items-center gap-2"
                  onClick={handleExportClose}
                >
                  <Icons.PlusOutline size={22} /> Export Details
                </Button>
              </div>
            </div>

            <div>
              <div className="container py-2">
                {/* Product Details section */}
                <div className=" pt-3 pb-4 mb-2 border-bottom ">
                  <div className="row">
                    {/* Product Name Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Product:</strong> {data?.name}
                        </p>
                      </div>
                    </div>

                    {/* Article Code Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Article Code:</strong> {data?.article_code}
                        </p>
                      </div>
                    </div>

                    {/* Group Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Group:</strong> {data?.group?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Supplier Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Supplier:</strong> {data?.supplier}
                        </p>
                      </div>
                    </div>

                    {/* Closing Quantity Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Closing:</strong>{" "}
                          {data?.grnPQty +
                            data?.saleRPQty -
                            data?.salePQty -
                            data?.damagePQty -
                            data?.rtvPQty -
                            data?.tpnPQty +
                            (data?.grnQty +
                              data?.saleRQty -
                              data?.saleQty -
                              data?.damageQty -
                              data?.rtvQty -
                              data?.tpnQty)}
                        </p>
                      </div>
                    </div>

                    {/* Opening Quantity Section */}
                    <div className="col-md-4 mb-3">
                      <div className="bg-gray-100">
                        <p className="text-start mb-1">
                          <strong>Opening:</strong>{" "}
                          {data?.grnPQty +
                            data?.saleRPQty -
                            data?.salePQty -
                            data?.damagePQty -
                            data?.rtvPQty -
                            data?.tpnPQty}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* GRN Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total GRN :</strong> {data?.grnQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for GRN details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.grnDetails?.length > 0 ? (
                              data?.grnDetails
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.grnNo}</td>
                                    <td>{item?.qty}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td>
                                      {format(
                                        new Date(item?.createdAt),
                                        "MMMM d, yyyy"
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No GRN Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* RTV Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total RTV :</strong> {data?.rtvQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for RTV details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.rtvDetails?.length > 0 ? (
                              data?.rtvDetails
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.rtvNo}</td>
                                    <td>{item?.qty}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td>
                                      {format(
                                        new Date(item?.createdAt),
                                        "MMMM d, yyyy"
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No RTV Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Damage Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total Damage :</strong> {data?.damageQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for Damage details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.damageDetails?.length > 0 ? (
                              data?.damageDetails
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.damageNo}</td>
                                    <td>{item?.qty}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td>
                                      {format(
                                        new Date(item?.createdAt),
                                        "MMMM d, yyyy"
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No Damage Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* TPN Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total TPN :</strong> {data?.tpnQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for TPN details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.tpnDetails?.length > 0 ? (
                              data?.tpnDetails
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.invoiceId}</td>
                                    <td>{item?.qty}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td>
                                      {format(
                                        new Date(item?.createdAt),
                                        "MMMM d, yyyy"
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No TPN Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Sale Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total Sale :</strong> {data?.saleQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for Sale details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.saleDetails?.length > 0 ? (
                              data?.saleDetails

                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.invoiceId}</td>
                                    <td>{item?.qty}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td>
                                      {format(
                                        new Date(item?.createdAt),
                                        "MMMM d, yyyy"
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No Sale Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Sale Return Section */}
                  <div className="row pt-1 pb-1 mb-3">
                    <p className="p-0 m-0 text-start">
                      <strong>Total Sale Return :</strong> {data?.saleRQty}
                    </p>
                    <div className="row pt-2">
                      <div className="col-12">
                        {/* Table for Sale Return details */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">TP</th>
                              <th scope="col">MRP</th>
                              <th scope="col">Entry Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(data?.saleReturnDetails) &&
                            data.saleReturnDetails.length > 0 ? (
                              data.saleReturnDetails
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                  <tr key={item.invoiceId}>
                                    <td>{item.invoiceId}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.tp}</td>
                                    <td>{item.mrp}</td>
                                    <td>
                                      {item.createdAt
                                        ? format(
                                            new Date(item.createdAt),
                                            "MMMM d, yyyy"
                                          )
                                        : "N/A"}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  Sorry! No Sale Return Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLedger;

import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";

import { Helmet } from "react-helmet";
import {
  useSaleCategoryByDateQuery,
  useSaleFootfallQuery,
  useSaleTotalQuery,
} from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import Header from "../Common/Header/Header";
import AllCategoriesModal from "../Common/Modal/AllCategoriesModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";

const AllCategorySale = () => {
  const auth = signInUser();
  const aamarId = auth?.aamarId;
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [articleSale, setArticleSale] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const [loader, setLoader] = useState(true);
        const lang = useSelector((state) => state.languageReducer);
  
  const handleLoaderClose = () => setLoader(false);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleCategoryByDateQuery({
      startDate,
      endDate,
    });
  console.log("data", data);
  const {
    data: footfall,
    error: ferror,
    isLoading: fisloading,
    isFetching: fIsfetching,
    isSuccess: fIsSuccess,
    refetch: fRefetch,
  } = useSaleFootfallQuery({
    startDate,
    endDate,
  });
  // console.log("footfall", footfall);
  const {
    data: total,
    error: terror,
    isLoading: tIsloading,
    isFetching: tIsfetching,
    isSuccess: tIsSuccess,
    refetch: tRefetch,
  } = useSaleTotalQuery({
    startDate,
    endDate,
    aamarId,
  });
  console.log("total", total);

  useEffect(() => {
    refetch();
    // fRefetch();
    // tRefetch();
  }, [startDate, endDate]);

  useEffect(() => {
    if (isLoading) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isLoading]);
  useEffect(() => {
    let articleSales = [];
    // console.log("article", data);

    // (product = [...product, sale.products])
    // console.log(sale?.products);
    let product = [];
    console.log("data", data);
    data?.map((sale) => {
      // console.log(product);
      articleSales = [
        ...articleSales,
        {
          code: sale?._id?.code,
          name: sale?._id?.name,
          totalQuantity: sale?.totalQuantity,
          totalValue: sale?.totalValue,
        },
      ];
    });
    console.log("articleSales", articleSales);
    setArticleSale(articleSales);
  }, [isSuccess, isFetching]);

  const articleHeaders = [
    { label: "Code", key: "code" },
    { label: "Name", key: "name" },
    { label: "totalQuantity", key: "totalQuantity" },
    { label: "totalValue", key: "totalValue" },
  ];

  // let exportData = [];
  useEffect(() => {
    if (articleSale.length > 0) {
      let expD = articleSale;
      setExportData(expD);
    }
  }, [articleSale]);
  const handleAllCategoryPrint = () => {
    setShow(true);
  };
  const [whName, setWhName] = useState(" ");

  const { data: wh } = useWarehouseQuery(auth?.warehouse);

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const preHeader = [
    [`${auth?.storeSettings?.storeName || "No-Name"}`],
    [`${auth?.storeSettings?.address?.street || "No-Street"}`],
    [
      `${auth?.storeSettings?.address?.city || "No-City"}-${
        auth?.storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],
    [`all Category Sales Report`],

    [], // Empty row for spacing
  ];
  return (
    <div>
      {/* <LoadingModal
        title={"Please Wait"}
        onShow={loader}
        handleClose={handleLoaderClose}
      ></LoadingModal> */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-All-Categories</title>
      </Helmet>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.allCategoriesSales}></Header>
            <div className="row">
              <div className="col-md-12">
                {/* Sort date range */}
                <div className=" d-md-flex justify-content-between mt-2">
                  <div className="d-flex gap-2">
                    <div className="">
                      <DatePicker
                        selected={new Date(startDate)}
                        className="form-control me-2"
                        onChange={(date) =>
                          setStartDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>
                    <div className="">
                      <DatePicker
                        selected={new Date(endDate)}
                        className="form-control me-2"
                        onChange={(date) =>
                          setEndDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-2 mt-md-0 justify-content-md-end">
                    <Button
                      className="btn btn-dark me-2"
                      onClick={() => handleAllCategoryPrint()}
                    >
                      <Icons.Printer />
                      Print Report
                    </Button>
                    {data && data?.length > 0 ? (
                      <CsvDownloader
                        preheader={preHeader}
                        buttonName={
                          <span>
                            <Icons.DownloadOutline
                              className="icon-trash text-warning"
                              size={22}
                            />
                            Download Report
                          </span>
                        }
                        data={data}
                        fileName={`Export all Category sales Report - [${today.toDateString()}].csv`}
                      />
                    ) : (
                      <button className="btn btn-dark" disabled>
                        {lang?.loadingCSV}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <Link to="/category-sales" className="btn btn-dark float-end my-2  mx-2">Category Sales </Link> */}
            <Table hover className="mt-4">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Name</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Total </th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  data.map((cat) => (
                    <tr key={cat.code}>
                      {/* <th >{i++}</th> */}
                      <th scope="row">{cat.code}</th>
                      <td>{cat.name}</td>
                      <td>{cat?.totalQuantity}</td>
                      <td>{cat?.totalValue}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>Loading...</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {}
          </div>
        </div>
      </div>
      <AllCategoriesModal
        show={show}
        handleClose={handleClose}
        cat={data}
        startDate={startDate}
        endDate={endDate}
        footfall={footfall}
        total={total}
      ></AllCategoriesModal>
    </div>
  );
};

export default AllCategorySale;

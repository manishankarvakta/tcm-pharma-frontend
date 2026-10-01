/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Card, Toast } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Header from "../../Common/Header/Header";
import SideBar from "../../Common/SideBar/SideBar";
import LineChart from "./Chart/LineChart";
import PieChart from "./Chart/PieChart";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCity,
  FaCcAmex,
  FaCcDiscover,
  FaExclamationCircle,
} from "react-icons/fa";
import { SiBracbank, SiEbl, SiMutualtrustbank } from "react-icons/si";

import { format } from "date-fns";
import {
  startOfToday,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subMonths,
} from "date-fns";
import { useSelector } from "react-redux";
import { useTodayDamagesQuery } from "../../../services/damageApi";
import {
  useTodayGrnsQuery,
  useWeeklyGrnsQuery,
} from "../../../services/grnApi";
import {
  useDashboardSaleViewQuery,
  useLossProfitTotalQuery,
  useSaleTotalQuery,
} from "../../../services/saleApi";
import WareHouseDW from "../../Common/CustomSelect/WareHouseDW";
import { signInUser } from "../../Utility/Auth";
import { SlHandbag } from "react-icons/sl";
import { GiReturnArrow } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const auth = signInUser();
  const [warehouse, setWarehouse] = useState("allWh");
  const lang = useSelector((state) => state.languageReducer);

  const aamarId = auth?.aamarId;

  //dashboard all data
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleTotalQuery({
      startDate: format(startDate, "MM-dd-yyyy"),
      endDate: format(endDate, "MM-dd-yyyy"),
      warehouse,
      aamarId,
    });
  const { data: lossProfitData, refetch: refetchLossProfit } =
  useLossProfitTotalQuery({
      startDate: format(startDate, "MM-dd-yyyy"),
      endDate: format(endDate, "MM-dd-yyyy"),
      warehouse,
      aamarId,
    });

  // //due calculation data
  // const { data: DueCalculation, refetch: refetchDue } = useDueCalculationQuery({
  //   startDate: format(startDate, "MM-dd-yyyy"),
  //   endDate: format(endDate, "MM-dd-yyyy"),
  //   warehouse,
  //   aamarId,
  // });

  //sales data
  const { data: salesData, refetch: refetchSales } = useDashboardSaleViewQuery({
    startDate: format(startDate, "MM-dd-yyyy"),
    endDate: format(endDate, "MM-dd-yyyy"),
    warehouse,
    aamarId,
  });

  console.log("salesData", salesData);

  const handleWarehouseChange = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
  };

  const handleDateRangeChange = (type) => {
    const today = startOfToday();
    let newStartDate = today;
    let newEndDate = today;

    if (type === "today") {
      newStartDate = today;
      newEndDate = today;
    } else if (type === "last3days") {
      newStartDate = subDays(today, 2);
      newEndDate = today;
    } else if (type === "lastweek") {
      newStartDate = startOfWeek(subWeeks(today, 6), { weekStartsOn: 0 }); // Sunday as start of week
      newEndDate = today;
    } else if (type === "last30days") {
      newStartDate = subMonths(today, 1);
      newEndDate = today;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    refetch();
    refetchSales();
    refetchLossProfit();
  }, [startDate, endDate, warehouse, aamarId]);

  useEffect(() => {
    if (auth?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(auth?.warehouse);
    }
  }, []);

  const isToday =
    format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd") &&
    format(startDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  // console.log("data",data)

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.dashboard}></Header>
            {/* Date and Warehouse Filters */}
            <div className="dashboard-filters mb-4">
              <div className="row g-2 align-items-end">
                <div className="col-auto">
                  <label htmlFor="startDate" className="form-label mb-0">
                    Start Date:
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-auto">
                  <label htmlFor="endDate" className="form-label mb-0">
                    End Date:
                  </label>
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-auto">
                  <label htmlFor="warehouse" className="form-label mb-0">
                    Warehouse:
                  </label>
                  <WareHouseDW
                    id="warehouse"
                    name="warehouse"
                    handleOnChange={handleWarehouseChange}
                    className="form-control "
                  />
                </div>
                <div className="col-auto ms-auto">
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleDateRangeChange("today")}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleDateRangeChange("last3days")}
                    >
                      Last 3 Days
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleDateRangeChange("lastweek")}
                    >
                      Last Week
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleDateRangeChange("last30days")}
                    >
                      Last 30 Days
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* dashboard design */}
            <div className="dashboard-main">
              {/* Summary Cards Row */}
              <div className=" gap-3 mb-4 dashboard-summary-row d-flex justify-content-between align-content-center ">
                <div className="w-100 ">
                  <div
                    className="dashboard-card"
                    style={{ backgroundColor: "#37AFFF15" }}
                  >
                    <div
                      className="dashboard-card-icon  text-white"
                      style={{ backgroundColor: "#37AFFF" }}
                    >
                      <VscGraph size={28} />
                    </div>
                    <div className="dashboard-card-content">
                      <div className="dashboard-card-label">Total Sale</div>
                      <div className="dashboard-card-value">
                        {data
                          ? Intl.NumberFormat().format(
                              data?.roundedGrossTotal || 0
                            )
                          : 0}
                        ৳
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="dashboard-card"
                    style={{ backgroundColor: "#F2652D15" }}
                  >
                    <div className="dashboard-card-icon bg-primary text-white">
                      <SlHandbag size={28} />
                    </div>
                    <div className="dashboard-card-content">
                      <div className="dashboard-card-label">
                        {lang?.bucketSize}
                      </div>
                      <div className="dashboard-card-value">
                        {Intl.NumberFormat().format(
                          (data?.mrpTotal
                            ? data?.mrpTotal / data?.footfall
                            : 0
                          )?.toFixed(2)
                        )}{" "}
                        ৳
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="dashboard-card"
                    style={{ backgroundColor: "#19875415" }}
                  >
                    <div className="dashboard-card-icon bg-success text-white">
                      <Icons.UserGroupOutline size={28} />
                    </div>
                    <div className="dashboard-card-content">
                      <div className="dashboard-card-label">
                        {lang?.footFalls}
                      </div>
                      <div className=" d-flex align-items-center gap-2">
                        <div className="dashboard-card-value">
                          {data
                            ? Intl.NumberFormat().format(data?.footfall || 0)
                            : 0}{" "}
                        </div>
                        <small className="mt-1">People</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="dashboard-card"
                    style={{ backgroundColor: "#0DCAF015" }}
                  >
                    <div className="dashboard-card-icon bg-info text-white">
                      <Icons.ShoppingCartOutline size={28} />
                    </div>
                    <div className="dashboard-card-content">
                      <div className="dashboard-card-label">Sold Items</div>
                      <div className=" d-flex align-items-center gap-2">
                        <div className="dashboard-card-value">
                          {data ? data?.totalItem || 0 : 0}
                        </div>
                        <small className="mt-1">Items</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="dashboard-card"
                    style={{ backgroundColor: "#FFC10715" }}
                  >
                    <div className="dashboard-card-icon bg-warning text-white">
                      <GiReturnArrow size={28} />
                    </div>
                    <div className="dashboard-card-content">
                      <div className="dashboard-card-label">Return Invoices</div>
                      <div className=" d-flex align-items-center gap-2">
                        <div className="dashboard-card-value">
                          {data?.returnInvoiceCount !== undefined
                            ? data.returnInvoiceCount
                            : 0}
                        </div>
                        <small className="mt-1">Invoices</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="dashboard-section-card h-100">
                    <div className="dashboard-section-title">
                      {lang?.sales || "Sales Trend"}
                    </div>
                    <div style={{ height: 260 }}>
                      <LineChart warehouse={warehouse} aamarId={aamarId} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-section-card h-100">
                    <div className="dashboard-section-title">
                      {lang?.profitLoss || "Profit/Loss"}
                    </div>
                    <div style={{ height: 260 }}>
                      {lossProfitData &&
                      (lossProfitData.totalSaleMRP > 0 ||
                        lossProfitData.totalSaleTP > 0 ||
                        lossProfitData.totalProfit !== 0) ? (
                        <>
                          <PieChart
                            sale={lossProfitData?.totalSaleMRP}
                            cogs={lossProfitData?.totalSaleTP}
                            lossProfit={lossProfitData?.totalProfit}
                          />
                        </>
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center h-100 text-muted"
                          style={{ fontSize: "2rem" }}
                        >
                          <FaChartPie />
                          <span
                            style={{ fontSize: "1rem", marginTop: "0.5rem" }}
                          >
                            {lang?.dataNotFound || "Data not found"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's / Date Range Sales Section */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="dashboard-section-card">
                    <div className="dashboard-section-title">
                      {isToday ? "Today's Sales" : "Sales Breakdown"}
                    </div>
                    <div className="sales-breakdown">
                      <div className="sales-breakdown-item">
                        <span className="label">MRP Total:</span>
                        <span className="value">
                          {data?.mrpTotal
                            ? Intl.NumberFormat().format(
                                Math.round(Number(data?.mrpTotal || 0))
                              )
                            : 0}
                          ৳
                        </span>
                      </div>
                      {Number(data?.vat || 0) > 0 && (
                        <div className="sales-breakdown-item">
                          <span className="label">VAT:</span>
                          <span className="value">
                            {Intl.NumberFormat().format(
                              Math.round(Number(data?.vat || 0))
                            )}{" "}
                            ৳
                          </span>
                        </div>
                      )}
                      <div className="sales-breakdown-item">
                        <span className="label">Total Return:</span>
                        <span className="value">
                          {data?.returnTotal
                            ? Intl.NumberFormat().format(
                                Math.round(Math.abs(Number(data?.returnTotal || 0)))
                              )
                            : 0}
                          ৳
                        </span>
                      </div>
                      <div className="sales-breakdown-item">
                        <span className="label">Discount:</span>
                        <span className="value">
                          {data?.discount
                            ? Intl.NumberFormat().format(
                                Math.round(Number(data?.discount || 0))
                              )
                            : 0}
                          ৳
                        </span>
                      </div>
                      <div className="sales-breakdown-item">
                        <span className="label">Promo Discount:</span>
                        <span className="value">
                          {Intl.NumberFormat().format(
                            Math.round(Number(data?.promo_discount || data?.promoDiscount || 0))
                          )}
                          ৳
                        </span>
                      </div>
                      <div className="sales-breakdown-item total">
                        <span className="label">Gross Total:</span>
                        <span className="value">
                          {data
                            ? Intl.NumberFormat().format(
                                Number(data?.roundedGrossTotal || 0)
                              )
                            : 0}
                          ৳
                        </span>
                      </div>
                      <div className="sales-breakdown-item net">
                        <span className="label">Net Sales:</span>
                        <span className="value">
                          {Intl.NumberFormat().format(
                            Math.round(
                              (Number(data?.mrpTotal || 0) + Number(data?.vat || 0)) -
                              (Math.abs(Number(data?.returnTotal || 0)) +
                                Number(data?.discount || 0) +
                                Number(data?.promo_discount || data?.promoDiscount || 0))
                            )
                          )}
                          ৳
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payments Received Section */}
                <div className="col-md-6">
                  <div className="dashboard-section-card">
                    <div className="dashboard-section-title d-flex justify-content-between align-content-center">
                      <p>Payments Received</p>
                      <p>
                        Total:{" "}
                        {data
                          ? Intl.NumberFormat().format(data?.totalReceived || 0)
                          : 0}
                        ৳
                      </p>
                    </div>
                    <div className="payments-grid">
                      <div className="payment-item">
                        <span className="label">
                          <FaMoneyBillWave className="me-2" />
                          Cash
                        </span>
                        <span className="value">
                          {" "}
                          {data
                            ? Intl.NumberFormat().format(data?.cash || 0)
                            : 0}
                          ৳
                        </span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcMastercard className="me-2" />
                          Bkash
                        </span>
                        <span className="value">{data?.bkash || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcMastercard className="me-2" />
                          Nagad
                        </span>
                        <span className="value">{data?.nagad || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcMastercard className="me-2" />
                          Upay
                        </span>
                        <span className="value">{data?.upay || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcMastercard className="me-2" />
                          Rocket
                        </span>
                        <span className="value">{data?.rocket || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcVisa className="me-2" />
                          Visa
                        </span>
                        <span className="value">{data?.visa || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcMastercard className="me-2" />
                          Master Card
                        </span>
                        <span className="value">{data?.masterCard || 0}৳</span>
                      </div>

                      <div className="payment-item">
                        <span className="label">
                          <FaCity className="me-2" />
                          CITY
                        </span>
                        <span className="value">{data?.CITY || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcAmex className="me-2" />
                          AMEX
                        </span>
                        <span className="value">{data?.AMEX || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">
                          <FaCcDiscover className="me-2" />
                          DBBL
                        </span>
                        <span className="value">{data?.DBBL || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">BRAC</span>
                        <span className="value">{data?.BRAC || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">EBL</span>
                        <span className="value">{data?.EBL || 0}৳</span>
                      </div>
                      <div className="payment-item">
                        <span className="label">MTB</span>
                        <span className="value">{data?.MTB || 0}৳</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="col-12">
                <div className="dashboard-section-card">
                  <div className="dashboard-section-title d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="h5 mb-0">Recent Sales</span>
                    </div>
                    <Link to="/sales" className="btn btn-view-all">
                      <Icons.ArrowRightOutline size={18} className="me-1" />
                      View All
                    </Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 recent-sales-table">
                      <thead>
                        <tr>
                          <th className="ps-4">Invoice ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Biller</th>
                          <th className="text-end">Items</th>
                          <th className="text-end">Gross Total</th>
                          <th className="text-end">Paid</th>
                          <th className="text-end">Change</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData?.length > 0 ? (
                          <>
                            {salesData?.slice(0, 5)?.map((sale) => (
                              <tr key={sale._id} className="align-middle">
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <strong>{sale.invoiceId}</strong>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex flex-column">
                                    <span className="text-muted small">
                                      {sale?.date &&
                                        format(
                                          new Date(sale?.date),
                                          "MMM dd, yyyy"
                                        )}
                                    </span>
                                    <span className="small">
                                      {sale?.date &&
                                        format(new Date(sale?.date), "hh:mm a")}
                                    </span>
                                  </div>
                                </td>
                                <td>{sale?.customer || "Walkway Customer"}</td>
                                <td>{sale?.biller || "-"}</td>
                                <td className="text-center">
                                  {sale?.totalItem}
                                </td>
                                <td className="text-center">
                                  {sale?.grossTotal}৳
                                </td>
                                <td className="text-end">{sale?.paidTotal}৳</td>
                                <td className="text-center">
                                  <div className="fw-medium text-muted">
                                    {sale?.changeAmount}৳
                                  </div>
                                </td>
                                <td className="text-center">
                                  {sale?.due ? (
                                    <span className="badge bg-danger-subtle text-danger">
                                      <Icons.ClockOutline
                                        size={14}
                                        className="me-1"
                                      />
                                      Bill Due
                                    </span>
                                  ) : (
                                    <span className="badge bg-success-subtle text-success">
                                      <Icons.CheckCircleOutline
                                        size={14}
                                        className="me-1"
                                      />
                                      Complete
                                    </span>
                                  )}
                                </td>
                                <td className="text-end">
                                        <div className="d-flex justify-content-center gap-2">
                                          <Link
                                            to={`/print/${sale._id}`}
                                            target="_blank"
                                          >
                                            <Icons.EyeOutline
                                              size={20}
                                              className="text-primary cursor-pointer"
                                            />
                                          </Link>
                                        </div>
                                      </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center py-5">
                              <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                                <Icons.ExclamationCircleOutline
                                  size={32}
                                  className="mb-2"
                                />
                                <span className="fw-medium">
                                  No sales data found
                                </span>
                                <small className="text-muted">
                                  Recent sales will appear here
                                </small>
                              </div>
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
    </>
  );
};

export default Dashboard;

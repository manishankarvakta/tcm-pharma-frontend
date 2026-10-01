import React, { useEffect, useState } from "react";
import { Toast, Card, Table } from "react-bootstrap";
import Header from "../../Common/Header/Header";
import SideBar from "../../Common/SideBar/SideBar";
import * as Icons from "heroicons-react";
import LineChart from "./Chart/LineChart";
import PieChart from "./Chart/PieChart";
import Select from "react-select";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import {
  useSaleFootfallQuery,
  useSalesPointSpentQuery,
  useSalesWeeklyQuery,
  useSaleTotalQuery,
} from "../../../services/saleApi";
import { useTodayGrnsQuery, useWeeklyGrnsQuery } from "../../../services/grnApi";
import { useTodayDamagesQuery } from "../../../services/damageApi";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const {
    data: total,
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useSaleTotalQuery({
    startDate: startDate,
    endDate: endDate,
  });

  const { data: footfall } = useSaleFootfallQuery({
    startDate: startDate,
    endDate: endDate,
  });
  const { data: pointSpent } = useSalesPointSpentQuery();
  // console.log({ startDate: "10-01-2022", endDate: "10-02-2022" });
  //{ data, error, isLoading, isFetching, isSuccess, refetch }

  useEffect(() => {
    // console.log(total);
  }, total?.isSuccess);

  // console.log(startDate, endDate, footfall, total);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const { data: weeklySale, isSuccess: isSuccessSale } = useSalesWeeklyQuery();
  // const { data: weeklyPurchase, isSuccess: isSuccessPurchase } = useWeeklyPurchasesQuery();
  const { data: weeklyGRN, isSuccess: isSuccessGRN } = useWeeklyGrnsQuery();
  const { data: todayTotalGRN, isSuccess: isSuccessTodayGRN } = useTodayGrnsQuery();

  const { data: todayTotalDamage, isSuccess: isSuccessTodayDamage } = useTodayDamagesQuery();
  // const [weekDates, setWeekDates] = useState([])
  const [weekSales, setWeekSales] = useState(0)
  // const [weekPurchase, setWeekPurchase] = useState([])
  const [weekGRN, setWeekGRN] = useState([])
  const [lossProfit, setLossProfit] = useState(0)
  const [todaySale, setTodaySale] = useState(0)
  const [todayGrn, setTodayGrn] = useState(0)
  const [todayDamage, setTodayDamage] = useState(0)
  useEffect(() => {
    console.log(total)
    if (total?.length > 0) {
      setTodaySale(total[0]?.grossTotalRound)
    }
    console.log(todayTotalGRN)
    if (todayTotalGRN?.length > 0) {
      setTodayGrn(todayTotalGRN[0]?.total)
    }
    console.log(todayTotalDamage)
    if (todayTotalDamage?.length > 0) {
      setTodayDamage(todayTotalDamage[0]?.total)
    }


  }, [isSuccess, total, isSuccessTodayGRN, todayTotalGRN, todayTotalDamage, isSuccessTodayDamage])
  console.log(todayDamage)
  console.log(todayGrn)
  console.log(todaySale)

  useEffect(() => {
    const total = parseFloat(todaySale) - parseFloat(todayGrn)
    setLossProfit(total)

  }, [todaySale, todayGrn])

  useEffect(() => {
    let g = 0;
    if (weeklyGRN?.length > 0) {
      weeklyGRN?.slice().map((grn) => {
        g = g + grn.total
      })
      setWeekGRN(g)
    }
    // console.log(dates)

  }, [weeklyGRN, isSuccessGRN])

  useEffect(() => {
    let sales = 0;
    if (weeklySale?.length > 0) {
      weeklySale?.slice().map((sale) => {
        sales = sales + sale.grossTotalRound;

      })
      setWeekSales(sales)

    }

  }, [weeklySale, isSuccessSale])

  console.log(weekSales)
  console.log(weekGRN)

  // useEffect(() => {
  //   const total = parseFloat(weekSales) - parseFloat(weekGRN)
  //   setLossProfit(total)

  // }, [weekSales, weekGRN])
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Dashboard"></Header>
            <div className="row pt-3">
              <div className="col-md-8">
                <div className="row pt-3 mb-3">
                  {/* <div className="col-md-4">
                    <Card style={{ width: "14rem" }}>
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          Card Subtitle
                        </Card.Subtitle>
                        <Card.Text>
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </Card.Text>
                        <Card.Link href="#">Card Link</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link>
                      </Card.Body>
                    </Card>
                  </div> */}
                  <div className="col-md-12">
                    <Card
                      className="bg-white text-dark h-80"
                      style={{ boxShadow: `rgba(0, 0, 0, 0.25) 0px 5px 15px` }}
                    >
                      <LineChart className="h-50" />
                    </Card>
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-md-3">
                    <Toast>
                      <Toast.Body>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          Today's Sales
                        </h2>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          2,12,545.02 <b>৳</b>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-md-3">
                    <Toast>
                      <Toast.Body>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          Today's Sales
                        </h2>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          2,12,545.02 <b>৳</b>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-md-3">
                    <Toast>
                      <Toast.Body>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          Today's Sales
                        </h2>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          2,12,545.02 <b>৳</b>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-md-3">
                    <Toast>
                      <Toast.Body>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          Today's Sales
                        </h2>
                        <h2
                          className="text-center"
                          style={{ fontSize: `12px` }}
                        >
                          {" "}
                          2,12,545.02 <b>৳</b>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                </div> */}
              </div>
              {/* <PieChart style={{ marginTop: `23px` }} /> */}
              <div className="col-md-4 pt-3">
                <Card
                  className="bg-white text-dark mb-3"
                  style={{ boxShadow: `rgba(0, 0, 0, 0.25) 0px 5px 15px` }}
                >
                  <PieChart style={{ marginTop: `20px` }} />
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <h2 className="text-center" style={{ fontSize: `16px` }}>
                        <small>Sale</small>
                        <br />
                        <b style={{ fontSize: `18px` }}> {total ? total[0]?.grossTotalRound : 0}</b>
                        {/* <b style={{ fontSize: `18px` }}>{weekGRN.toFixed(2)}</b> */}
                      </h2>
                    </div>
                    <div className="col-md-4">
                      <h2 className="text-center" style={{ fontSize: `16px` }}>
                        <small>Overhead</small>
                        <br />
                        <b style={{ fontSize: `18px` }}>{todayDamage.toFixed(2)}</b>
                      </h2>
                    </div>
                    <div className="col-md-4">
                      <h2 className="text-center" style={{ fontSize: `16px` }}>
                        <small>loss/profit</small>
                        <br />
                        <b style={{ fontSize: `18px` }}>{lossProfit?.toFixed(2)}</b>
                      </h2>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-md-3">
                <Toast>
                  <Toast.Body>
                    <Icons.CashOutline> </Icons.CashOutline>
                    <strong className="ms-2 me-auto"> Today's Sales</strong>
                    <h2 className="text-center">
                      {total ? total[0]?.grossTotalRound : 0}
                      <small> ৳</small>
                    </h2>
                  </Toast.Body>
                </Toast>
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-3">
                    <Toast>
                      <Toast.Body>
                        <Icons.ShoppingBag> </Icons.ShoppingBag>
                        <strong className="ms-2 me-auto"> Bucket Size</strong>
                        <h2 className="text-center">
                          {(total && footfall
                            ? total[0]?.grossTotalRound / footfall[0]?.footfall
                            : 0
                          )?.toFixed(2)}
                          <small> ৳</small>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-3">
                    <Toast>
                      <Toast.Body>
                        <Icons.UserGroup> </Icons.UserGroup>
                        <strong className="ms-2 me-auto"> Foot Falls</strong>{" "}
                        <h2 className="text-center">
                          {footfall && footfall[0]?.footfall}
                          <small> People</small>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-3">
                    <Toast>
                      <Toast.Body>
                        <Icons.ReplyOutline className="ms-3" size={18} />
                        <strong className="ms-2 me-auto"> Vat</strong>
                        <h2 className="text-center">
                          {total && total[0]?.vat?.toFixed(2)} <small> ৳</small>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                  <div className="col-3">
                    <Toast>
                      <Toast.Body>
                        <Icons.CashOutline> </Icons.CashOutline>
                        <strong className="ms-2 me-auto">Point Spent</strong>
                        <h2 className="text-center">
                          {pointSpent ? pointSpent?.spentPoint : 0}
                          <small> ৳</small>
                        </h2>
                      </Toast.Body>
                    </Toast>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

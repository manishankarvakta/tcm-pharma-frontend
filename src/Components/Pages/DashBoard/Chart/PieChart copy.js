import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useSalesWeeklyQuery, useSaleTotalQuery } from "../../../../services/saleApi";
import { useTodayGrnsQuery, useWeeklyGrnsQuery } from "../../../../services/grnApi";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);



const PieChart = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const {
    data: todayTotalSale,
    error,
    isLoading,
    isFetching,
    isSuccessToday,
    refetch,
  } = useSaleTotalQuery({
    startDate: startDate,
    endDate: endDate,
  });
  const { data: weeklySale, isSuccess: isSuccessSale } = useSalesWeeklyQuery();
  // const { data: weeklyPurchase, isSuccess: isSuccessPurchase } = useWeeklyPurchasesQuery();
  const { data: weeklyGRN, isSuccess: isSuccessGRN } = useWeeklyGrnsQuery();
  const { data: todayTotalGRN, isSuccess: isSuccessTodayGRN } = useTodayGrnsQuery();
  // const [weekDates, setWeekDates] = useState([])
  const [weekSales, setWeekSales] = useState([])
  // const [weekPurchase, setWeekPurchase] = useState([])
  const [weekGRN, setWeekGRN] = useState([])
  const [lossProfit, setLossProfit] = useState(0)
  const [todaySale, setTodaySale] = useState(0)
  const [todayGrn, setTodayGrn] = useState(0)

  useEffect(() => {
    console.log(todayTotalSale)
    if (todayTotalSale) {
      setTodaySale(todayTotalSale[0]?.grossTotalRound)
    }
    console.log(todayTotalGRN)
    if (todayTotalGRN) {
      setTodayGrn(todayTotalGRN[0]?.total)
    }


  }, [isSuccessToday, todayTotalSale, isSuccessTodayGRN, todayTotalGRN])

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
        sales = sales + sale?.grossTotalRound;

      })
      setWeekSales(sales)

    }

  }, [weeklySale, isSuccessSale])

  // console.log(weekSales)
  // console.log(weekGRN)

  useEffect(() => {
    const total = parseFloat(todaySale) - parseFloat(todayGrn)
    setLossProfit(total)

  }, [todaySale, todayGrn])


  console.log(todaySale)
  console.log(todayGrn)
  console.log(lossProfit)


  const data = {
    labels: ["OverHead", "Sale", "loss/profit"],
    datasets: [
      {
        label: "Loss - Profit",
        data: [0, todaySale, lossProfit],
        backgroundColor: ["#ed3833", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
    maintainAspectRatio: true,
    // responsive: true
  };
  return (

    <>
      <div style={{ height: `230px`, width: `230px`, margin: `0 auto` }}>
        <Doughnut data={data} />
      </div>
    </>
  );
};

export default PieChart;

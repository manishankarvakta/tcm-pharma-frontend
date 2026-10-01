import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useWeeklyGrnsQuery } from "../../../../services/grnApi";
import { useWeeklyPurchasesQuery } from "../../../../services/purchasApi";
import { useSalesWeeklyQuery } from "../../../../services/saleApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ warehouse, aamarId }) => {
  const {
    data: weeklySale,
  } = useSalesWeeklyQuery({ warehouse, aamarId });
  const {
    data: weeklyPurchase,
  } = useWeeklyPurchasesQuery({ warehouse, aamarId });
  const {
    data: weeklyGRN,
  } = useWeeklyGrnsQuery({ warehouse, aamarId });
  
  // console.log("weeklySale",warehouse, aamarId  )


  const data = {
    labels: weeklySale?.label || [],
    datasets: [
      {
        label: "Purchase",
        data: weeklyPurchase?.value || [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#facd55",
        tension: 0.4,
      },
      {
        label: "Sales",
        data: weeklySale?.value || [],
        fill: true,
        borderColor: "#3fed33",
        tension: 0.4,
      },
      {
        label: "GRN",
        data: weeklyGRN?.value || [],
        fill: true,
        borderColor: "#ed3833",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        // ticks: {
        //   maxRotation: 45,
        //   minRotation: 45,
        // },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

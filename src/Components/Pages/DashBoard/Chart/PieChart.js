// import React, { useEffect, useState } from "react";
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

const PieChart = ({ sale = 0, cogs = 0, lossProfit = 0 }) => {
  const saleVal = Number(sale || 0);
  const cogsVal = Number(cogs || 0);
  const profitLossVal = Number(lossProfit || 0);
  const isLoss = profitLossVal < 0;
  const absProfitLoss = Math.abs(profitLossVal);

  // Calculate percentages
  const total = saleVal + cogsVal + absProfitLoss;
  const salePercentage = total > 0 ? ((saleVal / total) * 100).toFixed(1) : 0;
  const cogsPercentage = total > 0 ? ((cogsVal / total) * 100).toFixed(1) : 0;
  const profitPercentage = total > 0 ? ((absProfitLoss / total) * 100).toFixed(1) : 0;

  const data = {
    labels: [
      `Sales (${salePercentage || 0}%)`,
      `COGS (${cogsPercentage || 0}%)`,
      `${isLoss ? "Loss" : "Profit"} (${profitPercentage || 0}%)`
    ],
    datasets: [
      {
        data: [saleVal, cogsVal, absProfitLoss],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",  // Blue for Sales
          "rgba(237, 56, 51, 0.8)",   // Red for COGS
          isLoss ? "rgba(220, 53, 69, 0.8)" : "rgba(75, 192, 192, 0.8)"   // Red for Loss or Teal for Profit
        ],
        borderColor: [
          "rgb(54, 162, 235)",
          "rgb(237, 56, 51)",
          isLoss ? "rgb(220, 53, 69)" : "rgb(75, 192, 192)"
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'BDT',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
            return `${label}: ${formattedValue}`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ height: '200px', width: '100%', position: 'relative' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: isLoss ? '#dc3545' : '#28a745' }}>
          {isLoss ? 'Total Loss: ' : 'Total Profit: '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(profitLossVal)}
        </div>
      </div>
    </div>
  );
};

export default PieChart;

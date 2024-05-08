import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import InputCurrency from '../utils/InputCurrency';

const PieChart = ({ expenses, totalbudget }) => {
    const remaining = totalbudget - expenses;
    const expensesPercentage = (expenses / totalbudget) * 100;
    const remainingPercentage = (remaining / totalbudget) * 100;
    const expensesCur = InputCurrency(expenses.toString());
    const remainCur = InputCurrency(remaining.toString());

    const data = {
        labels: ['Expenses', 'Remaining'],
        datasets: [
            {
                data: [expenses, remaining],
                backgroundColor: ['rgb(255, 65, 65)', '#A3C639'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                    title: function (context) {
                        const label = context[0].label || '';
                        const value = context[0].parsed || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        }
    };

    return (
        <>
            <Pie data={data} options={options}  />
            <div className="pie-chart">
                <div className="chart-labels">
                    <div className="chart-label expenses"  style={{color: 'rgb(255, 65, 65)'}}>
                        <span>Php {expensesCur}  </span>
                        <span>({expensesPercentage.toFixed(1)}%)  </span>
                        <span>Expenses</span>
                    </div>
                    <div className="chart-label remaining"  style={{color: '#A3C639'}}>
                        <span>Php {remainCur}  </span>
                        <span>({remainingPercentage.toFixed(1)}%)  </span>
                        <span>Remaining</span>
                    </div>
                </div>
            </div>
        </>
    );

};

export default PieChart;

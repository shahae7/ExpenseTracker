import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default function SpendingChart({ transactions, selectedDate }) {
    // 1. Generate all days for the selected month
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // 2. Aggregate expenses by day
    const dailyData = daysInMonth.map(day => {
        const dayTransactions = transactions.filter(t =>
            t.type === 'expense' && isSameDay(parseISO(t.date), day)
        );
        const total = dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        return total;
    });

    const labels = daysInMonth.map(day => format(day, 'd'));

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Daily Spending',
                data: dailyData,
                borderColor: '#D4AF37', // Gold
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4, // Smooth curve
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#0F0F11',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1E1E24',
                titleColor: '#fff',
                bodyColor: '#D4AF37',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `₹${context.raw.toLocaleString('en-IN')}`
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        family: 'Inter',
                        size: 10
                    },
                    maxTicksLimit: 10
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        family: 'Inter',
                        size: 10
                    },
                    callback: (value) => `₹${value}`
                },
                beginAtZero: true
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="w-full h-[300px]">
            <Line options={options} data={data} />
        </div>
    );
}

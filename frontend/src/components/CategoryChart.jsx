import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions }) {
    const [legendPosition, setLegendPosition] = useState(window.innerWidth < 768 ? 'bottom' : 'right');

    useEffect(() => {
        const handleResize = () => {
            setLegendPosition(window.innerWidth < 768 ? 'bottom' : 'right');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // 1. Group by Category
    const categoryTotals = {};

    transactions.forEach(t => {
        if (t.type === 'expense') {
            const cat = t.category_name || 'Uncategorized';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
        }
    });

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);

    // ShahaeSpend Palette (approximate mapping)
    const backgroundColors = [
        '#10B981', // Emerald (Food)
        '#F59E0B', // Amber (Transport)
        '#EF4444', // Red (Housing)
        '#8B5CF6', // Violet (Entertainment)
        '#3B82F6', // Blue (Utilities)
        '#EC4899', // Pink (Health)
        '#D4AF37', // Gold (Investments)
        '#6B7280', // Gray (Other)
    ];

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: '#0F0F11', // Match background
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: legendPosition,
                labels: {
                    color: '#9CA3AF',
                    font: {
                        family: 'Inter',
                        size: legendPosition === 'bottom' ? 9 : 11
                    },
                    usePointStyle: true,
                    padding: 15,
                }
            },
            tooltip: {
                backgroundColor: '#1E1E24',
                titleColor: '#fff',
                bodyColor: '#D4AF37',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '70%', // Donut style
    };

    return (
        <div className="w-full h-[250px] flex items-center justify-center">
            {labels.length > 0 ? (
                <Doughnut data={data} options={options} />
            ) : (
                <p className="text-text-muted text-sm italic">No expense data</p>
            )}
        </div>
    );
}

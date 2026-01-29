const { pool } = require('../../config/db');

class InsightService {
    static async getMonthlyInsights(userId, month, year) {
        // Current Month Spending
        const currentQuery = `
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'expense' 
            AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
        `;
        const { rows: currentRows } = await pool.query(currentQuery, [userId, month, year]);
        const currentTotal = currentRows[0]?.total || 0;

        // Previous Month Calculation
        let prevMonth = parseInt(month) - 1;
        let prevYear = parseInt(year);
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear -= 1;
        }
        const prevMonthStr = prevMonth.toString().padStart(2, '0');

        const prevQuery = `
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'expense' 
            AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
        `;
        const { rows: prevRows } = await pool.query(prevQuery, [userId, prevMonthStr, prevYear.toString()]);
        const prevTotal = prevRows[0]?.total || 0;

        // Insight 1: Spending Trend
        let trendInsight = null;
        if (prevTotal > 0) {
            const percentageChange = ((currentTotal - prevTotal) / prevTotal) * 100;
            const direction = percentageChange > 0 ? 'increased' : 'decreased';
            const color = percentageChange > 0 ? 'red' : 'green';

            trendInsight = {
                type: 'trend',
                message: `Your spending has ${direction} by ${Math.abs(percentageChange).toFixed(1)}% compared to last month.`,
                highlight: `${Math.abs(percentageChange).toFixed(1)}%`,
                severity: percentageChange > 20 ? 'high' : 'medium'
            };
        } else {
            trendInsight = {
                type: 'trend',
                message: "Keep tracking to compare with last month's data.",
                severity: 'low'
            };
        }

        // Insight 2: Top Category
        const catQuery = `
            SELECT c.name, SUM(t.amount) as total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = 'expense'
            AND strftime('%m', t.date) = ? AND strftime('%Y', t.date) = ?
            GROUP BY c.name
            ORDER BY total DESC
            LIMIT 1
        `;
        const { rows: catRows } = await pool.query(catQuery, [userId, month, year]);

        // Return Array of Insights
        const insights = [trendInsight];

        if (catRows.length > 0) {
            const topCat = catRows[0];
            insights.push({
                type: 'category',
                message: `Your highest spending category is ${topCat.name} (₹${topCat.total.toLocaleString('en-IN')}).`,
                highlight: topCat.name,
                severity: 'info'
            });
        }

        return insights;
    }
}

module.exports = InsightService;

const InsightService = require('../services/insight.service');

exports.getInsights = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and Year required' });
        }

        const insights = await InsightService.getMonthlyInsights(req.user.id, month, year);
        res.json(insights);
    } catch (error) {
        console.error("Insight Error:", error);
        res.status(500).json({ error: error.message });
    }
};

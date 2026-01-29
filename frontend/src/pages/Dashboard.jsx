import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Upload from '../components/Upload';
import DatePicker from '../components/DatePicker';
import AddTransactionModal from '../components/AddTransactionModal';
import SpendingChart from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import Clock from '../components/Clock';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, Plus, CreditCard, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    // Filter Logic
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterType, setFilterType] = useState('month'); // 'day' or 'month'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Insights Logic
    const [insights, setInsights] = useState([]);

    const fetchInsights = async () => {
        try {
            const month = format(selectedDate, 'MM');
            const year = format(selectedDate, 'yyyy');
            const res = await api.get(`/insights?month=${month}&year=${year}`);
            setInsights(res.data);
        } catch (err) {
            console.error("Failed to fetch insights", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            let query = '';
            if (filterType === 'day') {
                query = `?date=${format(selectedDate, 'yyyy-MM-dd')}`;
            } else {
                const month = format(selectedDate, 'MM');
                const year = format(selectedDate, 'yyyy');
                query = `?month=${month}&year=${year}`;
            }

            const res = await api.get(`/transactions${query}`);
            setTransactions(res.data);
            calculateStats(res.data);
            fetchInsights();
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete");
        }
    };

    const calculateStats = (data) => {
        let income = 0;
        let expense = 0;
        data.forEach(t => {
            if (t.type === 'income') income += Number(t.amount);
            else expense += Number(t.amount);
        });
        setStats({ income, expense, balance: income - expense });
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate, filterType]);

    return (
        <div className="min-h-screen bg-transparent pb-20 pt-28">
            <Navbar />
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onSuccess={fetchData}
                editData={editingTransaction}
            />

            {/* Background Decor */}
            <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <main className="max-w-7xl mx-auto px-6 space-y-10 relative z-10">

                {/* Visual Anchor: Clock */}
                <Clock />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end items-center gap-8 md:text-left text-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Financial Overview</h1>
                        <p className="text-sm md:text-base text-text-muted">Welcome back. Here is your portfolio performance.</p>
                    </div>

                    {/* Dynamic Date Picker */}
                    <DatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        filterType={filterType}
                        onFilterTypeChange={setFilterType}
                    />
                </div>

                {/* Insight Banner */}
                {insights.length > 0 && (
                    <div className="glass-card p-6 border-l-4 border-primary flex items-start gap-5 relative overflow-hidden group mb-8">
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <div className="relative z-10 space-y-1">
                            {insights.map((insight, idx) => (
                                <div key={idx}>
                                    <h4 className="font-serif font-semibold text-primary mb-1">
                                        {insight.type === 'trend' ? 'Spending Trend' : 'Top Category'}
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        {insight.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Net Balance" value={stats.balance} type="neutral" icon={Wallet} />
                    <StatCard label="Total Income" value={stats.income} type="income" icon={ArrowDownRight} />
                    <StatCard label="Total Expenses" value={stats.expense} type="expense" icon={ArrowUpRight} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Spending Trend (Line) */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <h3 className="text-xl font-serif font-semibold text-white mb-6">Spending Trend</h3>
                        <SpendingChart transactions={transactions} selectedDate={selectedDate} />
                    </div>

                    {/* Category Distribution (Pie) */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-serif font-semibold text-white mb-6">Distribution</h3>
                        <CategoryChart transactions={transactions} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Actions */}
                    <div className="space-y-6">

                        {/* Manual Add Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full glass-card p-6 flex flex-row items-center justify-between group hover:border-primary/50 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-semibold text-white group-hover:text-primary transition-colors">Manual Entry</h3>
                                    <p className="text-xs text-text-muted">Log cash or single expense</p>
                                </div>
                            </div>
                        </button>

                        <Upload onUploadSuccess={fetchData} />
                    </div>

                    {/* Right Column: Transactions */}
                    <div className="lg:col-span-2 glass-card p-8">
                        <h3 className="text-xl font-serif font-semibold mb-8 flex items-center justify-between">
                            <span>
                                Activity for {filterType === 'day' ? format(selectedDate, 'MMM do, yyyy') : format(selectedDate, 'MMMM yyyy')}
                            </span>
                            <button className="text-xs font-sans text-primary hover:text-white uppercase tracking-wider font-semibold transition-colors">View All</button>
                        </h3>

                        <div className="space-y-3">
                            {transactions.length === 0 ? (
                                <div className="text-center py-16 text-text-muted flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-white/5">
                                        <CreditCard className="h-8 w-8 text-text-muted/50" />
                                    </div>
                                    <p>No transactions for this month. <br />Add one manually or upload specific CSV.</p>
                                </div>
                            ) : (
                                transactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-surface/30 hover:bg-surfaceHighlight border border-transparent hover:border-white/5 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {t.type === 'income' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-white group-hover:text-primary transition-colors truncate">{t.description}</p>
                                                <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-text-muted mt-0.5">
                                                    <span className="font-medium text-gray-400 whitespace-nowrap">{format(new Date(t.date), 'MMM dd')}</span>
                                                    <span className="hidden sm:inline w-1 h-1 bg-white/10 rounded-full"></span>
                                                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 uppercase tracking-wider whitespace-nowrap">{t.category_name || 'Uncategorized'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`font-mono font-semibold text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                            {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                                        </span>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingTransaction(t);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Edit Transaction"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, type, icon: Icon }) {
    const colorClass = type === 'income' ? 'text-emerald-400' : type === 'expense' ? 'text-red-400' : 'text-primary';
    const bgClass = type === 'income' ? 'from-emerald-500/10' : type === 'expense' ? 'from-red-500/10' : 'from-primary/10';

    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            <div className={`absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl ${bgClass} to-transparent rounded-bl-full opacity-50 transition-opacity`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm text-text-muted uppercase tracking-wider font-semibold">{label}</p>
                    <div className={`p-2 rounded-lg bg-surface border border-white/5 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
                <h3 className={`text-3xl font-serif font-bold text-white`}>
                    {type === 'expense' && value > 0 && '-'}₹{Math.abs(value).toLocaleString('en-IN')}
                </h3>
            </div>
        </div>
    );
}

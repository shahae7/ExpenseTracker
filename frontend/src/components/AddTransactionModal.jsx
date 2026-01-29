import { useState, useEffect } from 'react';
import { X, Check, IndianRupee, Tag, Calendar as CalendarIcon, AlignLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { format } from 'date-fns';

export default function AddTransactionModal({ isOpen, onClose, onSuccess, editData = null }) {
    if (!isOpen) return null;

    const [amount, setAmount] = useState(editData ? Math.abs(editData.amount) : '');
    const [description, setDescription] = useState(editData ? editData.description : '');
    const [categoryName, setCategoryName] = useState(editData ? editData.category_name : '');

    // Custom Select State
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [date, setDate] = useState(editData ? editData.date : format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState(editData ? editData.type : 'expense');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (editData) {
                setAmount(Math.abs(editData.amount));
                setDescription(editData.description);
                setCategoryName(editData.category_name || 'Uncategorized');
                setDate(editData.date);
                setType(editData.type);
            } else {
                setAmount('');
                setDescription('');
                setCategoryName('');
                setDate(format(new Date(), 'yyyy-MM-dd'));
                setType('expense');
            }
        }
    }, [isOpen, editData]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to load categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                amount: Number(amount),
                description,
                categoryName: categoryName,
                date,
                type
            };

            if (editData) {
                await api.put(`/transactions/${editData.id}`, payload);
            } else {
                await api.post('/transactions', payload);
            }

            onSuccess();
            onClose();
            // Reset form (only if not editing, although onClose might handle it)
            if (!editData) {
                setAmount('');
                setDescription('');
                setCategoryName('');
                setDate(format(new Date(), 'yyyy-MM-dd'));
                setType('expense');
            }
        } catch (err) {
            console.error("Failed to save transaction", err);
            alert("Failed to save transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-md glass-card p-6 animate-in zoom-in-95 duration-200 border border-white/10 shadow-2xl bg-[#0F0F11]">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif font-bold text-white">{editData ? 'Edit Transaction' : 'New Transaction'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Toggle */}
                    <div className="flex bg-surfaceHighlight p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Amount</label>
                        <div className="relative group">
                            <IndianRupee className="absolute left-4 top-3.5 h-5 w-5 text-text-muted group-focus-within:text-white transition-colors" />
                            <input
                                type="number"
                                className="w-full input-luxury !pl-20 text-lg font-mono"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Description</label>
                        <div className="relative group">
                            <AlignLeft className="absolute left-4 top-3.5 h-5 w-5 text-text-muted group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                className="w-full input-luxury !pl-20"
                                placeholder="What was this for?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Category Custom Select */}
                    <div className="space-y-1 relative">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-3.5 h-5 w-5 text-text-muted z-10" />

                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full input-luxury !pl-20 text-left flex items-center justify-between group"
                            >
                                <span className={categoryName ? 'text-white' : 'text-text-muted'}>
                                    {categoryName || "Select Category"}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E24] border border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setCategoryName(cat.name);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                                style={{ backgroundColor: cat.color || '#fff', boxShadow: `0 0 10px ${cat.color}40` }}
                                            ></div>
                                            <span className="text-sm text-gray-200">{cat.name}</span>
                                            {categoryName === cat.name && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                                        </button>
                                    ))}

                                    {/* Add 'Other' or 'Create' Option if needed in future */}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Date</label>
                        <div className="relative group">
                            <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-text-muted group-focus-within:text-white transition-colors" />
                            <input
                                type="date"
                                className="w-full input-luxury !pl-20"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl text-sm uppercase tracking-wider font-bold shadow-xl flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
}

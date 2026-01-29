import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';

export default function DatePicker({ selectedDate, onChange, filterType, onFilterTypeChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(selectedDate);
    const dropdownRef = useRef(null);

    // Sync viewDate when selectedDate changes externally
    useEffect(() => {
        setViewDate(selectedDate);
    }, [selectedDate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDaySelect = (day) => {
        onChange(day);
        if (onFilterTypeChange) onFilterTypeChange('day');
        setIsOpen(false);
    };

    const handleSelectWholeMonth = () => {
        onChange(viewDate); // Date doesn't matter much, but we keep the view month
        if (onFilterTypeChange) onFilterTypeChange('month');
        setIsOpen(false);
    };

    const nextMonth = () => setViewDate(addMonths(viewDate, 1));
    const prevMonth = () => setViewDate(subMonths(viewDate, 1));

    // Generate Calendar Grid
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium transition-all duration-300 ${isOpen ? 'bg-primary/20 text-white border-primary/50' : 'bg-surface hover:bg-surfaceHighlight text-text-muted hover:text-white'}`}
            >
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                    {filterType === 'day' ? format(selectedDate, 'MMM dd, yyyy') : format(selectedDate, 'MMMM yyyy')}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 glass-card p-4 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-[#0F0F11]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="font-serif font-bold text-white tracking-wide">
                            {format(viewDate, 'MMMM yyyy')}
                        </span>
                        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-2">
                        {weekDays.map(d => (
                            <div key={d} className="text-center text-xs text-text-muted font-medium py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day) => {
                            const isSelected = filterType === 'day' && isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDaySelect(day)}
                                    className={`
                            h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200
                            ${!isCurrentMonth ? 'text-text-muted/20 hover:text-text-muted' : ''}
                            ${isSelected ? 'bg-primary text-black shadow-lg shadow-primary/20 font-bold' : ''}
                            ${!isSelected && isToday && isCurrentMonth ? 'border border-primary text-primary' : ''}
                            ${!isSelected && isCurrentMonth ? 'text-text-muted hover:bg-white/10 hover:text-white' : ''}
                        `}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-center">
                        <button
                            onClick={handleSelectWholeMonth}
                            className={`text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-lg w-full transition-colors flex items-center justify-center gap-2
                    ${filterType === 'month' && isSameMonth(viewDate, selectedDate) ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-surfaceHighlight hover:bg-white/10 text-text-muted hover:text-white'}
                `}
                        >
                            {filterType === 'month' && isSameMonth(viewDate, selectedDate) && <Check className="h-3 w-3" />}
                            Select Whole Month
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

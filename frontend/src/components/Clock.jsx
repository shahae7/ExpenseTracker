import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty'];

    if (num === 0) return 'Twelve'; // For 12:00
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
};

const getTimeInWords = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    let displayHours = hours % 12;
    displayHours = displayHours === 0 ? 12 : displayHours;

    const hourWord = numberToWords(displayHours);
    let minuteWord = '';

    if (minutes === 0) {
        minuteWord = "O'Clock";
    } else if (minutes < 10) {
        minuteWord = 'Oh ' + numberToWords(minutes);
    } else {
        minuteWord = numberToWords(minutes);
    }

    return `It's ${hourWord} ${minuteWord} ${ampm}`;
};

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 py-10 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light tracking-tight text-white/90 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] leading-tight max-w-[18ch] sm:max-w-none transition-all duration-700 ease-in-out">
                {getTimeInWords(time)}
            </h2>
            <p className="text-[10px] sm:text-xs md:text-base font-sans font-medium uppercase tracking-[0.4em] text-primary/70 transition-all duration-700">
                {format(time, 'EEEE, d MMMM yyyy')}
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-6 opacity-50"></div>
        </div>
    );
}

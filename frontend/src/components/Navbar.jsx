import { useAuth } from '../context/AuthContext';
import { LogOut, PieChart } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg shadow-primary/20">
                            <PieChart className="h-5 w-5 md:h-6 md:w-6 text-black" />
                        </div>
                        <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white whitespace-nowrap">
                            Shahae<span className="text-primary italic">Spend</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs text-primary uppercase tracking-widest font-bold">Portfolio Owner</span>
                            <span className="text-sm text-text-muted font-medium">{user?.username}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                        <button
                            onClick={logout}
                            className="p-3 rounded-xl hover:bg-white/5 text-text-muted hover:text-danger transition-all duration-300 group"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

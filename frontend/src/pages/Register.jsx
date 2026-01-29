import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            console.error("Registration Error:", err);
            const msg = err.response?.data?.error || err.message || 'Failed to register';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden selection:bg-primary/30">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-30"></div>

            <div className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 border border-white/5 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-2">Join the Elite</h2>
                    <p className="text-text-muted text-sm tracking-wide">Begin your journey to financial mastery</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-red-200 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Username</label>
                        <div className="input-container-luxury group">
                            <div className="pl-4 pr-3 border-r border-white/5 flex items-center justify-center">
                                <User className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="input-naked"
                                placeholder="John Doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Email Address</label>
                        <div className="input-container-luxury group">
                            <div className="pl-4 pr-3 border-r border-white/5 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="input-naked"
                                placeholder="you@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Password</label>
                        <div className="input-container-luxury group">
                            <div className="pl-4 pr-3 border-r border-white/5 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="password"
                                className="input-naked"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 group mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Initialize Portfolio'}
                        {!loading && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-text-muted text-sm">
                        Already a member?{' '}
                        <Link to="/login" className="text-primary hover:text-accent font-medium transition-colors">Data Access Request</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

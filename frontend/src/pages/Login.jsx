import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials supplied');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden">
            {/* Dramatic Spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="glass-card w-full max-w-md p-8 md:p-12 relative z-10 border border-white/5">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h2>
                    <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <div className="input-container-luxury group">
                            <div className="pl-4 pr-3 border-r border-white/5 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="input-naked"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="input-container-luxury group">
                            <div className="pl-4 pr-3 border-r border-white/5 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="password"
                                className="input-naked"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl text-sm uppercase tracking-wider font-bold shadow-2xl flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                        {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/register" className="text-text-muted hover:text-primary text-sm transition-colors">
                        Create new account
                    </Link>
                </div>
            </div>
        </div>
    );
}

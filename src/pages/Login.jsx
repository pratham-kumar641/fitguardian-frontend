import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="glass-card p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-textMain mb-6 text-center">Welcome Back</h2>
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Email</label>
                        <input 
                            type="email" 
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Password</label>
                        <input 
                            type="password" 
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="neon-button w-full mt-4">Login</button>
                </form>
                
                <div className="mt-6 text-center text-sm text-textMuted">
                    Don't have an account? <Link to="/register" className="text-neonGreen hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 glass-card rounded-none border-t-0 border-x-0 border-b border-black/10 dark:border-white/10 top-0 left-0 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-neonGreen font-bold text-2xl tracking-tighter">
                    <Activity size={28} /> FitGuardian
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link to="/" className="hover:text-electricCyan transition-colors">Home</Link>
                    <Link to="/plans" className="hover:text-electricCyan transition-colors">Plans</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-neonGreen transition-colors">Dashboard</Link>
                            <Link to="/bookings" className="hover:text-neonGreen transition-colors">Bookings</Link>
                            <Link to="/profile" className="hover:text-neonGreen transition-colors">Profile</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-pink-500 hover:text-pink-400 font-bold transition-colors">Admin Area</Link>
                            )}
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 font-semibold">Logout</button>
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-black/10 dark:border-white/10">
                                <div className="w-8 h-8 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-bold border border-neonGreen/30">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-textMain font-medium hidden lg:inline-block">{user.name}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-textMain transition-colors">Login</Link>
                            <Link to="/register" className="glass-button py-1.5 px-4 text-neonGreen border-neonGreen/30 hover:border-neonGreen hover:shadow-[0_0_10px_rgba(57,255,20,0.3)]">Join Now</Link>
                        </>
                    )}
                    
                    {/* Theme Toggle Button */}
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-black/10 dark:bg-white/10 transition-colors ml-2" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
                    </button>
                </div>

                {/* Mobile Hamburger & Theme Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-black/10 dark:bg-white/10 transition-colors" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-600" />}
                    </button>
                    <button className="text-textMain" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden pt-4 pb-2 px-2 flex flex-col gap-4 text-center">
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/plans" onClick={() => setIsOpen(false)}>Plans</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <Link to="/bookings" onClick={() => setIsOpen(false)}>Bookings</Link>
                            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                            {user.role === 'admin' && <Link to="/admin" className="text-pink-500 font-bold" onClick={() => setIsOpen(false)}>Admin Area</Link>}
                            <button onClick={handleLogout} className="text-red-400">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="text-neonGreen font-bold" onClick={() => setIsOpen(false)}>Join Now</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

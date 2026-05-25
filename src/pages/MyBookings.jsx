import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/mybookings');
                setBookings(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center mt-20 text-electricCyan">Loading your bookings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-textMain flex items-center gap-2">
                <Calendar className="text-electricCyan" /> My Bookings
            </h1>

            {bookings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-textMuted mb-4">You have no active plans.</p>
                    <Link to="/plans" className="neon-button inline-block">Browse Plans</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-l-neonGreen">
                            <div>
                                <h3 className="text-xl font-bold text-textMain">{booking.plan ? booking.plan.name : 'Unknown Plan'}</h3>
                                <p className="text-sm text-textMuted mt-1">Booked on: {new Date(booking.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    new Date(booking.expiryDate) > new Date() ? 'bg-neonGreen/20 text-neonGreen' : 'bg-red-500/20 text-red-500'
                                }`}>
                                    Expires: {new Date(booking.expiryDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;

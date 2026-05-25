import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [planData, setPlanData] = useState({ name: '', description: '', price: '', durationDays: 30, features: '' });

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        try {
            const featuresArray = planData.features.split(',').map(f => f.trim());
            await api.post('/admin/plans', { ...planData, features: featuresArray });
            alert('Plan Created');
            setPlanData({ name: '', description: '', price: '', durationDays: 30, features: '' });
        } catch (error) {
            alert('Error creating plan');
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-pink-500">Admin Dashboard</h1>
            
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-card p-4 text-center">
                        <p className="text-textMuted text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-textMain">{stats.totalUsers}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-textMuted text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold text-textMain">{stats.totalBookings}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-textMuted text-sm">Active Subs</p>
                        <p className="text-2xl font-bold text-textMain">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-textMuted text-sm">Est. Revenue</p>
                        <p className="text-2xl font-bold text-neonGreen">₹{stats.totalRevenue}</p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Create Plan */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-textMain mb-4">Create New Plan</h2>
                    <form onSubmit={handleCreatePlan} className="space-y-3">
                        <input type="text" placeholder="Plan Name" className="input-field" value={planData.name} onChange={(e) => setPlanData({...planData, name: e.target.value})} required />
                        <input type="number" placeholder="Price" className="input-field" value={planData.price} onChange={(e) => setPlanData({...planData, price: e.target.value})} required />
                        <input type="number" placeholder="Duration (Days)" className="input-field" value={planData.durationDays} onChange={(e) => setPlanData({...planData, durationDays: e.target.value})} required />
                        <textarea placeholder="Description" className="input-field" value={planData.description} onChange={(e) => setPlanData({...planData, description: e.target.value})} required />
                        <input type="text" placeholder="Features (comma separated)" className="input-field" value={planData.features} onChange={(e) => setPlanData({...planData, features: e.target.value})} required />
                        <button type="submit" className="cyan-button w-full border-pink-500 text-pink-500 hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">Add Plan</button>
                    </form>
                </div>

                {/* Users List */}
                <div className="glass-card p-6 overflow-hidden flex flex-col">
                    <h2 className="text-xl font-bold text-textMain mb-4">Recent Users</h2>
                    <div className="overflow-y-auto flex-1 pr-2 space-y-2 max-h-80">
                        {users.map(u => (
                            <div key={u._id} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-textMain font-bold">{u.name}</p>
                                    <p className="text-textMuted text-xs">{u.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-pink-500/20 text-pink-500' : 'bg-gray-700 text-textMain'}`}>{u.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Brain, Activity, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [subStatus, setSubStatus] = useState(false);
    const [planName, setPlanName] = useState('Basic');

    useEffect(() => {
        const checkSub = async () => {
            try {
                const res = await api.get('/bookings/subscription-status');
                setSubStatus(res.data.isSubscribed);
                setPlanName(res.data.planName || 'Basic');
            } catch (error) {
                console.error(error);
            }
        };
        checkSub();
    }, []);

    const canAccessAI = planName === 'Premium' || planName === 'Deluxe';
    const canAccessPosture = planName === 'Deluxe';

    return (
        <div className="space-y-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-textMain mb-2">Welcome back, <span className="text-neonGreen">{user?.name}</span>!</h1>
                <p className="text-textMuted">Here is an overview of your physical wellness journey.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-textMuted">Subscription Status</p>
                        <p className={`text-xl font-bold mt-1 ${subStatus ? 'text-neonGreen' : 'text-gray-500'}`}>
                            {subStatus ? `${planName} Plan Active` : 'Free Plan'}
                        </p>
                    </div>
                    <ShieldCheck size={32} className={subStatus ? 'text-neonGreen' : 'text-gray-500'} />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-textMain mt-12 mb-6">Your Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <Link to={canAccessAI ? "/ai-workout" : "/plans"} className="glass-card p-6 block hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    {!canAccessAI && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Premium+
                        </div>
                    )}
                    <div className="w-12 h-12 bg-electricCyan/10 rounded-lg flex items-center justify-center text-electricCyan mb-4 group-hover:bg-electricCyan/20">
                        <Brain size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-textMain mb-1">AI Workout Generator</h3>
                    <p className="text-sm text-textMuted">Get personalized routines based on your goals.</p>
                </Link>

                <Link to={canAccessPosture ? "/posture-check" : "/plans"} className="glass-card p-6 block hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    {!canAccessPosture && (
                        <div className="absolute top-2 right-2 bg-pink-500 text-textMain text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Deluxe Only
                        </div>
                    )}
                    <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-500 mb-4 group-hover:bg-pink-500/20">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-textMain mb-1">Posture Analyzer</h3>
                    <p className="text-sm text-textMuted">Real-time skeleton tracking and posture alerts.</p>
                </Link>

                <Link to="/bookings" className="glass-card p-6 block hover:-translate-y-1 transition-transform group">
                    <div className="w-12 h-12 bg-neonGreen/10 rounded-lg flex items-center justify-center text-neonGreen mb-4 group-hover:bg-neonGreen/20">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-textMain mb-1">My Bookings</h3>
                    <p className="text-sm text-textMuted">Manage your active plans and subscriptions.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;

import { Link } from 'react-router-dom';
import { Activity, Brain, ShieldCheck } from 'lucide-react';
import BMICalculator from '../components/BMICalculator';
import NutritionPlanner from '../components/NutritionPlanner';
import VideoLibrary from '../components/VideoLibrary';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Home = () => {
    const { user } = useAuth();

    const handleSaveBmi = async (value, category) => {
        if (user) {
            try {
                await api.post('/auth/bmi', { value, category });
            } catch (error) {
                console.error("Failed to save BMI:", error);
            }
        }
    };

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="text-center pt-10 md:pt-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-electricCyan mb-6 animate-pulse">
                    <Activity size={16} /> Smarter Workouts Powered by AI
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-textMain mb-6 tracking-tight">
                    Welcome to <span className="text-neonGreen">FitGuardian</span>
                </h1>
                <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-10">
                    Your all-in-one smart physical wellness system. Personalize your workouts, analyze your posture in real-time, and reach your fitness goals faster.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/plans" className="neon-button text-lg px-8 py-3">View Plans</Link>
                    <Link to="/register" className="glass-button text-lg px-8 py-3">Get Started Free</Link>
                </div>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-neonGreen/10 flex items-center justify-center text-neonGreen mb-4">
                        <Brain size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">AI-Powered Guidance</h3>
                    <p className="text-textMuted text-sm">Personalized workouts and an intelligent chatbot to answer all your fitness queries.</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-electricCyan/10 flex items-center justify-center text-electricCyan mb-4">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">Posture Analyzer</h3>
                    <p className="text-textMuted text-sm">Use your webcam for real-time skeleton tracking and posture correction during workouts.</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">Secure & Reliable</h3>
                    <p className="text-textMuted text-sm">Track your BMI, manage bookings, and maintain a secure profile within our robust system.</p>
                </div>
            </section>

            {/* Free Tools Section */}
            <section className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 md:p-12 border border-black/10 dark:border-white/10">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-textMain mb-10">Free Fitness Tools</h2>
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <BMICalculator onSave={handleSaveBmi} />
                    <NutritionPlanner />
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                        <Activity className="text-electricCyan" /> Exercise Video Library
                    </h3>
                    <VideoLibrary />
                </div>
            </section>
        </div>
    );
};

export default Home;

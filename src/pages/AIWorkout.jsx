import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Brain, Sparkles, Lock, ShieldCheck, Dumbbell, 
    Apple, Info, CheckCircle2, Star, Eye 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Exercise illustration imports
import bicepsCurlImg from '../assets/exercises/biceps_curl.png';
import chestBenchPressImg from '../assets/exercises/chest_bench_press.png';
import tricepsDipsImg from '../assets/exercises/triceps_dips.png';
import backDeadliftImg from '../assets/exercises/back_deadlift.png';
import legsSquatImg from '../assets/exercises/legs_squat.png';
import shouldersPressImg from '../assets/exercises/shoulders_press.png';

import inclinePressImg from '../assets/exercises/incline_press.png';
import chestFlyImg from '../assets/exercises/chest_fly.png';
import pushupsImg from '../assets/exercises/pushups.png';
import declinePressImg from '../assets/exercises/decline_press.png';
import pullUpsImg from '../assets/exercises/pull_ups.png';
import barbellRowImg from '../assets/exercises/barbell_row.png';
import latPulldownImg from '../assets/exercises/lat_pulldown.png';
import cableRowImg from '../assets/exercises/cable_row.png';
import hammerCurlImg from '../assets/exercises/hammer_curl.png';
import preacherCurlImg from '../assets/exercises/preacher_curl.png';

import concentrationCurlImg from '../assets/exercises/concentration_curl.png';
import tricepPushdownImg from '../assets/exercises/tricep_pushdown.png';
import skullCrushersImg from '../assets/exercises/skull_crushers.png';
import overheadTricepExtImg from '../assets/exercises/overhead_tricep_ext.png';
import closeGripBenchImg from '../assets/exercises/close_grip_bench.png';
import legPressImg from '../assets/exercises/leg_press.png';
import romanianDeadliftImg from '../assets/exercises/romanian_deadlift.png';
import walkingLungesImg from '../assets/exercises/walking_lunges.png';
import calfRaisesImg from '../assets/exercises/calf_raises.png';
import lateralRaisesImg from '../assets/exercises/lateral_raises.png';
import frontRaisesImg from '../assets/exercises/front_raises.png';
import facePullsImg from '../assets/exercises/face_pulls.png';
const MUSCLE_DETAILS = {
    chest: {
        name: 'Pectorals (Chest)',
        desc: 'Responsible for pushing movements and horizontal abduction of the arms.',
        target: 'Upper & Lower Chest fibers',
        workouts: [
            {
                name: 'Bench Press',
                img: chestBenchPressImg,
                level: 'All Levels',
                reps: '4 Sets x 8-12 Reps',
                tip: 'Tuck your elbows to a 45-75 degree angle relative to your body to save shoulders.'
            },
            {
                name: 'Incline Dumbbell Press',
                img: inclinePressImg,
                level: 'Intermediate',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Set bench to 30-45 degrees to target the upper pectoral fibers effectively.'
            },
            {
                name: 'Chest Flyes (Cable/Dumbbell)',
                img: chestFlyImg,
                level: 'Beginner',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Maintain a slight bend in your elbows and focus on the stretch and squeeze.'
            },
            {
                name: 'Push-Ups',
                img: pushupsImg,
                level: 'Beginner',
                reps: '3 Sets to Failure',
                tip: 'Keep your core braced and your body in a straight line from head to heels.'
            },
            {
                name: 'Decline Bench Press',
                img: declinePressImg,
                level: 'Advanced',
                reps: '4 Sets x 8-10 Reps',
                tip: 'Focus on pushing the weight away from your lower chest to target the lower pecs.'
            }
        ]
    },
    back: {
        name: 'Latissimus Dorsi & Trapezius (Back)',
        desc: 'Crucial for pulling, stabilizing the spine, and maintaining an upright posture.',
        target: 'Upper Lats & Posterior Chain',
        workouts: [
            {
                name: 'Deadlifts',
                img: backDeadliftImg,
                level: 'Intermediate',
                reps: '3 Sets x 5 Reps',
                tip: 'Keep your spine flat (neutral) and pull the bar straight up keeping it close to shins.'
            },
            {
                name: 'Pull-Ups / Chin-Ups',
                img: pullUpsImg,
                level: 'All Levels',
                reps: '3 Sets to Failure',
                tip: 'Drive your elbows down to your sides to fully engage the latissimus dorsi.'
            },
            {
                name: 'Barbell Rows',
                img: barbellRowImg,
                level: 'Intermediate',
                reps: '4 Sets x 8-10 Reps',
                tip: 'Hinge at the hips and keep your back parallel to the floor while pulling to your belly.'
            },
            {
                name: 'Lat Pulldowns',
                img: latPulldownImg,
                level: 'Beginner',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Lean back slightly and pull the bar down to your upper chest.'
            },
            {
                name: 'Seated Cable Rows',
                img: cableRowImg,
                level: 'Beginner',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Keep your chest up and squeeze your shoulder blades together at the peak.'
            }
        ]
    },
    bicep: {
        name: 'Biceps Brachii (Biceps)',
        desc: 'Responsible for elbow flexion and forearm supination.',
        target: 'Bicep Short & Long Heads',
        workouts: [
            {
                name: 'Bicep Curls',
                img: bicepsCurlImg,
                level: 'Beginner',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Keep your elbows pinned strictly to your ribs to isolate biceps. Do not swing your hips.'
            },
            {
                name: 'Hammer Curls',
                img: hammerCurlImg,
                level: 'Beginner',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Use a neutral grip to target the brachialis and brachioradialis along with the biceps.'
            },
            {
                name: 'Preacher Curls',
                img: preacherCurlImg,
                level: 'Intermediate',
                reps: '4 Sets x 8-12 Reps',
                tip: 'Rest your arms fully on the pad to eliminate momentum and maximize isolation.'
            },
            {
                name: 'Concentration Curls',
                img: concentrationCurlImg,
                level: 'Intermediate',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Brace your elbow against your inner thigh and squeeze hard at the top of the movement.'
            },
            {
                name: 'Incline Dumbbell Curls',
                img: bicepsCurlImg,
                level: 'Advanced',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Let your arms hang straight down from an incline bench to get a deep stretch on the long head.'
            }
        ]
    },
    tricep: {
        name: 'Triceps Brachii (Triceps)',
        desc: 'Comprises 60% of the upper arm volume. Responsible for elbow extension.',
        target: 'Lateral & Long Tricep heads',
        workouts: [
            {
                name: 'Tricep Parallel Dips',
                img: tricepsDipsImg,
                level: 'Intermediate',
                reps: '3 Sets x 8-12 Reps',
                tip: 'Keep torso slightly upright to maximize tricep isolation. Do not drop lower than a 90° elbow bend.'
            },
            {
                name: 'Tricep Pushdowns (Cable)',
                img: tricepPushdownImg,
                level: 'Beginner',
                reps: '4 Sets x 12-15 Reps',
                tip: 'Keep your elbows glued to your sides and fully extend your arms at the bottom.'
            },
            {
                name: 'Skull Crushers',
                img: skullCrushersImg,
                level: 'Intermediate',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Lower the bar to your forehead, keeping your upper arms stationary.'
            },
            {
                name: 'Overhead Tricep Extensions',
                img: overheadTricepExtImg,
                level: 'All Levels',
                reps: '3 Sets x 10-15 Reps',
                tip: 'Extend the weight overhead to deeply target the long head of the triceps.'
            },
            {
                name: 'Close-Grip Bench Press',
                img: closeGripBenchImg,
                level: 'Advanced',
                reps: '4 Sets x 8-10 Reps',
                tip: 'Place your hands shoulder-width apart and keep your elbows tucked in during the press.'
            }
        ]
    },
    leg: {
        name: 'Quadriceps, Hamstrings, & Glutes (Legs)',
        desc: 'The foundation of absolute lower body athletic power and metabolic drive.',
        target: 'Quads, Glutes & Hamstrings',
        workouts: [
            {
                name: 'Barbell Deep Squats',
                img: legsSquatImg,
                level: 'All Levels',
                reps: '4 Sets x 8-10 Reps',
                tip: 'Drive your knees outward and squat down until thighs are at least parallel to floor.'
            },
            {
                name: 'Leg Press',
                img: legPressImg,
                level: 'Beginner',
                reps: '4 Sets x 10-15 Reps',
                tip: 'Place your feet shoulder-width apart and avoid locking out your knees at the top.'
            },
            {
                name: 'Romanian Deadlifts (RDLs)',
                img: romanianDeadliftImg,
                level: 'Intermediate',
                reps: '3 Sets x 8-12 Reps',
                tip: 'Push your hips back and maintain a slight bend in your knees to stretch the hamstrings.'
            },
            {
                name: 'Walking Lunges',
                img: walkingLungesImg,
                level: 'Intermediate',
                reps: '3 Sets x 12-15 Reps per leg',
                tip: 'Take long steps to target the glutes or shorter steps to focus on the quadriceps.'
            },
            {
                name: 'Calf Raises (Standing/Seated)',
                img: calfRaisesImg,
                level: 'Beginner',
                reps: '4 Sets x 15-20 Reps',
                tip: 'Hold the stretch at the bottom and squeeze hard at the peak for full calf activation.'
            }
        ]
    },
    shoulder: {
        name: 'Deltoids & Traps (Shoulders)',
        desc: 'Creates the highly aesthetic "V-taper" look and stabilizes overhead loads.',
        target: 'Anterior, Lateral & Posterior Delts',
        workouts: [
            {
                name: 'Overhead Shoulder Press',
                img: shouldersPressImg,
                level: 'All Levels',
                reps: '3 Sets x 8-10 Reps',
                tip: 'Lock your core tightly and avoid arching your lower back as you press overhead.'
            },
            {
                name: 'Lateral Raises',
                img: lateralRaisesImg,
                level: 'Beginner',
                reps: '4 Sets x 12-15 Reps',
                tip: 'Lead with your elbows and raise the dumbbells until your arms are parallel to the floor.'
            },
            {
                name: 'Front Raises',
                img: frontRaisesImg,
                level: 'Beginner',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Raise the dumbbells straight in front of you, maintaining control on the descent.'
            },
            {
                name: 'Face Pulls',
                img: facePullsImg,
                level: 'Intermediate',
                reps: '3 Sets x 12-15 Reps',
                tip: 'Pull the rope towards your face, pulling your hands apart and squeezing the rear delts.'
            },
            {
                name: 'Arnold Press',
                img: shouldersPressImg,
                level: 'Advanced',
                reps: '3 Sets x 10-12 Reps',
                tip: 'Start with palms facing you and rotate them outwards as you press the dumbbells overhead.'
            }
        ]
    }
};

const AIWorkout = () => {
    const [activeTab, setActiveTab] = useState('planner'); // 'planner' or 'skeleton'
    const [goal, setGoal] = useState('Building Muscle');
    const [level, setLevel] = useState('Beginner');
    const [workout, setWorkout] = useState('');
    const [nutrition, setNutrition] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(null);
    
    // Muscle Explorer State
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [hoveredMuscle, setHoveredMuscle] = useState('');

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await api.get('/bookings/subscription-status');
                if (res.data.planName === 'Premium' || res.data.planName === 'Deluxe') {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error(error);
                setHasAccess(false);
            }
        };
        checkAccess();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/workout', { goal, level });
            setWorkout(res.data.workout || '');
            setNutrition(res.data.nutrition || '');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Sorry, couldn't generate workout right now.";
            setWorkout(errorMsg);
            setNutrition("Please double-check configuration details.");
        }
        setLoading(false);
    };

    if (hasAccess === null) return <div className="text-center text-electricCyan mt-20">Checking access...</div>;

    if (hasAccess === false) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 glass-card text-center border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-fade-in">
                <Lock size={48} className="text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-textMain mb-2">Premium Plan Required</h2>
                <p className="text-textMuted mb-6">Upgrade to Premium or Deluxe to unlock the AI Workout Generator and 3D Biomechanical Muscle Explorer.</p>
                <a href="/plans" className="cyan-button inline-block text-lg">Upgrade Now</a>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header section with holographic ring glow */}
            <div className="text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-60 h-12 bg-electricCyan/10 blur-xl rounded-full"></div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-textMain via-electricCyan to-neonGreen drop-shadow">
                    Premium Smart Module
                </h1>
                <p className="text-textMuted mt-2 text-sm max-w-xl mx-auto">
                    Unlock tailored daily workout and nutrition planning alongside our Interactive Glowing Biomechanical Muscle Explorer.
                </p>
            </div>

            {/* Custom Neon Navigation Tabs */}
            <div className="flex justify-center border-b border-black/10 dark:border-white/10 pb-1 gap-4">
                <button
                    onClick={() => setActiveTab('planner')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-t-xl transition-all duration-300 font-bold ${
                        activeTab === 'planner'
                            ? 'bg-electricCyan/10 text-electricCyan border-t border-x border-electricCyan/30 shadow-[0_-5px_15px_rgba(0,245,255,0.05)]'
                            : 'text-textMuted hover:text-textMain'
                    }`}
                >
                    <Brain size={18} />
                    ⚡ AI Smart Planner
                </button>
                <button
                    onClick={() => setActiveTab('skeleton')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-t-xl transition-all duration-300 font-bold ${
                        activeTab === 'skeleton'
                            ? 'bg-neonGreen/10 text-neonGreen border-t border-x border-neonGreen/30 shadow-[0_-5px_15px_rgba(57,255,20,0.05)]'
                            : 'text-textMuted hover:text-textMain'
                    }`}
                >
                    <Dumbbell size={18} />
                    🤖 Holographic Muscle Explorer
                </button>
            </div>

            {/* Content Tabs Switcher */}
            {activeTab === 'planner' ? (
                <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
                    {/* Left Form controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-electricCyan/20">
                            <h2 className="text-xl font-bold text-textMain mb-4 flex items-center gap-2">
                                <Sparkles className="text-electricCyan animate-pulse" size={18} />
                                Planner Inputs
                            </h2>
                            <form onSubmit={handleGenerate} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wide">Fitness Goal</label>
                                    <select 
                                        className="input-field appearance-none cursor-pointer" 
                                        value={goal} 
                                        onChange={(e) => setGoal(e.target.value)}
                                    >
                                        <option>Building Muscle</option>
                                        <option>Losing Weight</option>
                                        <option>General Fitness</option>
                                        <option>Improving Endurance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wide">Experience Level</label>
                                    <select 
                                        className="input-field appearance-none cursor-pointer" 
                                        value={level} 
                                        onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="cyan-button w-full flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
                                >
                                    {loading ? 'Synthesizing Plan...' : <><Sparkles size={18} /> Generate split & nutrition</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Results Deck */}
                    <div className="lg:col-span-8 space-y-6">
                        {workout || nutrition ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Daily Workout Routine Card */}
                                <div className="glass-card p-6 border-electricCyan/15 flex flex-col">
                                    <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                                        <Dumbbell className="text-electricCyan" size={20} />
                                        🏋️ Daily Exercise Schedule
                                    </h3>
                                    <div className="prose prose-invert prose-emerald text-sm text-textMain max-h-[480px] overflow-y-auto pr-2">
                                        <ReactMarkdown>{workout}</ReactMarkdown>
                                    </div>
                                </div>

                                {/* Daily Nutrition Card */}
                                <div className="glass-card p-6 border-neonGreen/15 flex flex-col">
                                    <h3 className="text-lg font-bold text-textMain mb-4 flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                                        <Apple className="text-neonGreen" size={20} />
                                        🥗 Daily Nutrition Planner
                                    </h3>
                                    <div className="prose prose-invert prose-emerald text-sm text-textMain max-h-[480px] overflow-y-auto pr-2">
                                        <ReactMarkdown>{nutrition}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center border-dashed border-black/20 dark:border-white/10 flex flex-col justify-center items-center h-full min-h-[300px]">
                                <Brain size={40} className="text-textMuted opacity-40 mb-3 animate-pulse" />
                                <h3 className="text-lg font-semibold text-textMuted">Awaiting Core Generation</h3>
                                <p className="text-xs text-textMuted mt-1 max-w-sm">
                                    Set your custom metrics on the left panel, and initialize synthesis to generate dual daily exercise and nutrition splits.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Interactive Holographic Muscle Explorer Tab */
                <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
                    {/* SVG Skeleton Column */}
                    <div className="lg:col-span-7 glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-2 left-2 bg-neonGreen/10 text-neonGreen text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-neonGreen/20">
                            Biomechanical Skeletal Grid
                        </div>
                        
                        <div className="flex md:flex-row flex-col justify-center items-center gap-8 w-full py-4">
                            {/* ANTERIOR (Front) Skeleton */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-electricCyan uppercase font-black tracking-[0.2em] mb-4 drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]">Anterior (Front)</span>
                                <svg width="280" height="540" viewBox="0 0 200 400" className="drop-shadow-[0_0_20px_rgba(57,255,20,0.25)]">
                                    {/* Stylized Cyborg Grid Background lines */}
                                    <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(57,255,20,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(57,255,20,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="250" x2="200" y2="250" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="300" x2="200" y2="300" stroke="rgba(57,255,20,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="350" x2="200" y2="350" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    
                                    <line x1="50" y1="0" x2="50" y2="400" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="100" y1="0" x2="100" y2="400" stroke="rgba(57,255,20,0.12)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="150" y1="0" x2="150" y2="400" stroke="rgba(57,255,20,0.03)" strokeWidth="1" strokeDasharray="2" />

                                    {/* Skeleton Blueprint Body Contour */}
                                    <path 
                                        d="M100,30 C120,30 130,45 130,60 C130,70 125,80 115,85 L115,100 L145,115 L155,170 L145,230 L135,230 L130,300 L120,380 L100,380 L80,380 L70,300 L65,230 L55,230 L45,170 L55,115 L85,100 L85,85 C75,80 70,70 70,60 C70,45 80,30 100,30 Z" 
                                        fill="rgba(0,0,0,0.4)" 
                                        stroke="rgba(255,255,255,0.15)" 
                                        strokeWidth="2" 
                                    />
                                    
                                    {/* Detailed Inner Mechanics */}
                                    <path d="M100,90 L85,110 L100,120 L115,110 Z" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
                                    <path d="M85,110 L70,115 M115,110 L130,115" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
                                    <path d="M90,130 L110,130 M90,145 L110,145 M90,160 L110,160 M90,175 L110,175 M90,190 L110,190 M90,205 L110,205" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                                    {/* Head & Spine Bones */}
                                    <circle cx="100" cy="55" r="16" fill="rgba(0,245,255,0.05)" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5" />
                                    <circle cx="100" cy="55" r="4" fill="rgba(0,245,255,0.8)" className="animate-pulse" />
                                    <line x1="100" y1="71" x2="100" y2="230" stroke="rgba(0,245,255,0.4)" strokeWidth="2.5" />
                                    
                                    {/* Biomechanical Joints */}
                                    <circle cx="70" cy="110" r="3.5" fill="#00f5ff" className="animate-pulse" />
                                    <circle cx="130" cy="110" r="3.5" fill="#00f5ff" className="animate-pulse" />
                                    <circle cx="50" cy="165" r="2.5" fill="#39ff14" />
                                    <circle cx="150" cy="165" r="2.5" fill="#39ff14" />
                                    <circle cx="85" cy="230" r="4" fill="#00f5ff" />
                                    <circle cx="115" cy="230" r="4" fill="#00f5ff" />
                                    <circle cx="70" cy="300" r="3" fill="#39ff14" />
                                    <circle cx="130" cy="300" r="3" fill="#39ff14" />
                                    <circle cx="75" cy="370" r="2.5" fill="#00f5ff" />
                                    <circle cx="125" cy="370" r="2.5" fill="#00f5ff" />

                                    {/* SHOULDERS (Anterior Deltoids) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('shoulder')}
                                        onMouseEnter={() => { setHoveredMuscle('shoulder'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M72,99 C60,105 52,115 54,128 C56,135 60,135 64,124 Z" fill={selectedMuscle === 'shoulder' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'shoulder' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" className="transition-all duration-300" />
                                        <path d="M128,99 C140,105 148,115 146,128 C144,135 140,135 136,124 Z" fill={selectedMuscle === 'shoulder' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'shoulder' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>

                                    {/* CHEST (Pectorals) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('chest')}
                                        onMouseEnter={() => { setHoveredMuscle('chest'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M78,110 L100,113 L100,145 L76,140 Z" fill={selectedMuscle === 'chest' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'chest' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                        <path d="M122,110 L100,113 L100,145 L124,140 Z" fill={selectedMuscle === 'chest' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'chest' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>

                                    {/* BICEPS */}
                                    <g 
                                        onClick={() => setSelectedMuscle('bicep')}
                                        onMouseEnter={() => { setHoveredMuscle('bicep'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <ellipse cx="51" cy="150" rx="7" ry="14" fill={selectedMuscle === 'bicep' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'bicep' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" transform="rotate(-5, 51, 150)" className="transition-all duration-300" />
                                        <ellipse cx="149" cy="150" rx="7" ry="14" fill={selectedMuscle === 'bicep' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'bicep' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" transform="rotate(5, 149, 150)" className="transition-all duration-300" />
                                    </g>

                                    {/* LEGS (Quadriceps) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('leg')}
                                        onMouseEnter={() => { setHoveredMuscle('leg'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M72,240 C80,240 86,270 84,300 C74,300 70,280 72,240 Z" fill={selectedMuscle === 'leg' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'leg' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                        <path d="M128,240 C120,240 114,270 116,300 C126,300 130,280 128,240 Z" fill={selectedMuscle === 'leg' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'leg' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>
                                </svg>
                            </div>

                            {/* POSTERIOR (Back) Skeleton */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-neonGreen uppercase font-black tracking-[0.2em] mb-4 drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Posterior (Back)</span>
                                <svg width="280" height="540" viewBox="0 0 200 400" className="drop-shadow-[0_0_20px_rgba(0,245,255,0.25)]">
                                    {/* Stylized Cyborg Grid Background lines */}
                                    <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(0,245,255,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(0,245,255,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="250" x2="200" y2="250" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="0" y1="300" x2="200" y2="300" stroke="rgba(0,245,255,0.08)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="350" x2="200" y2="350" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    
                                    <line x1="50" y1="0" x2="50" y2="400" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />
                                    <line x1="100" y1="0" x2="100" y2="400" stroke="rgba(0,245,255,0.12)" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="150" y1="0" x2="150" y2="400" stroke="rgba(0,245,255,0.03)" strokeWidth="1" strokeDasharray="2" />

                                    {/* Back contour */}
                                    <path 
                                        d="M100,30 C120,30 130,45 130,60 C130,70 125,80 115,85 L115,100 L145,115 L155,170 L145,230 L135,230 L130,300 L120,380 L100,380 L80,380 L70,300 L65,230 L55,230 L45,170 L55,115 L85,100 L85,85 C75,80 70,70 70,60 C70,45 80,30 100,30 Z" 
                                        fill="rgba(0,0,0,0.4)" 
                                        stroke="rgba(255,255,255,0.15)" 
                                        strokeWidth="2" 
                                    />

                                    {/* Spine and Shoulders mechanics */}
                                    <line x1="100" y1="71" x2="100" y2="230" stroke="rgba(57,255,20,0.4)" strokeWidth="2.5" />
                                    <path d="M90,130 L110,130 M90,145 L110,145 M90,160 L110,160 M90,175 L110,175 M90,190 L110,190 M90,205 L110,205" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                                    {/* Head Brain Core */}
                                    <circle cx="100" cy="55" r="16" fill="rgba(57,255,20,0.05)" stroke="rgba(57,255,20,0.3)" strokeWidth="1.5" />
                                    <circle cx="100" cy="55" r="4" fill="rgba(57,255,20,0.8)" className="animate-pulse" />
                                    
                                    {/* Biomechanical Joints */}
                                    <circle cx="70" cy="110" r="3.5" fill="#39ff14" className="animate-pulse" />
                                    <circle cx="130" cy="110" r="3.5" fill="#39ff14" className="animate-pulse" />
                                    <circle cx="50" cy="165" r="2.5" fill="#00f5ff" />
                                    <circle cx="150" cy="165" r="2.5" fill="#00f5ff" />
                                    <circle cx="85" cy="230" r="4" fill="#39ff14" />
                                    <circle cx="115" cy="230" r="4" fill="#39ff14" />
                                    <circle cx="70" cy="300" r="3" fill="#00f5ff" />
                                    <circle cx="130" cy="300" r="3" fill="#00f5ff" />
                                    <circle cx="75" cy="370" r="2.5" fill="#39ff14" />
                                    <circle cx="125" cy="370" r="2.5" fill="#39ff14" />

                                    {/* BACK (Trapezius & Latissimus Dorsi) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('back')}
                                        onMouseEnter={() => { setHoveredMuscle('back'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M80,105 L100,90 L120,105 L124,165 L100,185 L76,165 Z" fill={selectedMuscle === 'back' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'back' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>

                                    {/* SHOULDERS (Posterior Deltoids) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('shoulder')}
                                        onMouseEnter={() => { setHoveredMuscle('shoulder'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M72,99 C60,105 52,115 54,128 C56,135 60,135 64,124 Z" fill={selectedMuscle === 'shoulder' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'shoulder' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" className="transition-all duration-300" />
                                        <path d="M128,99 C140,105 148,115 146,128 C144,135 140,135 136,124 Z" fill={selectedMuscle === 'shoulder' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'shoulder' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>

                                    {/* TRICEPS */}
                                    <g 
                                        onClick={() => setSelectedMuscle('tricep')}
                                        onMouseEnter={() => { setHoveredMuscle('tricep'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <ellipse cx="49" cy="152" rx="6" ry="13" fill={selectedMuscle === 'tricep' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'tricep' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" transform="rotate(-5, 49, 152)" className="transition-all duration-300" />
                                        <ellipse cx="151" cy="152" rx="6" ry="13" fill={selectedMuscle === 'tricep' ? 'rgba(57,255,20,0.5)' : hoveredMuscle === 'tricep' ? 'rgba(57,255,20,0.35)' : 'rgba(57,255,20,0.1)'} stroke="#39ff14" strokeWidth="1.5" transform="rotate(5, 151, 152)" className="transition-all duration-300" />
                                    </g>

                                    {/* LEGS (Hamstrings/Glutes) */}
                                    <g 
                                        onClick={() => setSelectedMuscle('leg')}
                                        onMouseEnter={() => { setHoveredMuscle('leg'); }}
                                        onMouseLeave={() => setHoveredMuscle('')}
                                        className="cursor-pointer group"
                                    >
                                        <path d="M72,240 C80,240 86,270 84,300 C74,300 70,280 72,240 Z" fill={selectedMuscle === 'leg' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'leg' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                        <path d="M128,240 C120,240 114,270 116,300 C126,300 130,280 128,240 Z" fill={selectedMuscle === 'leg' ? 'rgba(0,245,255,0.5)' : hoveredMuscle === 'leg' ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'} stroke="#00f5ff" strokeWidth="1.5" className="transition-all duration-300" />
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* Interactive scanner overlay help tip */}
                        <div className="w-full flex items-center justify-between mt-4 px-4 text-xs text-textMuted border-t border-black/10 dark:border-white/10 pt-3">
                            <span className="flex items-center gap-1.5">
                                <Info size={14} className="text-neonGreen animate-pulse" />
                                Click glowing regions to load target exercises.
                            </span>
                            <span className="font-bold text-neonGreen">
                                Active Target: {selectedMuscle.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Sidebar Panel detailing workout illustrations */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {selectedMuscle && MUSCLE_DETAILS[selectedMuscle] ? (
                            <div className="glass-card p-6 border-neonGreen/20 flex flex-col h-[620px] animate-fade-in">
                                <div className="border-b border-black/10 dark:border-white/10 pb-3 flex-shrink-0">
                                    <span className="text-[9px] bg-neonGreen/10 text-neonGreen font-extrabold py-0.5 px-2 rounded-full uppercase tracking-wider">
                                        Synthesized Target Profile
                                    </span>
                                    <h3 className="text-2xl font-black text-textMain mt-1 text-neonGreen">
                                        {MUSCLE_DETAILS[selectedMuscle].name}
                                    </h3>
                                    <p className="text-sm text-textMuted mt-1 leading-relaxed">
                                        {MUSCLE_DETAILS[selectedMuscle].desc}
                                    </p>
                                </div>

                                <div className="overflow-y-auto pr-2 mt-4 space-y-4 flex-grow">
                                    {/* Targeted Fibers Checklist */}
                                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/5 space-y-2 flex-shrink-0">
                                        <span className="text-xs font-bold text-textMuted uppercase block tracking-wider">Anatomical Focus:</span>
                                        <div className="flex items-center gap-2 text-textMain text-sm">
                                            <CheckCircle2 size={16} className="text-electricCyan" />
                                            <span>{MUSCLE_DETAILS[selectedMuscle].target}</span>
                                        </div>
                                    </div>

                                    {/* Exercise Details Card with Neon Illustration */}
                                    <div className="space-y-3 pt-2">
                                        <span className="text-xs font-bold text-textMuted uppercase block tracking-wider">Target Biomechanical Exercises:</span>
                                        
                                        {MUSCLE_DETAILS[selectedMuscle].workouts.map((w, idx) => (
                                            <div key={idx} className="bg-black/40 border border-glassBorder rounded-2xl overflow-hidden p-4 space-y-4 shadow-lg group hover:border-neonGreen/30 transition-colors">
                                                {/* Futuristic Cyberpunk Exercise Image */}
                                                <div className="w-full h-56 rounded-xl overflow-hidden bg-black/60 relative border border-white/5 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] transition-all flex-shrink-0 flex items-center justify-center">
                                                    <img 
                                                        src={w.img} 
                                                        alt={w.name} 
                                                        className="w-full h-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-105" 
                                                    />
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-neonGreen font-bold px-2 py-0.5 rounded border border-neonGreen/30">
                                                        {w.level}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-lg font-bold text-textMain group-hover:text-neonGreen transition-colors">{w.name}</h4>
                                                        <span className="text-xs text-electricCyan font-bold">{w.reps}</span>
                                                    </div>
                                                    <p className="text-xs text-textMuted leading-relaxed">
                                                        <strong className="text-neonGreen">Coach Tip:</strong> {w.tip}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[460px] opacity-0 pointer-events-none"></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIWorkout;

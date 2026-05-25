import { Zap, Check } from 'lucide-react';

const PlanCard = ({ plan, onSelect }) => {
    return (
        <div className="glass-card p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonGreen/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-neonGreen/20 transition-colors"></div>
            
            <h3 className="text-xl font-bold text-textMain mb-2">{plan.name}</h3>
            <div className="mb-4">
                <span className="text-4xl font-extrabold text-neonGreen">₹{plan.price}</span>
                <span className="text-textMuted"> / {plan.durationDays} days</span>
            </div>
            
            <p className="text-sm text-textMain mb-6 flex-1">{plan.description}</p>
            
            <ul className="space-y-3 mb-8">
                {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-textMain">
                        <Check size={16} className="text-electricCyan mt-0.5 shrink-0" />
                        <span>{feat}</span>
                    </li>
                ))}
            </ul>
            
            <button 
                onClick={() => onSelect(plan._id)}
                className="w-full neon-button flex justify-center items-center gap-2"
            >
                <Zap size={18} /> Choose Plan
            </button>
        </div>
    );
};

export default PlanCard;

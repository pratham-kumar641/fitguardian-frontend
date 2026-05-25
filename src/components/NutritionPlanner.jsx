import { useState } from 'react';

const NutritionPlanner = () => {
    const [goal, setGoal] = useState('maintain');
    const [weight, setWeight] = useState('');
    const [macros, setMacros] = useState(null);

    const calculateMacros = (e) => {
        e.preventDefault();
        const w = parseFloat(weight);
        if (!w) return;

        let baseCalories = w * 24; // very rough basal metabolic rate estimate
        
        let targetCalories = baseCalories;
        if (goal === 'lose') targetCalories -= 500;
        if (goal === 'gain') targetCalories += 500;

        const protein = (w * 2).toFixed(0); // 2g per kg
        const fats = ((targetCalories * 0.25) / 9).toFixed(0); // 25% from fat
        const carbs = ((targetCalories - (protein * 4) - (fats * 9)) / 4).toFixed(0);

        setMacros({
            calories: targetCalories.toFixed(0),
            protein,
            fats,
            carbs
        });
    };

    return (
        <div className="glass-card p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-neonGreen mb-4 flex items-center gap-2">
                Macro Planner
            </h2>
            <form onSubmit={calculateMacros} className="space-y-4">
                <div>
                    <label className="block text-sm text-textMuted mb-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="input-field"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm text-textMuted mb-1">Goal</label>
                    <select 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="input-field appearance-none"
                    >
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain</option>
                        <option value="gain">Gain Muscle</option>
                    </select>
                </div>
                <button type="submit" className="neon-button w-full">Calculate Macros</button>
            </form>

            {macros && (
                <div className="mt-6 space-y-3">
                    <div className="p-3 bg-surface rounded-lg border border-black/10 dark:border-white/10 text-center">
                        <p className="text-xs text-textMuted uppercase tracking-wider">Daily Calories</p>
                        <p className="text-2xl font-bold text-textMain">{macros.calories} kcal</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-center border-t-2 border-red-400">
                            <p className="text-xs text-textMuted">Protein</p>
                            <p className="font-bold text-textMain">{macros.protein}g</p>
                        </div>
                        <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-center border-t-2 border-blue-400">
                            <p className="text-xs text-textMuted">Carbs</p>
                            <p className="font-bold text-textMain">{macros.carbs}g</p>
                        </div>
                        <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-center border-t-2 border-yellow-400">
                            <p className="text-xs text-textMuted">Fats</p>
                            <p className="font-bold text-textMain">{macros.fats}g</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionPlanner;
